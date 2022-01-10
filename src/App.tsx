import React, { useEffect } from 'react';
import CustomerContainer from './example/customer/container';
import PostsService from './example/services/posts.service'

import './App.css';

function App() {
  useEffect(() => {
    PostsService.setPosts()
    console.log('posts', PostsService.getPosts())
  }, []);
  return <CustomerContainer />;
}

export default App;
