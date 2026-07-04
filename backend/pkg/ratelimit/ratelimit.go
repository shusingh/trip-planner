package ratelimit

import (
	"log"
	"net"
	"net/http"
	"strings"
	"sync"
	"time"

	"golang.org/x/time/rate"
)

const (
	// Each IP gets a small budget: bursts of 3, refilling one request every 20s.
	perIPRate  = rate.Limit(1.0 / 20.0)
	perIPBurst = 3

	// Global ceiling across all visitors, kept under Groq's 30 req/min free tier.
	globalRate  = rate.Limit(25.0 / 60.0)
	globalBurst = 10

	cleanupInterval = 10 * time.Minute
	staleAfter      = 15 * time.Minute
)

type visitor struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

// Limiter throttles requests per client IP and globally. State is in-memory,
// which is fine for a single instance; a restart simply resets the buckets.
type Limiter struct {
	mu       sync.Mutex
	visitors map[string]*visitor
	global   *rate.Limiter
}

func New() *Limiter {
	l := &Limiter{
		visitors: make(map[string]*visitor),
		global:   rate.NewLimiter(globalRate, globalBurst),
	}
	go l.cleanupLoop()
	return l
}

// Middleware rejects over-limit requests with 429 before they reach the
// handler (and therefore before they spend any Groq quota).
func (l *Limiter) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ip := clientIP(r)
		if !l.allow(ip) {
			log.Printf("⚠️  ratelimit: throttled %s %s from %s", r.Method, r.URL.Path, ip)
			w.Header().Set("Retry-After", "20")
			http.Error(w, "too many requests, please slow down", http.StatusTooManyRequests)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (l *Limiter) allow(ip string) bool {
	l.mu.Lock()
	v, ok := l.visitors[ip]
	if !ok {
		v = &visitor{limiter: rate.NewLimiter(perIPRate, perIPBurst)}
		l.visitors[ip] = v
	}
	v.lastSeen = time.Now()
	l.mu.Unlock()

	return v.limiter.Allow() && l.global.Allow()
}

func (l *Limiter) cleanupLoop() {
	for range time.Tick(cleanupInterval) {
		l.mu.Lock()
		for ip, v := range l.visitors {
			if time.Since(v.lastSeen) > staleAfter {
				delete(l.visitors, ip)
			}
		}
		l.mu.Unlock()
	}
}

// clientIP resolves the real client address. Render sits behind a proxy, so
// the first entry of X-Forwarded-For is the client; fall back to RemoteAddr.
func clientIP(r *http.Request) string {
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		if first, _, ok := strings.Cut(xff, ","); ok {
			return strings.TrimSpace(first)
		}
		return strings.TrimSpace(xff)
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}
