package main

import (
  "log"
  "net/http"

  "github.com/joho/godotenv"
  "github.com/shusingh/TripPlanner/backend/pkg/config"
  "github.com/shusingh/TripPlanner/backend/pkg/ratelimit"
  "github.com/shusingh/TripPlanner/backend/pkg/recommendations"
)

// corsMiddleware adds CORS headers and handles OPTIONS preflight.
func corsMiddleware(next http.Handler) http.Handler {
  return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
    // Allow your frontend’s origin (or use "*" to allow all)
    w.Header().Set("Access-Control-Allow-Origin", "*")
    w.Header().Set("Access-Control-Allow-Methods", "POST, GET, HEAD, PUT, DELETE, OPTIONS")
    w.Header().Set("Access-Control-Allow-Headers", "Origin, X-requested-With, Content-Type, Accept, Authorization")

    // Preflight request
    if r.Method == http.MethodOptions {
      w.WriteHeader(http.StatusOK)
      return
    }

    next.ServeHTTP(w, r)
  })
}

func main() {
  // Load .env locally; in production it'll just log a warning
  if err := godotenv.Load(); err != nil {
    log.Printf("No .env file found or could not load: %v", err)
  }

  cfg, err := config.LoadConfig()
  if err != nil {
    log.Fatalf("failed to load config: %v", err)
  }

  // Wrap the recommendations.Handler with CORS and per-IP rate limiting.
  // Rate limiting sits inside CORS so 429 responses still carry CORS headers.
  limiter := ratelimit.New()
  http.Handle(
    "/api/recommendations",
    corsMiddleware(limiter.Middleware(http.HandlerFunc(recommendations.Handler))),
  )

  addr := ":" + cfg.Port
  log.Printf("Server listening on http://localhost%s", addr)
  if err := http.ListenAndServe(addr, nil); err != nil {
    log.Fatalf("server failed: %v", err)
  }
}
