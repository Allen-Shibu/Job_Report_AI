package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/fatih/color"
	"github.com/openai/openai-go/v2"
	"github.com/openai/openai-go/v2/option"
)

func main() {
	apiKey := os.Getenv("OPENROUTER_API_KEY")
	if apiKey == "" {
		log.Fatal("OPENROUTER_API_KEY is required")
	}

	client := openai.NewClient(
		option.WithBaseURL("https://openrouter.ai/api/v1"),
		option.WithAPIKey(apiKey),
	)

	// ── Server mode: go run . --server ─────────────────────────
	if len(os.Args) > 1 && os.Args[1] == "--server" {
		StartServer(client)
		return
	}

	// ── CLI mode (original behaviour) ──────────────────────────
	scanner := bufio.NewScanner(os.Stdin)

	color.Cyan("=== Company Legitimacy Agent ===")
	color.White("Type a company name to research. Type 'exit' to quit.\n")

	for {
		fmt.Print(color.GreenString("\nCompany > "))

		if !scanner.Scan() {
			break
		}

		input := strings.TrimSpace(scanner.Text())
		if input == "" {
			continue
		}
		if input == "exit" {
			color.White("bye")
			break
		}

		color.Cyan("\nResearching \"%s\"...\n", input)

		report, err := RunAgent(client, input)
		if err != nil {
			color.Red("Error: %s", err.Error())
			continue
		}

		printReport(report)
	}

	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
}

func printReport(report string) {
	lines := strings.Split(report, "\n")
	for _, line := range lines {
		switch {
		case strings.Contains(line, "## VERDICT: LEGIT"):
			color.Green(line)
		case strings.Contains(line, "## VERDICT: SUSPICIOUS"):
			color.Yellow(line)
		case strings.Contains(line, "## VERDICT: SCAM"):
			color.Red(line)
		case strings.Contains(line, "## RED FLAGS"):
			color.Red(line)
		case strings.HasPrefix(line, "##"):
			color.Cyan(line)
		default:
			fmt.Println(line)
		}
	}
}