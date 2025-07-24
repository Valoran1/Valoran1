const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");

function appendMessage(sender, message) {
  const msgDiv = document.createElement("div");
  msgDiv.className = sender;
  msgDiv.innerText = message;
  chatbox.appendChild(msgDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
}

async function sendMessage() {
  const message = userInput.value.trim();
  if (!message) return;

  appendMessage("user", message);
  userInput.value = "";

  const responseDiv = document.createElement("div");
  responseDiv.className = "bot";
  chatbox.appendChild(responseDiv);

  const response = await fetch("/.netlify/functions/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunk = decoder.decode(value);
    responseDiv.innerText += chunk;
    chatbox.scrollTop = chatbox.scrollHeight;
  }
}



