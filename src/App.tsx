import React, { useEffect } from 'react';
import CustomerContainer from './example/customer/container';
import PostsService from './example/services/posts.service'

import './App.css';
import CustomerService from './example/services/customer.service';
import { clearCachesForEvent } from './core/cache.service';

function App() {
  useEffect(() => {
    PostsService.setPosts()
    CustomerService.fetchCustomer().subscribe(val => console.log('1', val))
    clearCachesForEvent('update')
    CustomerService.fetchCustomer().subscribe((val) => console.log('2', val))
    CustomerService.fetchCustomer().subscribe(val => console.log('3', val))
  }, []);
  return <CustomerContainer />;
}

export default App;
