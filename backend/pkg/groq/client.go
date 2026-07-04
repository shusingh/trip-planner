package groq

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

const (
	groqAPIEndpoint  = "https://api.groq.com/openai/v1/chat/completions"
	defaultModelName = "llama-3.3-70b-versatile"
)

// modelName returns the Groq model to use, overridable via GROQ_MODEL so a
// decommissioned model can be swapped without a code change.
func modelName() string {
	if m := os.Getenv("GROQ_MODEL"); m != "" {
		return m
	}
	return defaultModelName
}

// APIRequest represents the request payload for the Groq API.
type APIRequest struct {
	Messages       []Message       `json:"messages"`
	Model          string          `json:"model"`
	Temperature    float64         `json:"temperature,omitempty"`
	MaxTokens      int             `json:"max_tokens,omitempty"`
	TopP           float64         `json:"top_p,omitempty"`
	Stop           []string        `json:"stop,omitempty"`
	Stream         bool            `json:"stream,omitempty"`
	ResponseFormat *ResponseFormat `json:"response_format,omitempty"`
}

// ResponseFormat requests structured output from the API.
type ResponseFormat struct {
	Type string `json:"type"`
}

// Message represents a single message in the chat.
type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

// APIResponse represents the structure of the response from Groq API.
type APIResponse struct {
	ID      string   `json:"id"`
	Object  string   `json:"object"`
	Created int64    `json:"created"`
	Model   string   `json:"model"`
	Choices []Choice `json:"choices"`
	Usage   Usage    `json:"usage"`
}

// Choice represents one of the response choices from the API.
type Choice struct {
	Index        int     `json:"index"`
	Message      Message `json:"message"`
	FinishReason string  `json:"finish_reason"`
}

// Usage represents token usage statistics.
type Usage struct {
	PromptTokens     int `json:"prompt_tokens"`
	CompletionTokens int `json:"completion_tokens"`
	TotalTokens      int `json:"total_tokens"`
}

// QueryGroq sends the prompt to the Groq API and returns the model's response.
func QueryGroq(prompt string) (string, error) {
	apiKey := os.Getenv("GROQ_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("GROQ_API_KEY environment variable is not set")
	}

	reqBody := APIRequest{
		Messages: []Message{
			{Role: "user", Content: prompt},
		},
		Model:          modelName(),
		Temperature:    0.7,
		MaxTokens:      2000, // Corresponds to max_new_tokens in HF
		ResponseFormat: &ResponseFormat{Type: "json_object"},
	}

	bodyBytes, err := json.Marshal(reqBody)
	if err != nil {
		return "", fmt.Errorf("marshal payload: %w", err)
	}

	req, err := http.NewRequest("POST", groqAPIEndpoint, bytes.NewReader(bodyBytes))
	if err != nil {
		return "", fmt.Errorf("create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+apiKey)
	req.Header.Set("Content-Type", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("request error: %w", err)
	}
	defer resp.Body.Close()

	respBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("Groq API failed %d: %s", resp.StatusCode, respBytes)
	}

	var apiResp APIResponse
	if err := json.Unmarshal(respBytes, &apiResp); err != nil {
		return "", fmt.Errorf("unmarshal response: %w", err)
	}

	if len(apiResp.Choices) == 0 {
		return "", fmt.Errorf("empty response from Groq API")
	}

	return apiResp.Choices[0].Message.Content, nil
} 