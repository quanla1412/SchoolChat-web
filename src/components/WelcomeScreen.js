import {Button, Form} from 'react-bootstrap';
import React from 'react';
import {toast} from 'react-toastify';
import axios from 'axios';

class WelcomeScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="chat-body">
            <div className="chat-body-content d-flex flex-column justify-content-center align-items-center">
                <h2 className="error-title">Chào mừng trở lại</h2>
                <p className="error-text">Chọn 1 phòng chat để bắt đầu nhắn tin.</p>
            </div>
        </div>
    }
}

export default WelcomeScreen;