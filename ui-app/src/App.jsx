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
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />
                <main style={{ flex: 1 }}>
                    <AppRouter />
                </main>
                <Footer />
            </div>
      </AuthProvider>
    </div>
  );
}

export default App;
