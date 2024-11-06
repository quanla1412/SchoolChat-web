import {Col, Row} from 'react-bootstrap';
import MessageContainer from "./MessageContainer";
import SendMessageForm from './SendMessageForm';
import {toast} from 'react-toastify';
import React, {Fragment, useState} from 'react';

const ChatRoomItem = ({chatRoom, joinChatRoom, chatRoomSelectedId}) => {
    const user = chatRoom.users[0];

    return <div className={'chat-item' + (chatRoomSelectedId ? ' selected' : '')} onClick={() => joinChatRoom(chatRoom.id)}>
        <div className="avatar offline"><img src="/assets/img/img7.jpg" alt=""/></div>
        <div className="chat-item-body">
            <div className="d-flex align-items-center mb-1"><h6 className="mb-0">{user.userName}</h6>
                <small className="ms-auto">1w</small>
            </div>
            <span>It is a long established fact that aquis autem vel eum iure reprehenderit qui in ea voluptate velit esse</span>
        </div>
    </div>
}

class ListChatRoom extends React.Component {
    constructor(props) {
        super(props);

        // Initializing the state
        this.state = { chatRooms: [] };

        this.joinChatRoom = props.joinChatRoom;
    }

    componentDidMount() {
        fetch('http://localhost:5274/ChatRoom/GetChatRooms', {
            headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}
        }).then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error("Lấy dữ liệu thất bại!");
        }).then(result => {
            this.setState({ chatRooms: result });
        })
        .catch(exception => toast(exception));
    }

    render() {
        return <Fragment>
            {this.state.chatRooms.map(chatRoom => <ChatRoomItem key={chatRoom.Id} chatRoom={chatRoom} joinChatRoom={this.joinChatRoom} chatRoomSelectedId={this.props.chatRoomSelectedId}/>)}
        </Fragment>
    }
}

export default ListChatRoom;