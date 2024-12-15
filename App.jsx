import React, { useState } from 'react';
import axios from 'axios'; // Import axios for API calls
import './App1.css'; 

function SearchPage() {
  const [query, setQuery] = useState(''); // State for the search query
  const [results, setResults] = useState([]); // State to store search results
  const [error, setError] = useState(''); // State to store any error messages
  const [loading, setLoading] = useState(false); // State to manage loading status

  // Handles the search query when the search button is clicked
  const handleSearch = async () => {
    if (query.trim() === '') {
      setError('Please enter a search query.');
      setResults([]); // Clear previous results if input is empty
      return;
    }

    setError(''); // Clear any previous errors
    setLoading(true); // Show the loading message
    setResults([]);  // Clear previous results

    try {
      const response = await axios.post(
        'http://127.0.0.1:5000/get_similar_documents', // Flask backend endpoint
        { query }, // Payload (search query)
        {
          headers: {
            'Content-Type': 'application/json' // Explicitly set the content type as JSON
          }
        }
      );

      // Extract and set results from the API response
      const { original_query, translated_query_chinese, translated_query_english, ranked_documents } = response.data;

      if (ranked_documents.length === 0) {
        setError('No results found.');
      }

      // Prepare the results for display
      const formattedResults = ranked_documents.map(doc => ({
        doc_id: doc.original,  // Using document's original content
        translated_content: doc.translated, // Translated content
        score: doc.similarity_score // Similarity score
      }));

      setResults(formattedResults); // Set the new search results
    } catch (error) {
      setError('Error fetching search results. Please try again later.');
      console.error('Error:', error);
    } finally {
      setLoading(false); // Hide the loading message after the request completes
    }
  };

  // Handle "Enter" key press to trigger the search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="search-page">
      <h1>Cross-Lingual Information Retrieval</h1>
      <p>Search for documents in **Chinese only**</p>

      <div className="search-container">
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          onKeyPress={handleKeyPress} 
          placeholder="Enter your query in English" 
          className="search-input" 
        />
        <button onClick={handleSearch} className="search-button">Search</button>
      </div>

      {loading && <p className="loading-message">Loading...</p>}  

      {error && <p className="error-message">{error}</p>} 

      {results.length > 0 && (
        <div className="results">
          <h2>Search Results</h2>
          <ul>
            {results.map((result, index) => (
              <li key={index} className="result-item">
                <h3>Document {index + 1}</h3>
                <p><strong>Original Content:</strong> {result.doc_id}</p>
                <p><strong>Translated Content:</strong> {result.translated_content}</p>
                <p><strong>Similarity Score:</strong> {result.score}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
