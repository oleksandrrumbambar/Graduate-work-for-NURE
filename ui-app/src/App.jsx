import logo from './logo.svg';
import './App.css';
import Home from './store/home/home.page'
import AppRouter from './app-router.component'
import Header from './component/header/header';
import Footer from './component/footer/footer';

function App() {
  return (
    <div className="App">
      <Header />
      <AppRouter />
      <Footer />
    </div>
  );
}

export default App;
