import React, { useState } from 'react';
import './registration.page.css';
import axios from 'axios';

function Registration() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    country: '',
    password: '',
    fullName: '',
    postalCode: '',
    gameUsername: '',
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    debugger
    event.preventDefault();

    // Об'єкт користувача для відправки на сервер
    const user = {
      login: formData.username,
      email: formData.email,
      country: formData.country,
      password: formData.password,
      fullName: formData.fullName,
      postalCode: formData.postalCode,
      gameUsername: formData.gameUsername,
    };

    try {
      // POST запит на сервер
      const response = await axios.post('http://localhost:8000/register', user);
      console.log('Відповідь від сервера:', response.data);
      
      // Очищеня форми після успішної реєстрації
      setFormData({
        username: '',
        email: '',
        country: '',
        password: '',
        fullName: '',
        postalCode: '',
        gameUsername: '',
        userID: ''
      });
    } catch (error) {
      console.error('Помилка при відправленні запиту:', error);
    }
  };

  return (
    <div className="registration-container">
      <form className="registration-form" onSubmit={handleSubmit}>
        <h2>Реєстрація</h2>
        <div className="form-group">
          <label htmlFor="username">Логін користувача</label>
          <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Електронна пошта</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="confirmEmail">Підтвердження пошти</label>
          <input type="email" id="confirmEmail" name="confirmEmail" value={formData.confirmEmail} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="country">Країна проживання</label>
          <input type="text" id="country" name="country" value={formData.country} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Підтвердження паролю</label>
          <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="fullName">Ім'я та прізвище</label>
          <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="postalCode">Поштовий індекс</label>
          <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label htmlFor="gameUsername">Ігрове ім'я</label>
          <input type="text" id="gameUsername" name="gameUsername" value={formData.gameUsername} onChange={handleInputChange} />
        </div>
        <button type="submit">Зареєструватися</button>
      </form>
    </div>
  );
}

export default Registration;
