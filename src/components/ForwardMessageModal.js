import {Button, Form, ListGroup, Modal} from 'react-bootstrap';
import React from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';

class ForwardMessageModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chatRooms: []
        }
    }

    componentDidMount() {
        axios.get("http://localhost:5274/ChatRoom/GetChatRooms")
            .then((result) => {
                const chatRooms = result.data.filter(chatRoom => chatRoom.id !== this.props.currentChatRoomId);
                this.setState({chatRooms: chatRooms})
            })
            .catch((error) => {
                console.log(error)
                toast.error("Có lỗi đã xảy ra");
            })
    }

    render() {
        return <Modal show={this.props.show} onHide={this.props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Chuyển tiếp tin nhắn đến</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <Form.Control value={this.state.groupName} onChange={e => this.setState({groupName: e.target.value})} placeholder="Nhập tên nhóm"/>
                </div>
                <hr/>
                <ListGroup>
                    {this.state.chatRooms.map(chatRoom =>
                        <ListGroup.Item
                            action key={chatRoom.id}
                            onClick={() => this.props.forwardMessage(chatRoom.id)}
                        >
                            {chatRoom.name}
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.props.handleClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    }
}

export default ForwardMessageModal;
