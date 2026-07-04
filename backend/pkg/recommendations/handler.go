package recommendations

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/shusingh/TripPlanner/backend/pkg/models"
)

// Handler processes HTTP requests for travel recommendations.
func Handler(w http.ResponseWriter, r *http.Request) {
  if r.Method != http.MethodPost {
    http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
    return
  }

  // Decode incoming JSON
  var req models.RecommendationRequest
  if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
    log.Printf("❌ Handler: invalid request payload: %v", err)
    http.Error(w, "invalid request payload", http.StatusBadRequest)
    return
  }
  log.Printf("ℹ️  Handler: got request %+v", req)

  resp, err := GetRecommendations(req)
  if err != nil {
    log.Printf("❌ Handler: GetRecommendations error: %v", err)
    // TODO: Check for specific Groq errors if needed in the future.
    // For now, we'll remove the specific hf.ErrQuotaExceeded check.
    http.Error(w, "internal server error", http.StatusInternalServerError)
    return
  }
  log.Printf("✅ Handler: sending response with %d attractions, %d food, %d other",
    len(resp.Attractions), len(resp.Food), len(resp.Other),
  )

  // Write JSON back to client
  w.Header().Set("Content-Type", "application/json")
  if err := json.NewEncoder(w).Encode(resp); err != nil {
    log.Printf("❌ Handler: error encoding JSON response: %v", err)
  }
}
