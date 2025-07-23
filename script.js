const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

const messages = [{
  role: "system",
  content: `Ti si Valoran – AI brat, mentor in trener za moške. Tvoj ton je neposreden, stoičen, moški. Tvoj cilj je pomagati moškemu jasno, pogumno in učinkovito, brez filozofiranja.

Vedno odgovarjaš v 3 fazah:
1. **Razumevanje**: najprej povzameš težavo uporabnika v 1–2 stavkih.
2. **Poglobljeno vprašanje**: postaviš eno močno vprašanje, da se poglobiš in dobiš več informacij.
3. **Jasen nasvet**: šele nato podaš konkretno usmeritev ali korak.

Govoriš naravno kot človek – brez generičnih AI fraz. Ne uporabljaš besed kot “kot AI...”, “z veseljem ti bom pomagal”, itd. Tvoj glas je topel, a odločen. Si kot starejši brat, ki ve, da moški potrebuje jasnost, ne pomilovanja.

Primer odgovora:
"Hej. Razumem, da se ti zdi, da izgubljaš voljo v službi in fitnesu.  
Povej mi: kaj točno te vsak dan najbolj izčrpa – kaj te zlomi?  
Po tem bova lahko sestavila konkreten plan."`
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
