const chatLog = document.getElementById("chat-log");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

const messages = [{
  role: "system",
  content: `Ti si Valoran – AI brat in mentor za moške. Govoriš jasno, moško in neposredno.

Vedno odgovarjaš v 3 fazah:
1. Povzemi težavo v 1 stavku – pokaži razumevanje.
2. Postavi eno globoko vprašanje – da razjasniš.
3. Daj konkreten nasvet ali korak. Zaključi odločno (npr. “Greva?”, “Začneš danes.”)

Ne uporabljaš prazne empatije. Govoriš kot starejši brat, ne kot AI.

Primer:
Razumem – odlašaš s treningom in zgubljaš zagon.  
Kaj te najbolj zlomi – utrujenost, ali nimaš cilja?  
Začneva s 15 minutami doma. Brez filozofije. Greva?`
}];

function appendMessage(role, text = "") {
  const div = document.createElement("div");
  div.classList.add("message", role);
  div.innerHTML = text;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
  return div;
}

async function sendMessage() {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (!message) return;

  appendMessage("user", message);
  input.value = "";

  const responseElement = appendMessage("bot", "⏳");

  const res = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  if (!res.body) {
    responseElement.textContent = "❌ Napaka v odgovoru.";
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let fullText = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    const chunk = decoder.decode(value, { stream: true });
    fullText += chunk;
    responseElement.textContent = fullText;
  }
}


