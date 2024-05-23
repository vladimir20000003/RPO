import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function WelcomePage() {
  const params = useParams(); // Получаем все параметры маршрута
  const username = params.username; // Извлекаем username из параметров маршрута
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.post(
          'http://127.0.0.1:5000/users',
          { username: username },
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    }

    fetchUser();
  }, [username]);

  return (
    <div>
      {user ? (
        <div>
          <h1>Welcome, {user.username}!</h1>
          <p>Email: {user.email}</p>
          {/* Отобразите другую информацию о пользователе, если это необходимо */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default WelcomePage;
