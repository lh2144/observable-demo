import React, { useEffect } from 'react';
import './App.css';

function App() {
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
    }).then((res) => {
      return res.json()
    }).then((r) => console.log('posts', r));
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
