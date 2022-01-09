import React, { useEffect } from 'react';
import CustomerContainer from './example/customer/container';
import './App.css';

function App() {
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
    })
      .then((res) => {
        return res.json();
      })
      .then((r) => console.log('posts', r));
  }, []);
  return <CustomerContainer />;
}

export default App;
