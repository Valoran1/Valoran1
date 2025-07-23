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

async function sendMessage(message) {
  appendMessage("user", message);
  userInput.value = "";
  messages.push({ role: "user", content: message });

  const botDiv = appendMessage("bot", "<span class='cursor'>_</span>");
  const cursor = botDiv.querySelector(".cursor");

  try {
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let result = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const jsonMatch = chunk.match(/{.*}/s);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        if (data.reply) {
          result += data.reply;
          botDiv.innerHTML = result.replace(/\n/g, "<br>") + `<span class='cursor'>_</span>`;
        }
      }
    }

    messages.push({ role: "assistant", content: result });
    botDiv.innerHTML = result.replace(/\n/g, "<br>");
  } catch (error) {
    botDiv.innerHTML = "Napaka v komunikaciji.";
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


