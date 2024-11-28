import React, {useState} from 'react';
import {Button, Dropdown, Form, ListGroup, Modal} from 'react-bootstrap';
import axios from 'axios';
import {toast} from 'react-toastify';

const UnsentConfirmModal = ({show, handleClose, unsentMessage, deleteMessage}) => {
    const [isUnsentMode, setIsUnsentMode] = useState(true);

    return <Modal show={show}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
    >
        <Modal.Header closeButton>
            <Modal.Title className="ms-auto" id="contained-modal-title-vcenter">Bạn muốn thu hồi tin nhắn này ở phía ai?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div key={`default-radio`} className="mb-3">
                <Form.Check
                    type="radio"
                    id={`default-radio`}
                    label={`Thu hồi với mọi người`}
                    className="fw-bold fs-5"
                    defaultChecked={true}
                    name="radUnsentMode"
                    onClick={() => setIsUnsentMode(true)}
                />
                <p style={{marginLeft: 24}}>Tin nhắn này sẽ bị thu hồi với mọi người trong đoạn chat. Những người khác
                    có thể đã xem hoặc chuyển tiếp tin nhắn đó. Tin nhắn đã thu hồi vẫn có thể bị báo cáo.</p>
                <Form.Check
                    type="radio"
                    id={`default-radio`}
                    label={`Thu hồi với bạn`}
                    className="fw-bold fs-5"
                    name="radUnsentMode"
                    onClick={() => setIsUnsentMode(false)}
                />
                <p style={{marginLeft: 24}}>Tin nhắn này sẽ bị gỡ khỏi thiết bị của bạn, nhưng vẫn hiển thị với các thành viên khác trong đoạn chat.</p>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Đóng
            </Button>
            <Button variant="primary" onClick={() => {
                if(isUnsentMode)
                    unsentMessage()
                else
                    deleteMessage()
            }}>
                Gỡ
            </Button>
        </Modal.Footer>
    </Modal>
}

const MessageItem = ({currentUserId, message, isReadMessage, connection}) => {
    const [showUnsentConfirmModal, setShowUnsentConfirmModal] = useState(false);

    const isMyMessage = currentUserId === message.fromUserId;

    const sentDate = new Date(message.sentDate)
        .toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        .toLowerCase()
        .replace(' ','');

    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            className="nav-link"
        >
            <i className="ri-more-fill"></i>
        </a>
    ));

    const pinOrUnpinMessage = async () => {
        // axios.get(
        //     'http://localhost:5274/Message/Pin?messageId=' + message.id, {
        //         headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}
        //     }
        // ).then(r => console.log(r));

        try {
            if (message.isPinned) {
                await connection.invoke("UnpinMessage", message.id);
            } else {
                await connection.invoke("PinMessage", message.id);
            }
        } catch (e) {
            toast.error((message.isPinned ? "Gỡ ghim" : "Ghim") + " tin nhắn thất bại");
        }
    }

    const unsentMessage = async () => {
        try {
            await connection.invoke("UnsentMessage", message.id);
            setShowUnsentConfirmModal(false);
        } catch (e) {
            toast.error("Thu hồi tin nhắn thất bại");
        }
    }

    const deleteMessage = async () => {
        try {
            await connection.invoke("DeleteMessage", message.id);
            setShowUnsentConfirmModal(false);
        } catch (e) {
            toast.error("Xóa tin nhắn thất bại");
        }
    }

    return <div
        className={'msg-item' + (isMyMessage ? ' reverse' : '')}
        onMouseOver={() => document.getElementById('msg-container-item-' + message.id).classList.add('nav-show')}
        onMouseLeave={() => document.getElementById('msg-container-item-' + message.id).classList.remove('nav-show')}
    >
        <UnsentConfirmModal
            show={showUnsentConfirmModal}
            handleClose={() => setShowUnsentConfirmModal(false)}
            unsentMessage={unsentMessage}
            deleteMessage={deleteMessage}
        />
        {!isMyMessage ? <div className="avatar online"><img src="/assets/img/img7.jpg" alt=""/></div> : null}
        <div className="msg-body">
            <div id={'msg-container-item-' + message.id} className="row gx-3 row-cols-auto">
                <div className="col">
                    <div className={"msg-bubble" + (message.isUnsent ? " msg-unsent" : "")}>
                        {message.text}
                        <span>{sentDate}</span>
                    </div>
                </div>
                {
                    !message.isUnsent ?  <div className="col">
                        <nav className="nav nav-icon">
                            <a href="" className="nav-link"><i className="ri-reply-line"></i></a>
                            <Dropdown>
                                <Dropdown.Toggle as={CustomToggle} id="dropdown-basic"/>

                                <Dropdown.Menu>
                                    <Dropdown.Item
                                        onClick={() => pinOrUnpinMessage()}>{message.isPinned ? 'Gỡ ghim' : 'Ghim'}</Dropdown.Item>
                                    {message.fromUserId === currentUserId ?
                                        <Dropdown.Item onClick={() => setShowUnsentConfirmModal(true)}>Thu
                                            hồi</Dropdown.Item> :
                                        <Dropdown.Item onClick={deleteMessage}>Xóa</Dropdown.Item>
                                    }
                                    <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </nav>
                    </div> : null
                }
            </div>
            {isReadMessage ? <div className="mini-avatar"><img src="/assets/img/img7.jpg" alt=""/></div> : null}
        </div>
    </div>
}

class MessageContainerNew extends React.Component {
    constructor(props) {
        super(props);

        console.log(this.props.messages)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        var chatBodyContent = document.getElementById('chatBodyContent');
        chatBodyContent.scrollTop = chatBodyContent.scrollHeight;

        if (this.props.showPinnedMessage) {
            chatBodyContent.classList.add('show-pinned-message');
        } else {
            chatBodyContent.classList.remove('show-pinned-message');
        }
    }

    render() {
        return <div id="chatBodyContent" className="chat-body-content">
            {this.props.messages.map(message => <MessageItem
                currentUserId={this.props.currentUserId}
                message={message}
                isReadMessage={this.props.newestReadMessageId === message.id}
                connection = {this.props.connection}
            />)}
        </div>
    }


}

export default MessageContainerNew;