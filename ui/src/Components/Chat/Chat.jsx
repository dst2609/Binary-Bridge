import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Chat.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to send the current message to the backend and handle the response
  const handleSendMessage = async () => {
    if (input.trim() !== "") {
      const newMessage = {
        id: Date.now(),
        text: input,
        sender: "user",
        type: "input",
      };
      setMessages((messages) => [...messages, newMessage]);

      try {
        const response = await axios.post("http://localhost:3000/chat", {
          message: input,
        });
        const resultData = JSON.parse(response.data.message);

        if (resultData && resultData.result) {
          const data = resultData.result.map((item) => ({
            id: item.id,
            assemblyCode: item["assembly code"],
            machineCode: item["machine code"],
            explanation:
              item.error && Object.keys(item.error).length
                ? null
                : item.explanation,
            error: Object.keys(item.error).length === 0 ? null : item.error,
            type: "response",
            isError: Object.keys(item.error).length !== 0,
          }));
          setMessages((messages) => [...messages, ...data]);
        } else {
          const errorMessage = {
            id: Date.now(),
            text: "Unexpected response structure",
            sender: "bot",
            type: "error",
          };
          setMessages((messages) => [...messages, errorMessage]);
        }

        setInput("");
      } catch (error) {
        const errorMessage = {
          id: Date.now(),
          text: "Failed to get response",
          sender: "bot",
          type: "error",
        };
        setMessages((messages) => [...messages, errorMessage]);
      }
    }
  };

  // Function to handle input change
  const handleChange = (event) => {
    setInput(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="chat-container">
      <div className="messages-container" style={{ paddingBottom: "60px" }}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message ${message.sender} ${message.type} ${
              message.isError ? "error-response" : ""
            }`}
          >
            {message.type === "input" ? (
              <p>{message.text}</p>
            ) : (
              <>
                <p>
                  <strong>Assembly:</strong> {message.assemblyCode}
                </p>
                <p>
                  <strong>Machine Code:</strong> {message.machineCode}
                </p>
                {message.explanation && (
                  <p>
                    <strong>Explanation:</strong> {message.explanation}
                  </p>
                )}
                {message.error && (
                  <p>
                    <strong>Error:</strong> {JSON.stringify(message.error)}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="Type assembly code here..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
    </div>
  );
}

export default Chat;
