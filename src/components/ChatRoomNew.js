import MessageContainerNew from './MessageContainerNew';
import SendMessageFormNew from './SendMessageFormNew';
import PinnedMessageContainer from './PinnedMessageContainer';
import React from 'react';
import AddNewUserToChatModal from './AddNewUserToChatModal';
import axios from 'axios';
import {toast} from 'react-toastify';

class ChatRoomNew extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isShowAddNewUserToChatModal: false,
            userNotInRoomList: []
        }

        this.getChatRoomName = () => {
            if(!this.props.chatRoom.id)
                return null;

            if(this.props.chatRoom.name != null)
                return this.props.chatRoom.name;

            const otherUsers = this.props.chatRoom.users.filter(user => user.id !== this.props.currentUserId)
            return otherUsers.map(user => user.name).join(', ');
        }

        this.isOnlineRoom = () => {
            if(!this.props.chatRoom.id)
                return false;
            let chatRoomUserIds = this.props.chatRoom.users.map(user => user.id);
            chatRoomUserIds = chatRoomUserIds.filter(id => id !== this.props.currentUserId);
            return chatRoomUserIds.some(userId => this.props.onlineUserIds.includes(userId));
        }

        this.showAddNewUserToChatModal = (searchString) => {
            let url = 'http://localhost:5274/User/GetUsers?exceptChatRoomId=' + this.props.chatRoom.id;
            if(!!searchString)
                url += ('&searchString=' + searchString)
            // Fetch users
            axios.get(url)
                .then(result => {
                    this.setState({
                        userNotInRoomList: result.data,
                        showAddNewUserToChatModal: true
                    })
                })
                .catch(ex => {
                    toast.error("Lấy dữ liệu thất bại!");
                    console.log(ex);
                });
        }

        this.addUserToChatRoom = (userIds) => {
            axios.post('http://localhost:5274/ChatRoom/AddUserToChatRoom', {
                chatRoomId: this.props.chatRoom.id,
                userIds
            }).then(result => {
                const users = result.data;
                this.props.updateUsersInChatRoom(users);
            }).catch(ex => {
               toast.error("Thêm thành viên vào nhóm thất bại");
               console.log(ex);
            });
        };
    }

    render() {
        return <div className="chat-body" style={{marginRight: this.props.isShowInformationSideboard ? 300: 0}}>
            <div className="chat-body-header">
                <div className="chat-item">
                    <div className={"avatar " + (this.isOnlineRoom() ? "online" : "offline")}>
                        <img src={!!this.props.chatRoom.avatar ? "http://localhost:5274/images/" + this.props.chatRoom.avatar : (this.props.chatRoom.isSingle ? "/assets/img/default-avatar.jpg" : "/assets/img/group-avatar-icon.jpg")} alt="Group avatar"/>
                    </div>
                    <div className="chat-item-body">
                        <h6 className="mb-1">{this.getChatRoomName()}</h6>
                        <span>{this.isOnlineRoom() ? "Đang hoạt động" : "Offline"}</span>
                    </div>
                </div>
                <nav className="nav nav-icon ms-auto">
                    {
                        !this.props.chatRoom.isSingle ?
                            <span role="button" className="nav-link" data-bs-toggle="tooltip" title="Invite People"
                                  onClick={() => this.showAddNewUserToChatModal(null)}>
                        <i className="ri-user-add-line"></i>
                    </span> : null
                    }
                    <span role="button" className="nav-link" data-bs-toggle="tooltip" title="More Info"
                          onClick={this.props.showInformationSideboard}><i
                        className="ri-information-line"></i></span>
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
                currentChatRoom = {this.props.chatRoom}
            />
            <AddNewUserToChatModal
                show={this.state.showAddNewUserToChatModal}
                handleClose={() => this.setState({showAddNewUserToChatModal: false})}
                users={this.state.userNotInRoomList}
                handleSearch={this.showAddNewUserToChatModal}
                addUserToChatRoom={this.addUserToChatRoom}
            />
        </div>
    }

}


export default ChatRoomNew;