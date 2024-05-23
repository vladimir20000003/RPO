// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackendService from './services/BackendService';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/actions'; // Импортируем действие setUser

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [loggingIn, setLoggingIn] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const dispatch = useDispatch(); // Получаем функцию dispatch
    const nav = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoggingIn(true);
        setSubmitted(true);
        setErrorMessage(null);
        const { username, password } = formData;
        BackendService.login(username, password)
            .then(resp => {
                console.log(resp.data);
                dispatch(setUser(username)); // Сохраняем имя пользователя в хранилище
                setLoggingIn(false);
                nav("/welcome"); // Переходим на страницу приветствия
            })
            .catch(err => {
                if (err.response && err.response.status === 401)
                    setErrorMessage("Ошибка авторизации");
                else setErrorMessage(err.message);
                setLoggingIn(false);
            })
    }

    return (
        <div className="col-md-6 me-0">
            {/* Ваш код для формы входа */}
        </div>
    );
};

export default Login;
