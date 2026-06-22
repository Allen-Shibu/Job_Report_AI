package main

import (
	"context"
	"fmt"

	"github.com/fatih/color"
	"github.com/openai/openai-go/v2"
)

var systemPrompt = `You are a professional company legitimacy analyst.

When given a company name, you MUST search the web to research it thoroughly.
Do a minimum of 5 searches covering:
1. Basic info (founded, HQ, what they do)
2. Legitimacy (registration, BBB, official records)
3. Reputation (Glassdoor, Trustpilot, Reddit reviews)
4. Financials (funding, revenue, investors)
5. Red flags (scam reports, lawsuits, complaints, bad news)

You ONLY analyze companies. If the input is not a company name (e.g. math questions, general queries, greetings,individual name), respond with exactly: "Please enter a company name to research."
If the input is not a real company, respond with exactly: "This does not appear to be a real company."	
When given a company name, you MUST search the web...

After all searches, write a structured report with these exact sections:
## COMPANY OVERVIEW
## SCORECARD
## APPLYABILITY
## SALARY & BENEFITS
## EMPLOYEE SATISFACTION
## CULTURE & GROWTH
## LEGITIMACY
## REPUTATION
## FINANCIALS
## RED FLAGS
## VERDICT: [LEGIT / SUSPICIOUS / SCAM]

In ## SCORECARD, include these exact metrics, each scored from 0 to 100:
- Overall Score
- Applyability Score
- Salary Score
- Employee Satisfaction Score
- Benefits Score
- Work-Life Balance Score
- Career Growth Score

For each metric, give a brief explanation of why you assigned that score.
Be direct, evidence-based, and cite what you found.`

func RunAgent(client openai.Client, companyName string) (string, error) {
	ctx := context.Background()

	messages := []openai.ChatCompletionMessageParamUnion{
		openai.SystemMessage(systemPrompt),
		openai.UserMessage(fmt.Sprintf("Research this company and give me a full legitimacy report: %s", companyName)),
	}

	searchCount := 0

	// The agentic loop
	// keeps running until model stops calling tools
	for {
		params := openai.ChatCompletionNewParams{
			Model:    "openai/gpt-4o-mini",
			Messages: messages,
			Tools:    []openai.ChatCompletionToolUnionParam{webSearchToolDefinition},
		}

		res, err := client.Chat.Completions.New(ctx, params)
		if err != nil {
			return "", fmt.Errorf("LLM call failed: %v", err)
		}

		assistantMsg := res.Choices[0].Message

		// always append assistant response to history
		messages = append(messages, assistantMsg.ToParam())
		


		// No tool calls = model is done, return report

		if len(assistantMsg.ToolCalls) == 0 {
			return assistantMsg.Content, nil
		}


		// Model wants to call tools — execute each one

		for _, toolCall := range assistantMsg.ToolCalls {
			searchCount++
			color.Magenta("  [search %d] %s", searchCount, toolCall.Function.Arguments)

			// run the tool
			result := executeTool(toolCall.Function.Name, toolCall.Function.Arguments)

			// feed result back to model
			messages = append(messages, openai.ToolMessage(result, toolCall.ID))
		}

		// loop → model sees results → searches more or writes report
	}
}
