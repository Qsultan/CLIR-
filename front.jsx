import React, { useState } from 'react';
import './App.css';
import SearchPage from './App.jsx'; // Make sure SearchPage is the correct component file

function App() {
  const [isStarted, setIsStarted] = useState(false);  // State to track if user clicked "Get Started"

  const handleGetStarted = () => {
    setIsStarted(true);  // Set state to true when button is clicked
  };

  return (
    <div className="app-container">
      {isStarted ? (
        <NextPage /> 
      ) : (
        <FrontPage onGetStarted={handleGetStarted} />  
      )}
    </div>
  );
}

// FrontPage component
function FrontPage({ onGetStarted }) {
  return (
    <div className="front-page">
      <div className="content">
        <h1>Welcome to Our Website</h1>
        <p>Cross-lingual Information Retrieval (CLIR) refers to the process of retrieving information in one language (the query language) from a collection of documents written in another language (the document language). CLIR aims to overcome language barriers, enabling users to search for information in their native language even if the relevant documents are in a foreign language.</p>
        <h2>For more Information......</h2>
        <button className="get-start-button" onClick={onGetStarted}>Get Started</button>
      </div>
    </div>
  );
}

// NextPage component
function NextPage() {
  return (
    <SearchPage />  
  );
}

export default App;
