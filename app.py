from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
socketio = SocketIO(app)

rooms = {}

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('join')
def handle_join(data):
    room = data['room']
    username = data['username']

    if room not in rooms:
        rooms[room] = 0

    if rooms[room] >= 2:
        send("Room is full (only 2 users allowed).")
        return

    rooms[room] += 1
    join_room(room)
    send(f"{username} joined the chat.", to=room)

@socketio.on('message')
def handle_message(data):
    room = data['room']
    username = data['username']
    message = data['message']
    send(f"{username}: {message}", to=room)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=10000)

