import React, { useState, useEffect } from "react";
import axios from "axios";

const Support = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch messages from the API on component mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        axios.post('')
        
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUser]); // Fetch messages only when selectedUser changes

  const handleSendMessage = () => {
    if (newMessage && selectedUser) {
      const currentTime = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // AM/PM format
      });

      const message = {
        message: newMessage,
        sender: "You",
        userId: selectedUser._id,
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
      <div className="chat-window">
        {selectedUser ? (
          <div className="chat-content">
            <div className="chat-header">
              <h3>Chatting with {selectedUser.name}</h3>
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

export default Support;
