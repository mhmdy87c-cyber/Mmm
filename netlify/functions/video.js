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

  const prompt = getPrompt(event);

  if (!prompt) {
    return jsonResponse(400, { error: "Prompt is required" });
  }

  if (process.env.VIDEO_PLACEHOLDER_URL) {
    return jsonResponse(200, { video: process.env.VIDEO_PLACEHOLDER_URL });
  }

  return jsonResponse(200, {
    prompt,
    message: "Connect a video provider here, or set VIDEO_PLACEHOLDER_URL to preview a hosted video.",
  });
};
