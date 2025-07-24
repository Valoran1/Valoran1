const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");

function appendMessage(sender, message) {
  const msgDiv = document.createElement("div");
  msgDiv.className = sender;
  msgDiv.innerText = message;
  chatbox.appendChild(msgDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
  return msgDiv;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  userInput.value = "";

  const responseDiv = appendMessage("bot", "...");
  
  const response = await fetch("/.netlify/functions/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok || !response.body) {
    responseDiv.innerText = "Napaka pri pridobivanju odgovora.";
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let done = false;
  let fullText = "";

  responseDiv.innerText = "";

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunk = decoder.decode(value);
    fullText += chunk;
    responseDiv.innerText = fullText;
    chatbox.scrollTop = chatbox.scrollHeight;
  }
}

// Pošlji s klikom Enter
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});


