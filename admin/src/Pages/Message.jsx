import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa";

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedUser && users.length > 0) {
      getMessageData();
    }
  }, [selectedUser, users]);

  const fetchData = async () => {
    try {
      const usersResponse = await axios.get("http://localhost:4000/api/users");
      setUsers(usersResponse.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getMessageData = () => {
    if (!selectedUser) return;

    const sender = "aimps24x7@gmail.com";
    const receiver = users.find((user) => user._id === selectedUser)?.email;

    if (!receiver) {
      console.error("Receiver email not found");
      return;
    }

    axios
      .post("http://localhost:4000/api/messages", { sender, receiver })
      .then((response) => {
        setMessages(response.data.conversation.message || []);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };

  const handleUserClick = (userId) => {
    setSelectedUser(userId);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;

    const newMessageObject = {
      sender: "aimps24x7@gmail.com",
      msg: newMessage,
      createdAt: Date.now(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessageObject]);
    setNewMessage("");

    const collectedData = {
      sender: "aimps24x7@gmail.com",
      receiver: users.find((user) => user._id === selectedUser)?.email,
      message: [newMessageObject],
    };

    if (!collectedData.receiver) {
      console.error("Receiver email not found for sending message");
      return;
    }

    axios
      .post("http://localhost:4000/api/newmessage", collectedData)
      .then((response) => {
        console.log("Message sent successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };

  return (
    <div className="chat-container">
      <div className="user-list">
        <h3>AIMS Users</h3>
        <ul>
          {users.map((user) => (
            <li
              key={user._id}
              onClick={() => handleUserClick(user._id)}
            >
              <div className="user-item">
                <img src={user.image} alt={user.name} className="user-avatar" />
                <span>{user.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-window">
        {selectedUser ? (
          <div className="chat-content">
            <div className="chat-header">
              <h3>
                Chatting with{" "}
                {users.find((user) => user._id === selectedUser)?.name}
              </h3>
            </div>
            <div className="messages">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={msg.sender === "aimps24x7@gmail.com" ? "sent" : "received"}
                >
                  <p>{msg.msg}</p>
                  <span className="message-time">
                    {new Date(msg.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>
              ))}
            </div>

            <div className="message-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>
                <FaPaperPlane />
              </button>
            </div>
          </div>
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Message;
