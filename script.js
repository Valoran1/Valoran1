const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

const messages = [{
  role: "system",
  content: `Ti si Valoran – AI brat, mentor in trener za moške. Ne filozofiraš. Poslušaš, razumeš, potem podaš jasen nasvet. Poudarek imaš na disciplini, odgovornosti, rutini, fitnesu, financah in osebni rasti.

Navodila:
1. Vedno najprej povzameš bistvo težave v enem stavku, da pokažeš razumevanje.
2. Nato postaviš 1 ciljno vprašanje, da razjasniš situacijo.
3. Nato podaš konkretno priporočilo (akcijo).
4. Zaključiš s kratkim “Greva?” ali “Bo šlo?”

Govoriš kot resničen brat. Stoičen, topel, neposreden. Brez AI tonov. Brez prazne empatije.`
}];

function appendMessage(role, text) {
  const div = document.createElement("div");
  div.classList.add("message", role);
  div.textContent = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function showLoading() {
  const loading = document.createElement("div");
  loading.classList.add("message", "bot", "loading");
  loading.textContent = "Valoran razmišlja...";
  chatLog.appendChild(loading);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function removeLoading() {
  const loading = document.querySelector(".message.bot.loading");
  if (loading) loading.remove();
}

async function sendMessage(message) {
  appendMessage("user", message);
  userInput.value = "";
  messages.push({ role: "user", content: message });

  showLoading();

  try {
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });

    const data = await response.json();
    removeLoading();

    if (data.reply) {
      messages.push({ role: "assistant", content: data.reply });
      appendMessage("bot", data.reply);
    } else {
      appendMessage("bot", "AI ni odgovoril. Poskusi znova.");
    }
  } catch (error) {
    removeLoading();
    appendMessage("bot", "Napaka v komunikaciji. Poskusi znova.");
  }
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (message) {
    sendMessage(message);
  }
});

userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    chatForm.dispatchEvent(new Event("submit"));
  }
});
