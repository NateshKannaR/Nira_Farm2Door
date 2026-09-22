/**
 * Nira AI — OpenRouter Multimodal Intelligence Client
 * Powers Agricultural AI Translation, Inspection, Pricing, Routing, and Forecasting.
 */

export const OPENROUTER_API_KEY =
  process.env.OPENROUTER_API_KEY ||
  process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
  "";

export const OPENROUTER_MODELS = [
  "openai/gpt-4o-mini",
  "meta-llama/llama-3.3-70b-instruct",
  "deepseek/deepseek-chat",
  "google/gemini-2.0-flash-exp:free",
  "qwen/qwen-2.5-72b-instruct",
];

export interface OpenRouterResponse {
  content: string;
  modelUsed: string;
  provider: string;
}

export async function callOpenRouter(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  options: {
    temperature?: number;
    jsonMode?: boolean;
    maxTokens?: number;
    timeoutMs?: number;
  } = {}
): Promise<OpenRouterResponse | null> {
  const apiKey = OPENROUTER_API_KEY;
  if (!apiKey) {
    return null;
  }

  const {
    temperature = 0.2,
    jsonMode = false,
    maxTokens = 1024,
    timeoutMs = 12000,
  } = options;

  for (const model of OPENROUTER_MODELS) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const payload: Record<string, any> = {
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      };

      if (jsonMode) {
        payload.response_format = { type: "json_object" };
      }

      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Nira AI - Direct Farm-to-Buyer Digital Agriculture",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        console.warn(
          `OpenRouter attempt for ${model} returned HTTP ${res.status}:`,
          errorText.slice(0, 150)
        );
        continue;
      }

      const data = await res.json();
      const text = data?.choices?.[0]?.message?.content?.trim();

      if (text) {
        return {
          content: text,
          modelUsed: model,
          provider: "OpenRouter AI (Multi-Model Gateway)",
        };
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.warn(`OpenRouter request notice for ${model}:`, err?.message);
    }
  }

  return null;
}
