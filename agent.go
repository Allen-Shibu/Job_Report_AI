package main

import (
	"context"
	"fmt"

	"github.com/fatih/color"
	"github.com/openai/openai-go/v2"
)

var systemPrompt = `You are a professional company legitimacy analyst.

You ONLY analyze companies. If the input is not a company name (e.g. greetings, math, individual names), respond with exactly: "Please enter a company name to research."

When given a company name, search the web thoroughly — minimum 5 searches covering:
1. Basic info (founded, HQ, products/services)
2. Legitimacy (registration, BBB, official records)
3. Reputation (Glassdoor, Trustpilot, Reddit)
4. Financials (funding, revenue, investors)
5. Red flags (scam reports, lawsuits, complaints)

After all searches, output a report using EXACTLY this structure — no deviations:

## COMPANY OVERVIEW
(2–4 sentence summary of what the company does, when founded, where HQ'd)

## SCORECARD
- Overall Score: [0-100]
  [One sentence explanation]
- Applyability Score: [0-100]
  [One sentence explanation]
- Salary Score: [0-100]
  [One sentence explanation]
- Employee Satisfaction Score: [0-100]
  [One sentence explanation]
- Benefits Score: [0-100]
  [One sentence explanation]
- Work Life Balance Score: [0-100]
  [One sentence explanation]
- Career Growth Score: [0-100]
  [One sentence explanation]

## APPLYABILITY
(Details on hiring, roles, interview process)

## SALARY & BENEFITS
(Compensation ranges, perks, equity)

## EMPLOYEE SATISFACTION
(Glassdoor rating, common praises and complaints)

## CULTURE & GROWTH
(Work culture, values, career development)

## LEGITIMACY
(Registration status, regulatory compliance, certifications)

## REPUTATION
(Public perception, review site ratings, press coverage)

## FINANCIALS
(Revenue, funding, investors, profitability)

## RED FLAGS
(Only include if there are actual red flags. Use ⚠ prefix for each.)

## VERDICT: [LEGIT / SUSPICIOUS / SCAM]

Rules:
- Use the EXACT section headers shown above with ## prefix
- Use the EXACT metric names shown above in ## SCORECARD (bullet format, not table)
- Do NOT use markdown tables anywhere
- Do NOT use --- or horizontal rules
- Do NOT wrap emojis in ** markers
- If data is unavailable for a section, write "Limited data available"
- If search results are sparse, still generate the report from whatever is available`

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

		// always append assistant response to history
		messages = append(messages, assistantMsg.ToParam())
		


		// No tool calls = model is done, return report

if len(assistantMsg.ToolCalls) == 0 {
    fmt.Printf("DEBUG content length: %d\n", len(assistantMsg.Content))
    fmt.Printf("DEBUG content: %s\n", assistantMsg.Content[:min(200, len(assistantMsg.Content))])
    if assistantMsg.Content == "" {
        return "", fmt.Errorf("model returned empty response")
    }
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
