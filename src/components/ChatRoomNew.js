import MessageContainerNew from './MessageContainerNew';
import SendMessageFormNew from './SendMessageFormNew';
import PinnedMessageContainer from './PinnedMessageContainer';
import React from 'react';

class ChatRoomNew extends React.Component {
    constructor(props) {
        super(props);

        this.getChatRoomName = () => {
            if(!this.props.chatRoom.id)
                return null;

            if(this.props.chatRoom.name != null)
                return this.props.chatRoom.name;

            const otherUsers = this.props.chatRoom.users.filter(user => user.id !== this.props.currentUserId)
            return otherUsers.map(user => user.name).join(', ');
        }
    }

    render() {
        return <div className="chat-body">
            <div className="chat-body-header">
                <div className="chat-item">
                    <div className="avatar online"><img src="../assets/img/img14.jpg" alt=""/></div>
                    <div className="chat-item-body">
                        <h6 className="mb-1">{this.getChatRoomName()}</h6>
                        <span>Active now</span>
                    </div>
                </div>
                <nav className="nav nav-icon ms-auto">
                    <a href="" className="nav-link" data-bs-toggle="tooltip" title="Invite People"><i
                        className="ri-user-add-line"></i></a>
                    <a href="" className="nav-link" data-bs-toggle="tooltip" title="Member List"><i
                        className="ri-group-line"></i></a>
                    <a href="" className="nav-link" data-bs-toggle="tooltip" title="Call"><i
                        className="ri-phone-line"></i></a>
                    <a href="" className="nav-link" data-bs-toggle="tooltip" title="Video Call"><i
                        className="ri-vidicon-line"></i></a>
                    <a href="" className="nav-link" data-bs-toggle="tooltip" title="More Info"><i
                        className="ri-information-line"></i></a>
                    <a href="" id="closeMsg" className="nav-link d-md-none"><i className="ri-close-fill"></i></a>
                </nav>
            </div>

            {!!this.props.chatRoom.pinnedMessage ? <PinnedMessageContainer message={this.props.chatRoom.pinnedMessage} /> : null }
            <MessageContainerNew
                currentUserId={this.props.currentUserId}
                messages={this.props.messages}
                newestReadMessageId={this.props.newestReadMessageId}
                connection = {this.props.connection}
                showPinnedMessage = {!!this.props.chatRoom.pinnedMessage}
                currentChatRoomId={this.props.chatRoom.id}
            />
            <SendMessageFormNew
                sendMessage={this.props.sendMessage}
                currentUserId={this.props.currentUserId}
                currentChatRoomId = {this.props.chatRoom.id}
            />
        </div>
    }

}


export default ChatRoomNew;