import logo from './logo.svg';
import './App.css';
import Home from './store/home/home.page'
import Header from './component/header/header';
import Footer from './component/footer/footer';

function App() {
  return (
    <div className="App">
      <Header />
      <Home />
      <Footer />
    </div>
  );
}

export default App;
