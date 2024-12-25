import React, { useState, useEffect } from "react";
import axios from "axios";
import { TypeAnimation } from "react-type-animation";

const Typing = () => {
  const [user, setUser] = useState(null); // Store user data
  const [isLoading, setIsLoading] = useState(true); // Loading state for user data

  // Fetch user data from the API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem("email"); // Retrieve email from localStorage
        const res = await axios.post("http://localhost:4000/api/user", { email });
        setUser(res.data.user); // Save user data in state
        setIsLoading(false); // Set loading state to false after data is fetched
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Generate messages to show only first name and email
  const generateMessages = () => {
    if (!user) return [];
    return [
      `Welcome ${user.name}!`, // Show first name
      `Welcome ${user.email}`, // Show email
    ];
  };

  const messages = generateMessages();

  return (
    <div className="welcome-user-container">
      {isLoading ? (
        <h1 className="typing-effect">Loading user data...</h1>
      ) : (
        <TypeAnimation
          sequence={[
            ...messages, // Add the dynamic messages here
            1000, // Delay before the next message starts typing
          ]}
          wrapper="h1"
          speed={1} // Speed of typing effect
          style={{ fontSize: "2em", display: "inline-block" }}
          repeat={Infinity} // No repetition after the final message
        />
      )}
    </div>
  );
};

export default Typing;
