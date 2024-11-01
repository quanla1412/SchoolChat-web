import {useState} from 'react';
import {Button, Form, InputGroup} from 'react-bootstrap';

const SendMessageForm = ({ sendMessage }) => {
    const [msg, setMessage] = useState('');

    return <Form onSubmit={e => {
        e.preventDefault();
        sendMessage(msg);
        setMessage('');
    }}>
        <InputGroup className="mb-3">
            <InputGroup.Text>Chat</InputGroup.Text>
            <Form.Control onChange={e => setMessage(e.target.value)} value={msg} placeholder="Type message"/>
            <Button variant="primary" type="submit" disabled={!msg}>Send</Button>
        </InputGroup>
    </Form>

    // return <div className="chat-body-footer">
    //     <nav className="nav nav-icon">
    //         <a href="" className="nav-link"><i className="ri-add-line"></i></a>
    //         <a href="" className="nav-link"><i className="ri-image-line"></i></a>
    //         <a href="" className="nav-link"><i className="ri-gift-line"></i></a>
    //         <a href="" className="nav-link"><i className="ri-emotion-happy-line"></i></a>
    //     </nav>
    //     <div className="msg-box">
    //         <input id="msgInput" type="text" className="form-control" placeholder="Write your message..."/>
    //         <a id="msgSend" href="" className="msg-send"><i className="ri-send-plane-2-line"></i></a>
    //     </div>
    //     <nav className="nav nav-icon">
    //         <a href="" className="nav-link"><i className="ri-thumb-up-line"></i></a>
    //     </nav>
    // </div>
}

export default SendMessageForm;