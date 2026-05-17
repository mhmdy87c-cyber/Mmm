const OPENAI_IMAGES_URL = "https://api.openai.com/v1/images/generations";

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

  const response = await fetch(OPENAI_IMAGES_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_IMAGE_MODEL || "gpt-image-1.5",
      prompt,
      n: 1,
      size: "1024x1024",
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return jsonResponse(response.status, {
      error: data.error?.message || "OpenAI image request failed",
    });
  }

  const generated = data.data?.[0];

  if (!generated?.b64_json && !generated?.url) {
    return jsonResponse(502, { error: "Image response did not include image data" });
  }

  return jsonResponse(200, {
    image: generated.b64_json
      ? `data:image/png;base64,${generated.b64_json}`
      : generated.url,
  });
};
