import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { payload } = req.body;

    if (!payload) return res.status(400).json({ error: "Missing payload" });

    const SYSTEM_PROMPT = `
You are a Web Sustainability Reporter.
You will receive a JSON payload containing precomputed numeric results (overall score, grade, dimension scores, CO2 estimate) and lightweight context.
Your job is ONLY to:
- Validate ranges (do not change numbers).
- Produce strengths, risks, recommendations, and a short_summary consistent with those numbers.
- Return a SINGLE JSON object exactly matching the schema.

Schema:
{
  "overall_score": number,
  "grade": "A"|"B"|"C"|"D"|"E",
  "est_co2_g_per_view": number,
  "dimensions": {
    "performance_efficiency": number,
    "accessibility": number,
    "energy_carbon": number,
    "hosting_policy": number,
    "responsible_ux": number
  },
  "strengths": string[],
  "risks": string[],
  "recommendations": string[],
  "short_summary": string
}

Rules:
- Never invent exact tech unless keywords appear in context.signal_counts (e.g., webp, cdn).
- If text is sparse, note uncertainty in risks.
- ≤6 items per list; crisp and actionable.
`;

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0,
        top_p: 1,
        seed: 42,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: JSON.stringify(payload) },
        ],
      }),
    });

    const data = await r.json();
    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
