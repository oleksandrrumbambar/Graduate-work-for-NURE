import React, {useState} from 'react';
import './authorisation.page.css';
import axios from 'axios';
import { Link, useNavigate  } from "react-router-dom";
import { jwtDecode }  from 'jwt-decode';

function Authorisation() {
    const [formData, setFormData] = useState({
        Email: '',
        Password: ''
    });
    const navigate = useNavigate();
  
    const handleInputChange = (event) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (event) => {
    //debugger
      event.preventDefault();
      try {
        const response = await axios.post('http://localhost:8080/login', formData);
        console.log('Відповідь від сервера:', response.data);
        
        // Розшифрування токену
        const decodedToken = jwtDecode (response.data.token);
        console.log('Розшифровані дані з токену:', decodedToken);
        // Перенаправлення на сторінку профілю користувача
        navigate(`/profile/${decodedToken.user_id}`);

        // Тут буде код з отриманою відповіддю, наприклад, перенаправити користувача на іншу сторінку
      } catch (error) {
        console.error('Помилка при відправленні запиту:', error);
      }
    };
  
    return (
      <div className="login-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Увійти</h2>
          <div className="form-group">
            <label htmlFor="username">Логін користувача</label>
            <input type="text" id="username" name="Email" value={formData.username} onChange={handleInputChange} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input type="password" id="password" name="Password" value={formData.password} onChange={handleInputChange} />
          </div>
          <button type="submit">Увійти</button>
          <hr></hr>
          <button type="submit">Створити акаунт</button>
          <hr></hr>
          <p style={{color: 'white'}}>Забули пароль?</p>
        </form>
      </div>
    );
}

export default Authorisation;