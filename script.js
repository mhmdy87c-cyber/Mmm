const chat = document.getElementById("chat");
const promptInput = document.getElementById("prompt");
const result = document.getElementById("result");
const buttons = {
  chat: document.getElementById("chat-button"),
  image: document.getElementById("image-button"),
  video: document.getElementById("video-button"),
};

buttons.chat.addEventListener("click", askAI);
buttons.image.addEventListener("click", generateImage);
buttons.video.addEventListener("click", generateVideo);

promptInput.addEventListener("keydown", (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
    askAI();
  }
});

function getPrompt() {
  return promptInput.value.trim();
}

function addMessage(role, text, type = role.toLowerCase()) {
  const message = document.createElement("div");
  message.className = `message ${type}`;

  const label = document.createElement("strong");
  label.textContent = role;

  const content = document.createElement("span");
  content.textContent = text;

  message.append(label, content);
  chat.append(message);
  chat.scrollTop = chat.scrollHeight;
  return message;
}

function setLoading(isLoading, activeButton) {
  Object.values(buttons).forEach((button) => {
    button.disabled = isLoading;
  });

  if (activeButton) {
    activeButton.textContent = isLoading ? "Working..." : activeButton.dataset.label;
  }
}

Object.values(buttons).forEach((button) => {
  button.dataset.label = button.textContent;
});

async function postJSON(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data;
}

async function askAI() {
  const prompt = getPrompt();

  if (!prompt) {
    addMessage("Status", "Type a prompt first.", "status");
    return;
  }

  addMessage("You", prompt, "user");
  setLoading(true, buttons.chat);

  try {
    const data = await postJSON("/.netlify/functions/chat", { prompt });
    addMessage("AI", data.reply || "No reply returned.", "ai");
  } catch (error) {
    addMessage("Error", error.message, "error");
  } finally {
    setLoading(false, buttons.chat);
  }
}

async function generateImage() {
  const prompt = getPrompt();

  if (!prompt) {
    addMessage("Status", "Type an image prompt first.", "status");
    return;
  }

  result.innerHTML = "";
  setLoading(true, buttons.image);

  try {
    const data = await postJSON("/.netlify/functions/image", { prompt });
    const image = document.createElement("img");
    image.src = data.image;
    image.alt = `AI-generated image for: ${prompt}`;
    result.append(image);
  } catch (error) {
    addMessage("Error", error.message, "error");
  } finally {
    setLoading(false, buttons.image);
  }
}

async function generateVideo() {
  const prompt = getPrompt();

  if (!prompt) {
    addMessage("Status", "Type a video prompt first.", "status");
    return;
  }

  result.innerHTML = "";
  setLoading(true, buttons.video);

  try {
    const data = await postJSON("/.netlify/functions/video", { prompt });

    if (data.video) {
      const video = document.createElement("video");
      video.controls = true;
      video.src = data.video;
      result.append(video);
      return;
    }

    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `<strong>Video prompt ready:</strong> <span></span>`;
    card.querySelector("span").textContent = data.prompt || prompt;
    result.append(card);
  } catch (error) {
    addMessage("Error", error.message, "error");
  } finally {
    setLoading(false, buttons.video);
  }
}
