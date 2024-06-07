import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './store/home/home.page'
import AppRouter from './app-router.component'
import Header from './component/header/header';
import Footer from './component/footer/footer';
import { AuthProvider } from './user/authorisation/auth.context';

function App() {

  return (
    <div className="App">
      <AuthProvider>
        <Header/>
        <AppRouter />
        <Footer />
      </AuthProvider>
    </div>
  );
}

export default App;
