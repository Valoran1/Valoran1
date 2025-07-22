const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

const messages = [{
  role: "system",
  content: `Ti si Valoran – moški brat in mentor. Govoriš kot človek, ne kot AI. Neposreden, zrel, empatičen. Najprej razumeš, potem svetuješ. Fokusiraš se na fitnes, finance, disciplino in življenje moškega, ki išče red in moč.`
}];

function appendMessage(role, text) {
  const div = document.createElement("div");
  div.classList.add("message", role);
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

async function sendMessage(message) {
  appendMessage("user", message);
  userInput.value = "";
  messages.push({ role: "user", content: message });

  appendMessage("bot", "Razmišljam...");

  const response = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages })
  });

  try {
    const data = await response.json();
    const botReply = data.reply;
    messages.push({ role: "assistant", content: botReply });
    removeLastBotMessage();
    appendMessage("bot", botReply);
  } catch (e) {
    removeLastBotMessage();
    appendMessage("bot", "Napaka: odgovor ni bil prejet.");
  }
}

function removeLastBotMessage() {
  const messages = chatLog.querySelectorAll(".message.bot");
  if (messages.length > 0) {
    chatLog.removeChild(messages[messages.length - 1]);
  }
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (message) {
    sendMessage(message);
  }
});

window.addEventListener("load", () => {
  appendMessage("bot", "Povej mi, s čim se boriš.");
});