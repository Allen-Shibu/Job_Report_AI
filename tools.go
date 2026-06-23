package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"

	"github.com/openai/openai-go/v2"
)

var webSearchToolDefinition = openai.ChatCompletionFunctionTool(
	openai.FunctionDefinitionParam{
		Name:        "web_search",
		Description: openai.String("Search the web for information about a company."),
		Parameters: openai.FunctionParameters{
			"type": "object",
			"properties": map[string]any{
				"query": map[string]any{
					"type":        "string",
					"description": "The search query to use.",
				},
			},
			"required": []string{"query"},
		},
	},
)

type serperRequest struct {
	Query string `json:"q"`
	Num   int    `json:"num"`
}

type serperResponse struct {
	Organic []struct {
		Title   string `json:"title"`
		Snippet string `json:"snippet"`
		Link    string `json:"link"`
	} `json:"organic"`
	KnowledgeGraph *struct {
		Title       string `json:"title"`
		Description string `json:"description"`
	} `json:"knowledgeGraph"`
}

func websearch(query string) (string, error) {
	apiKey := os.Getenv("SERPER_API_KEY")
	if apiKey == "" {
		return "", fmt.Errorf("SERPER_API_KEY environment variable is not set")
	}

	body, err := json.Marshal(serperRequest{Query: query, Num: 5})
	if err != nil {
		return "", fmt.Errorf("failed to marshal request body: %v", err)
	}

	req, err := http.NewRequest("POST", "https://google.serper.dev/search", bytes.NewBuffer(body))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %v", err)
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-API-KEY", apiKey)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return "", fmt.Errorf("request failed with status: %s", resp.Status)
	}

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %v", err)
	}

	var result serperResponse
	if err := json.Unmarshal(data, &result); err != nil {
		return "", fmt.Errorf("failed to parse response: %v", err)
	}

	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("Search Results for \"%s\"\n\n", query))

	if result.KnowledgeGraph != nil {
		sb.WriteString("Knowledge Graph:\n")
		sb.WriteString(fmt.Sprintf("Title: %s\n", result.KnowledgeGraph.Title))
		sb.WriteString(fmt.Sprintf("Description: %s\n\n", result.KnowledgeGraph.Description))
	}

	if len(result.Organic) == 0 {
		sb.WriteString("No results found.")
		return sb.String(), nil
	}

	for i, r := range result.Organic {
		sb.WriteString(fmt.Sprintf("[%d] %s\n", i+1, r.Title))
		sb.WriteString(fmt.Sprintf("    %s\n", r.Snippet))
		sb.WriteString(fmt.Sprintf("    %s\n\n", r.Link))
	}

	return sb.String(), nil
}

func executeTool(name string, arguments string) string {
	switch name {
	case "web_search":
		var args struct {
			Query string `json:"query"`
		}
		if err := json.Unmarshal([]byte(arguments), &args); err != nil {
			return fmt.Sprintf("Error parsing args: %s", err.Error())
		}
		result, err := websearch(args.Query)
		if err != nil {
			return fmt.Sprintf("Error: %s", err.Error())
		}
		return result

	default:
		return fmt.Sprintf("Unknown tool: %s", name)
	}
}
