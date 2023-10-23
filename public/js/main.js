const chatForm = document.getElementById("chat-form");
const chatMessage = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const socket = io();

// Get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// console.log(username, room);

socket.emit("joinRoom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
  console.log(room, users);
  outputRoomName(room);
  outputUsersList(users);
});
// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  chatMessage.scrollTop = chatMessage.scrollHeight;
});

// Chat message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM

function outputMessage(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `
            <p class="meta">${msg.username} <span>${msg.time}</span></p>
            <p class="text">
              ${msg.text}
            </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsersList(users) {
  userList.innerHTML = `
   ${users.map((user) => `<li>${user.username}</li>`).join("")}
  `;
}
