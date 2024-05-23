import React from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap'; // Импортируем компонент Button из react-bootstrap
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'; // Подключаем функцию connect для работы с Redux store
import customImage from '../images/user.png';

class NavigationBar extends React.Component {
    render() {
        const { someDataFromStore } = this.props; // Пример получения данных из Redux store через props
        return (
            <Navbar bg="light" expand="lg">
                <Navbar.Brand><FontAwesomeIcon icon={faHome} />{' '}My RPO</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Link to="/home" className="btn btn-outline-primary">Home</Link>
                        <p>{someDataFromStore}</p> {/* Пример использования данных из Redux store */}
                    </Nav>
                    <Nav>
                        {/* Добавляем кнопку "Вход в систему" */}
                        <Link to="/login"><img src={customImage} alt="Login" style={{ width: '40px', height: '40px', cursor: 'pointer' }} /></Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        someDataFromStore: state.user.userName
    };
};

export default connect(mapStateToProps)(NavigationBar);
