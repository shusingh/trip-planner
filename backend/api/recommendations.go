// Package handler is Vercel's required package name for a Go serverless
// function file under /api; this is the entry point for POST /api/recommendations.
package handler

import (
	"net/http"

	"github.com/shusingh/TripPlanner/backend/pkg/ratelimit"
	"github.com/shusingh/TripPlanner/backend/pkg/recommendations"
)

// corsMiddleware adds CORS headers and handles OPTIONS preflight.
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, HEAD, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Origin, X-requested-With, Content-Type, Accept, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// limiter is initialized once per warm function instance, so throttling is
// only best-effort across cold starts (no shared store across instances).
// That's an acceptable trade-off for a quota-abuse guard rather than a hard
// security boundary; move to a Redis/Vercel KV backed limiter if abuse proves
// to be a real problem in practice.
var limiter = ratelimit.New()

var chain = corsMiddleware(limiter.Middleware(http.HandlerFunc(recommendations.Handler)))

// Handler is the Vercel serverless entry point.
func Handler(w http.ResponseWriter, r *http.Request) {
	chain.ServeHTTP(w, r)
}
