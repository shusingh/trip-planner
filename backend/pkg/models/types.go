package models

// RecommendationRequest represents a user's request for travel recommendations.
type RecommendationRequest struct {
	Destination string   `json:"destination"` // e.g., "Paris, France"
	StartDate   string   `json:"startDate"`   // ISO-8601 date, e.g., "2025-05-01"
	EndDate     string   `json:"endDate"`     // ISO-8601 date, e.g., "2025-05-05"
	Tags        []string `json:"tags"`        // e.g., ["food", "culture"]
}

// Place represents a location or point of interest with its details.
type Place struct {
	Name        string  `json:"name"`                  // e.g., "Louvre Museum"
	Description string  `json:"description"`           // Brief detail about the place
	Latitude    float64 `json:"latitude"`              // Geographic latitude
	Longitude   float64 `json:"longitude"`             // Geographic longitude
	URL         string  `json:"url,omitempty"`         // Optional link for more info
}

// RecommendationResponse contains categorized travel suggestions.
type RecommendationResponse struct {
	Attractions []Place `json:"attractions"`          // Tourist attractions
	Food        []Place `json:"food"`                 // Recommended eateries
	Other       []Place `json:"other,omitempty"`      // Any additional suggestions
}
