const socket = io();
let room = "";
let username = "";

function joinChat() {
    username = document.getElementById("username").value;
    room = document.getElementById("room").value;

    if (!username || !room) return;

    socket.emit("join", { username, room });

    document.querySelector(".join-box").classList.add("hidden");
    document.querySelector(".chat-box").classList.remove("hidden");
}

socket.on("message", function(msg) {
    const div = document.createElement("div");

    if (msg.startsWith(username + ":")) {
        div.className = "my-message";
    } else {
        div.className = "other-message";
    }

    div.innerText = msg;
    document.getElementById("messages").appendChild(div);
    document.getElementById("messages").scrollTop =
        document.getElementById("messages").scrollHeight;
});

function sendMessage() {
    const message = document.getElementById("msg").value;
    if (message.trim() === "") return;

    socket.emit("message", { username, room, message });
    document.getElementById("msg").value = "";
}

document.getElementById("msg").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});
let typingTimeout;

document.getElementById("msg").addEventListener("input", () => {
    socket.emit("typing", { username, room });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        document.getElementById("typing-status").innerText = "";
    }, 1000);
});

