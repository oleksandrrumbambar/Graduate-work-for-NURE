import React, { useState } from 'react';
import './registration.page.css';
import axios from 'axios';

function Registration() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    country: '',
    password: '',
    full_name: '',
    postcode: '',
    game_name: '',
  });
  const [step, setStep] = useState(1); // Починаємо з першого кроку

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (step < 3) {
      setStep(step + 1); // Перехід до наступного кроку
    } else {
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
        const response = await axios.post('http://localhost:8000/register', user);
        console.log('Відповідь від сервера:', response.data);
        setStep(1); // Після успішної реєстрації повертаємось до першого кроку
        setFormData({
          username: '',
          email: '',
          country: '',
          password: '',
          fullName: '',
          postalCode: '',
          gameUsername: '',
        });
      } catch (error) {
        console.error('Помилка при відправленні запиту:', error);
      }
    }
  };

  return (
    <div className="registration-container">
      <form className="registration-form" onSubmit={handleSubmit}>
        <h2>Реєстрація</h2>
        {step === 1 && (
          <div>
            <div className="form-group">
              <label htmlFor="username">Логін користувача</label>
              <input type="text" id="username" name="username" value={formData.username} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Електронна пошта</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="password">Пароль</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleInputChange} />
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <div className="form-group">
              <label htmlFor="country">Країна проживання</label>
              <input type="text" id="country" name="country" value={formData.country} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="fullName">Ім'я та прізвище</label>
              <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} />
            </div>
            <div className="form-group">
              <label htmlFor="postalCode">Поштовий індекс</label>
              <input type="text" id="postalCode" name="postalCode" value={formData.postalCode} onChange={handleInputChange} />
            </div>
          </div>
        )}
        {step === 3 && (
          <div>
            <div className="form-group">
              <label htmlFor="gameUsername">Ігрове ім'я</label>
              <input type="text" id="gameUsername" name="gameUsername" value={formData.gameUsername} onChange={handleInputChange} />
            </div>
          </div>
        )}
        <button type="submit">{step < 3 ? 'Далі' : 'Зареєструватися'}</button>
        <hr></hr>
        <button type="submit">Вернутися до входу</button>
      </form>
    </div>
  );
}

export default Registration;
