import React from "react";
import "./Content.css"; // Add this line to import your CSS

const Content = () => {
  return (
    <main className="content-main">
      {/* Main Content Area (Currently Blank) */}
      <div className="content-box">
        {/* Placeholder for dynamic content */}
        <h1 className="content-title">Welcome to the Dashboard</h1>
        <p className="content-text">
          This is where your dynamic content will go.
        </p>
      </div>
    </main>
  );
};

export default Content;
