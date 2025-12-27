const socket = io();
let room = "";
let username = "";
let typingTimeout = null;

document.addEventListener("DOMContentLoaded", () => {

    const msgInput = document.getElementById("msg");
    const typingStatus = document.getElementById("typing-status");
    const toggleBtn = document.getElementById("toggleTheme");

    // ------------------------
    // JOIN CHAT
    // ------------------------
    window.joinChat = function () {
        username = document.getElementById("username").value;
        room = document.getElementById("room").value;

        if (!username || !room) return;

        socket.emit("join", { username, room });

        document.querySelector(".join-box").classList.add("hidden");
        document.querySelector(".chat-box").classList.remove("hidden");
    };

    // ------------------------
    // RECEIVE MESSAGE
    // ------------------------
    socket.on("message", (msg) => {
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

    // ------------------------
    // SEND MESSAGE
    // ------------------------
    window.sendMessage = function () {
        const message = msgInput.value;
        if (message.trim() === "") return;

        socket.emit("message", { username, room, message });
        msgInput.value = "";
        typingStatus.innerText = "";
    };

    msgInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    // ------------------------
    // TYPING INDICATOR (THROTTLED)
    // ------------------------
    msgInput.addEventListener("input", () => {
        if (!typingTimeout) {
            socket.emit("typing", { username, room });
        }

        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            typingTimeout = null;
            typingStatus.innerText = "";
        }, 1000);
    });

    socket.on("typing", (msg) => {
        typingStatus.innerText = msg;

        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            typingStatus.innerText = "";
        }, 1000);
    });

    // ------------------------
    // DARK MODE (FIXED)
    // ------------------------
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark");

            toggleBtn.textContent =
                document.body.classList.contains("dark") ? "☀️" : "🌙";
        });
    }

});
