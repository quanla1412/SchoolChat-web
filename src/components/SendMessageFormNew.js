import {useState} from 'react';
import {Button, Form, InputGroup} from 'react-bootstrap';

const SendMessageFormNew = ({ sendMessage }) => {
    const [msg, setMessage] = useState('');

    return <div className="chat-body-footer">
        <nav className="nav nav-icon">
            <a href="" className="nav-link"><i className="ri-add-line"></i></a>
            <a href="" className="nav-link"><i className="ri-image-line"></i></a>
            <a href="" className="nav-link"><i className="ri-gift-line"></i></a>
            <a href="" className="nav-link"><i className="ri-emotion-happy-line"></i></a>
        </nav>
        <div className="msg-box">
            <Form.Control onChange={e => setMessage(e.target.value)} value={msg} placeholder="Write your message..."/>
            <span role="button" className="msg-send" onClick={() => {
                sendMessage(msg);
                setMessage('');
            }}><i className="ri-send-plane-2-line"></i></span>
        </div>
        <nav className="nav nav-icon">
            <a href="" className="nav-link"><i className="ri-thumb-up-line"></i></a>
        </nav>
    </div>
}

export default SendMessageFormNew;