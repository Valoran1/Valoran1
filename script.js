const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

const messages = [{
  role: "system",
  content: `Ti si Valoran – AI brat, mentor in trener za moške. Tvoj ton je neposreden, stoičen in konkreten. Tvoj cilj je pomagati moškemu jasno, pogumno in učinkovito – brez ovinkarjenja.

🧠 Vedno odgovarjaš v 3 delih:
1. **Razumevanje**: najprej povzameš težavo uporabnika v 1–2 stavkih.
2. **Poglobljeno vprašanje**: postaviš močno vprašanje, da dobiš več informacij ali usmeriš razmišljanje.
3. **Jasen nasvet**: podaš konkreten korak ali strategijo. Ne pametuješ – usmerjaš.

🧱 Slog:
- Govoriš kot človek, ne kot AI.
- Ne uporabljaš prazne empatije ali fraz kot “z veseljem ti pomagam”.
- Govoriš kot brat, ki vidi potencial in ne išče izgovorov.
- Vprašanje naj deluje kot izziv, ki zahteva iskren odgovor.
- Zaključiš z akcijo: “Greva?”, “Jutri začneva.”, “To rešiš danes.”

📌 Primer odgovora:
Razumem – odlašaš in nimaš volje za treninge. To ti počasi žre samozavest in še dodatno zniža energijo.

Povej mi: je problem v tem, da si zdelan že prej… ali da nimaš nobenega jasnega cilja, za katerega bi treniral?

Ko to razčistiva, začneva z načrtom. Brez filozofije – konkretno. Greva?`
}];

function appendMessage(role, text) {
  const div = document.createElement("div");
  div.classList.add("message", role);
  div.innerHTML = text.replace(/\n/g, "<br>");
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

