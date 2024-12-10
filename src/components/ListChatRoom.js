import React, {Fragment} from 'react';
import MessageType from '../common/MessageType';

const ChatRoomItem = ({chatRoom, joinChatRoom, chatRoomSelectedId, currentUserId, isOnline}) => {
    const chatRoomName = chatRoom.name ? chatRoom.name : chatRoom.users.map(user => user.userName).join(", ");

    const sentDate = chatRoom.newestMessage ? new Date(chatRoom.newestMessage.sentDate)
        .toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        .toLowerCase()
        .replace(' ','') : '';

    let isUnread = true;
    if(chatRoom.newestMessage != null && chatRoom.newestMessage?.readStatuses != null)
        for(const readStatus of chatRoom.newestMessage.readStatuses) {
            if(readStatus.userId === currentUserId)
                isUnread = false;
        }

    return <div className={'chat-item' + (chatRoomSelectedId === chatRoom.id? ' selected' : '') + (isUnread ? ' unread' : '')} onClick={() => joinChatRoom(chatRoom.id)}>
        <div className={"avatar " + (isOnline ? "online" : "offline")}>
            <img src={!!chatRoom.avatar ? "http://localhost:5274/images/" + chatRoom.avatar : (chatRoom.isSingle ? "/assets/img/default-avatar.jpg" : "/assets/img/group-avatar-icon.jpg")} alt="Chatroom avatar"/>
        </div>
        <div className="chat-item-body">
            <div className="d-flex align-items-center mb-1">
                <h6 className="mb-0" style={{width: '100%', textOverflow: 'ellipsis', overflow: 'hidden', textWrap: 'nowrap'}}>{chatRoomName}</h6>
                <small className="ms-auto">{sentDate}</small>
            </div>
            <span>{chatRoom.newestMessage?.type === MessageType.IMAGE ? "Hình ảnh" : (chatRoom.newestMessage?.type === MessageType.FILE ? "Tệp tin" : chatRoom.newestMessage?.text)}</span>
        </div>
    </div>
}

class ListChatRoom extends React.Component {
    constructor(props) {
        super(props);

        this.joinChatRoom = props.joinChatRoom;

        this.isOnlineRoom = (chatRoom) => {
            const chatRoomUserIds = chatRoom.users.map(user => user.id);
            return chatRoomUserIds.some(userId => this.props.onlineUserIds.includes(userId));
        }
    }

    render() {
        return <Fragment>
            {this.props.chatRooms.map(chatRoom =>
                <ChatRoomItem key={chatRoom.Id}
                              chatRoom={chatRoom}
                              joinChatRoom={this.joinChatRoom}
                              chatRoomSelectedId={this.props.chatRoomSelectedId}
                              currentUserId={this.props.currentUserId}
                              isOnline={this.isOnlineRoom(chatRoom)}
                />)}
        </Fragment>
    }
}

export default ListChatRoom;