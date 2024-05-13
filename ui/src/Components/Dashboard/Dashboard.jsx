import React from "react";
import Chat from "../Chat/Chat";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="chat-container">
        <Chat />
      </div>
    </div>
  );
};

export default Dashboard;
