import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPaperPlane } from "react-icons/fa"; // Import icons from react-icons

const Support = () => {
  const [messages, setMessages] = useState([]); // Stores the chat messages
  const [newMessage, setNewMessage] = useState(""); // Tracks the new message input

  // Fetch existing messages on component mount
  useEffect(() => {
    getMessageData();


  }, []); // Empty dependency array ensures the effect runs once when the component mounts


  const getMessageData = () => {
    const sender = localStorage.getItem("email");
    const receiver = "aimps24x7@gmail.com";
  
    axios
      .post("http://localhost:4000/api/messages", { sender, receiver })
      .then((response) => {
        setMessages(response.data.conversation.message);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  };
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
  
    // New message structure
    const newMessageObject = {
      sender: localStorage.getItem("email"),
      msg: newMessage,
      createdAt: Date.now(),
    };
  
    // Update the messages state with the new message
    setMessages((prevMessages) => [...prevMessages, newMessageObject]);
    setNewMessage(""); // Clear the input field
  
    // Collect all data in the required format
    const collectedData = {
      sender: localStorage.getItem("email"),
      receiver: "aimps24x7@gmail.com",
      message: [newMessageObject], // Include only the new message
    };
    
    // Send collected data to the API
    axios
      .post("http://localhost:4000/api/newmessage", collectedData)
      .then((response) => {
        console.log("Message sent successfully:", response.data); 
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });
  };
  

  // Function to determine if the message is from the user or received
  const getMessageClass = (sender) => {
    return sender === localStorage.getItem("email") ? "sent" : "received";
  }

  return (
    <div className="chat-container">
      <h3 className="chat-header">Chatting With Admin</h3>

      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${getMessageClass(msg.sender)}`}>
            <p className="message-text">{msg.msg}</p>
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
        {/* Send button with icon */}
        <button onClick={handleSendMessage}>
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Support;
