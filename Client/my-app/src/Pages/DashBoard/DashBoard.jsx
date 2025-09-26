import React from 'react'
import Sidebar from '../../components/Sidebar'
import Header from '../../components/Header'
import Content from '../../components/Content'
import './DashBoard.css'; // Assuming you have a CSS file for styling
function DashBoard() {
  return (
   <div className="app-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Header */}
        <Header />

        {/* Content */}
        <Content />
      </div>
    </div>
  )
}

export default DashBoard