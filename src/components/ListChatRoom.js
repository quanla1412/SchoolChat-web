import {toast} from 'react-toastify';
import React, {Fragment} from 'react';

const ChatRoomItem = ({chatRoom, joinChatRoom, chatRoomSelectedId}) => {
    const user = chatRoom.users[0];

    const sentDate = chatRoom.newestMessage ? new Date(chatRoom.newestMessage.sentDate)
        .toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        .toLowerCase()
        .replace(' ','') : '';

    return <div className={'chat-item' + (chatRoomSelectedId == chatRoom.id? ' selected' : '')} onClick={() => joinChatRoom(chatRoom.id)}>
        <div className="avatar offline"><img src="/assets/img/img7.jpg" alt=""/></div>
        <div className="chat-item-body">
            <div className="d-flex align-items-center mb-1"><h6 className="mb-0">{user.userName}</h6>
                <small className="ms-auto">{sentDate}</small>
            </div>
            <span>{chatRoom.newestMessage?.text}</span>
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