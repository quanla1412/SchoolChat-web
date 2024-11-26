import MessageContainerNew from './MessageContainerNew';
import SendMessageFormNew from './SendMessageFormNew';
import PinnedMessageContainer from './PinnedMessageContainer';
import React from 'react';
import axios from 'axios';
import chatRoom from './ChatRoom';

class ChatRoomNew extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="chat-body">
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
            />
            <SendMessageFormNew sendMessage={this.props.sendMessage} currentUserId={this.props.currentUserId}/>
        </div>
    }

}


export default ChatRoomNew;