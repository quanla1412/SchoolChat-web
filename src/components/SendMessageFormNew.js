import {Fragment, useState} from 'react';
import {Button, Form, InputGroup} from 'react-bootstrap';

const SendMessageFormNew = ({ sendMessage }) => {
    const [msg, setMessage] = useState('');

    const sendMessageClick = () => {
        if(!!msg) {
            sendMessage(msg);
            setMessage('');
        }
    }

    const onKeyUpEvent = (e) => {
        console.log(e)
        if (e.key === 'Enter') {
            sendMessageClick();
        }
    }

    return <div className="chat-body-footer">
        <nav className="nav nav-icon">
            <a href="" className="nav-link"><i className="ri-add-line"></i></a>
            <a href="" className="nav-link"><i className="ri-image-line"></i></a>
            <a href="" className="nav-link"><i className="ri-gift-line"></i></a>
            <a href="" className="nav-link"><i className="ri-emotion-happy-line"></i></a>
        </nav>
        <div className="msg-box">
            <Form.Control onChange={e => setMessage(e.target.value)} value={msg} placeholder="Write your message..." onKeyUp={onKeyUpEvent}/>
            {
                !!msg ?
                    <span id="sendMessageButton" role="button" className="msg-send" onClick={sendMessageClick}><i className="ri-send-plane-2-line"></i></span> : null
            }
        </div>
        <nav className="nav nav-icon">
            <a href="" className="nav-link"><i className="ri-thumb-up-line"></i></a>
        </nav>
    </div>
}

export default SendMessageFormNew;