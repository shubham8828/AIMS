import React, { useState, useEffect } from "react";
import axios from "axios";

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages and users from the API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:4000/api/users");
        setUsers(usersResponse.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, []);

  const handleUserClick = async (userId, email) => {
    // Set selected user
    setSelectedUser(userId);

    try {
      // Fetch messages for the selected user based on their email ID
      const messagesResponse = await axios.post(
        "http://localhost:4001/messages",
        { email }
      );
      setMessages(messagesResponse.data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = () => {
    if (newMessage && selectedUser) {
      const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // AM/PM format
      });

      const message = {
        message: newMessage,
        sender: "admin",
        userId: selectedUser,
        time: currentTime, // Add the current time to the message
      };
      setMessages([...messages, message]);
      setNewMessage(""); // Clear the input field after sending the message
    }
  };

  const formatMessageTime = (createdAt) => {
    const time = new Date(createdAt).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true, // AM/PM format
    });
    return time;
  };

  return (
    <div className="chat-container">
      <div className="user-list">
        <h3>AIMS Users</h3>
        <ul>
          {users.map((user) => (
            <li
              key={user._id}
              onClick={() => handleUserClick(user._id, user.email)}
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
                  className={msg.sender === "You" ? "sent" : "received"}
                >
                  <p>{msg.message}</p>
                  <span className="message-time">
                    {msg.sender === "You"
                      ? msg.time
                      : formatMessageTime(msg.createdAt)}{" "}
                    {/* Format the time depending on whether it's a sent or received message */}
                  </span>
                </div>
              ))}
            </div>

            {/* Input field at the bottom */}
            <div className="message-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button onClick={handleSendMessage}>Send</button>
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
