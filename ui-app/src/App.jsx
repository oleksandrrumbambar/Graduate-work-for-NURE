import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';
import Home from './store/home/home.page'
import AppRouter from './app-router.component'
import Header from './component/header/header';
import Footer from './component/footer/footer';
import { AuthProvider } from './user/authorisation/auth.context';
import BackgroundVideo from './BackgroundVideo';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <AuthProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1 }}>
              <AppRouter />
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
