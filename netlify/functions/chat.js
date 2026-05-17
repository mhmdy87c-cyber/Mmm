const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
}

function getPrompt(event) {
  try {
    const body = JSON.parse(event.body || "{}");
    return typeof body.prompt === "string" ? body.prompt.trim() : "";
  } catch {
    return "";
  }
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return jsonResponse(500, { error: "Missing OPENAI_API_KEY environment variable" });
  }

  const prompt = getPrompt(event);

  if (!prompt) {
    return jsonResponse(400, { error: "Prompt is required" });
  }

  const response = await fetch(OPENAI_RESPONSES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TEXT_MODEL || "gpt-5.4-mini",
      input: prompt,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return jsonResponse(response.status, {
      error: data.error?.message || "OpenAI chat request failed",
    });
  }

  return jsonResponse(200, {
    reply: data.output_text || "I could not produce a text reply.",
  });
};
