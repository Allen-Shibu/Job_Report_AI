package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/openai/openai-go/v2"
)

// Event types streamed to the frontend 
type searchEvent struct {
	Type  string `json:"type"`
	Query string `json:"query"`
}

type reportEvent struct {
	Type    string `json:"type"`
	Content string `json:"content"`
}

type errorEvent struct {
	Type    string `json:"type"`
	Message string `json:"message"`
}

type notCompanyEvent struct {
	Type  string `json:"type"`
	Query string `json:"query"`
}

// sentinel returned by the LLM for non-company inputs
const notCompanySentinel = "Please enter a company name to research."

// writeEvent flushes a single JSON line 
func writeEvent(w http.ResponseWriter, v any) {
	b, _ := json.Marshal(v)
	fmt.Fprintf(w, "%s\n", b)
	if f, ok := w.(http.Flusher); ok {
		f.Flush()
	}
}

// CORS middleware 
func withCORS(h http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origin == "" {
			origin = "*"
		}
		w.Header().Set("Access-Control-Allow-Origin", origin)
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		h(w, r)
	}
}

// RunAgentStreaming: like RunAgent but emits events via channel ─
func RunAgentStreaming(
	ctx context.Context,
	client openai.Client,
	companyName string,
	onSearch func(query string),
) (string, error) {

	messages := []openai.ChatCompletionMessageParamUnion{
		openai.SystemMessage(systemPrompt),
		openai.UserMessage(fmt.Sprintf("Research this company and give me a full legitimacy report: %s", companyName)),
	}

	for {
		params := openai.ChatCompletionNewParams{
			Model:       "openai/gpt-oss-120b:free",
			Messages:    messages,
			Tools:       []openai.ChatCompletionToolUnionParam{webSearchToolDefinition},
			Temperature: openai.Float(0.0),
		}

		res, err := client.Chat.Completions.New(ctx, params)
		if err != nil {
			return "", fmt.Errorf("LLM call failed: %v", err)
		}

		assistantMsg := res.Choices[0].Message
		messages = append(messages, assistantMsg.ToParam())

		if len(assistantMsg.ToolCalls) == 0 {
			return assistantMsg.Content, nil
		}

		for _, toolCall := range assistantMsg.ToolCalls {
			// Parse query from arguments for the frontend
			var args struct {
				Query string `json:"query"`
			}
			_ = json.Unmarshal([]byte(toolCall.Function.Arguments), &args)
			if args.Query != "" {
				onSearch(args.Query)
			}

			result := executeTool(toolCall.Function.Name, toolCall.Function.Arguments)
			messages = append(messages, openai.ToolMessage(result, toolCall.ID))
		}
	}
}

// investigateHandler 
func investigateHandler(client openai.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
			return
		}

		var body struct {
			Company string `json:"company"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil || body.Company == "" {
			http.Error(w, `{"error":"company field required"}`, http.StatusBadRequest)
			return
		}

		// Stream NDJSON
		w.Header().Set("Content-Type", "application/x-ndjson")
		w.Header().Set("Cache-Control", "no-cache")
		w.Header().Set("X-Accel-Buffering", "no") // disable nginx buffering

		report, err := RunAgentStreaming(r.Context(), client, body.Company, func(query string) {
			writeEvent(w, searchEvent{Type: "search", Query: query})
		})

		if err != nil {
			writeEvent(w, errorEvent{Type: "error", Message: err.Error()})
			return
		}

		// LLM flagged input as non-company — tell the frontend gracefully
		lowerReport := strings.ToLower(report)
		if strings.Contains(lowerReport, "please enter a company name to research") {
			writeEvent(w, notCompanyEvent{Type: "not_company", Query: body.Company})
			return
		}

		writeEvent(w, reportEvent{Type: "report", Content: report})
	}
}

// StartServer ──
func StartServer(client openai.Client) {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	mux := http.NewServeMux()
	mux.HandleFunc("/investigate", withCORS(investigateHandler(client)))
	mux.HandleFunc("/health", withCORS(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintln(w, `{"status":"ok"}`)
	}))

	log.Printf("Server listening on :%s", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatal(err)
	}
}
