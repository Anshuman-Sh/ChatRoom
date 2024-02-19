const socket = io();

const chatMessages = document.querySelector(".chat-messages");
const message = document.getElementById("msg");
const chatForm = document.getElementById("chat-form");
const roomName = document.getElementById("room-name");
const roomUsers = document.getElementById("users");

//Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//Join room
socket.emit("joinRoom", { username, room });

//Room and users info
socket.on("roomUsers", ({ room, users }) => {
  roomName.innerHTML = room;

  roomUsers.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
});

//Message from server
socket.on("message", (msg) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p class="text">${msg.text}</p>`;

  chatMessages.appendChild(div);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//ChatMessage send to server
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  socket.emit("chatMessage", msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});
