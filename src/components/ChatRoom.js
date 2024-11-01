import {Col, Row} from 'react-bootstrap';
import MessageContainer from "./MessageContainer";
import SendMessageForm from './SendMessageForm';

const ChatBodyHeader = () =>
    <div className="chat-body-header">
        <div className="chat-item">
            <div className="avatar online"><img src="../assets/img/img14.jpg" alt=""/></div>
            <div className="chat-item-body">
                <h6 className="mb-1">Leo Mendez</h6>
                <span>Active now</span>
            </div>
        </div>
        <nav className="nav nav-icon ms-auto">
            <a href="" className="nav-link" data-bs-toggle="tooltip" title="Invite People"><i
                className="ri-user-add-line"></i></a>
            <a href="" className="nav-link" data-bs-toggle="tooltip" title="Member List"><i
                className="ri-group-line"></i></a>
            <a href="" className="nav-link" data-bs-toggle="tooltip" title="Call"><i className="ri-phone-line"></i></a>
            <a href="" className="nav-link" data-bs-toggle="tooltip" title="Video Call"><i
                className="ri-vidicon-line"></i></a>
            <a href="" className="nav-link" data-bs-toggle="tooltip" title="More Info"><i
                className="ri-information-line"></i></a>
            <a href="" id="closeMsg" className="nav-link d-md-none"><i className="ri-close-fill"></i></a>
        </nav>
    </div>

const ChatRoom = ({messages, sendMessage}) => <div>
    <ChatBodyHeader />
    <Row className='px-5 py-5'>
        <Col sm={12}>
            <MessageContainer messages={messages}/>
        </Col>
        <Col sm={12}>
            <SendMessageForm sendMessage={sendMessage}/>
        </Col>
    </Row>
</div>

export default ChatRoom;