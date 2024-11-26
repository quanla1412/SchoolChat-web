import NewChatModal from './components/NewChatModal';
import React from 'react';
import {HubConnectionBuilder, LogLevel} from '@microsoft/signalr';
import ChatRoomNew from './components/ChatRoomNew';
import {toast} from 'react-toastify';
import ListChatRoom from './components/ListChatRoom';
import CreateGroupChatModal from './components/CreateGroupChatModal';
import SidebarFooter from './components/SidebarFooter';
import axios from 'axios';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        // Initializing the state
        this.state = {
            showNewChatModal: false,
            showCreateGroupChatModal: false,
            conn: null,
            messages: [],
            currentUser: '',
            newestReadMessageId: '',
            chatRooms: [],
            showSidebarFooter: false,
            selectedChatRoom: {}
        };

        this.joinChatRoom = async (chatRoomId) => {
            try {
                // Initiate a connection
                const conn = new HubConnectionBuilder()
                    .withUrl("http://localhost:5274/chat", {
                        accessTokenFactory() {
                            return localStorage.getItem('token');
                        }
                    })
                    .configureLogging(LogLevel.Information)
                    .build();
                // Set up handler
                conn.on("CreateNewChat", (userId, msg) => {
                    this.setState({ messages: [...this.state.messages, {userId, msg}] })
                    console.log("msg: ", msg);
                });

                conn.on("JoinSpecificChatRoom", (userId, msg) => {
                    // this.setState({ messages: [...this.state.messages, {userId, msg}] })
                    console.log("msg: ", msg);
                });

                conn.on("ReceiveMessage", (message) => {
                    this.setState({ messages: [...this.state.messages, message] })

                    if(this.state.currentUser.id !== message.fromUserId) {
                        this.markReadMessage(message.id)
                    }

                    this.fetchChatRooms()

                    // const notification = new Notification("SchoolChat", { body: msg.message.message, icon: '/assets/img/img7.png' });
                    console.log("msg: ", message);
                });

                conn.on("NewPinnedMessage", (pinnedMessage) => {
                    this.setState({selectedChatRoom: {...this.state.selectedChatRoom, pinnedMessage }})
                });

                await conn.start();
                await conn.invoke("JoinSpecificChatRoom", {chatRoomId, userId: this.state.currentUser.id});

                this.setState({
                    conn: conn,
                    chatRoomSelectedId: chatRoomId
                })
                this.fetchMessages(chatRoomId);
                this.fetchChatRooms();
                this.fetchDetailChatRoom(chatRoomId);
            } catch (e) {
                console.log(e)
            }
        };

        this.sendMessage = async (message) => {
            try {
                await this.state.conn.invoke("SendMessage", message);
            } catch (e) {
                toast.error("Gửi tin nhắn thất bại");
                console.log(e)
            }
        };

        this.fetchMessages = (chatRoomId) => {
            fetch("http://localhost:5274/Message/GetMessagesByChatRoomId?chatRoomId=" + chatRoomId, {
                headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}
            }).then(response => {
                if(response.ok) {
                    return response.json();
                }
                throw new Error("Lấy dữ liệu thất bại!");
            }).then(result => {
                let resultNewestReadMessageId = '';
                for(let i = result.length - 1; i >= 0; i--) {
                    const message = result[i];
                    message.readStatuses = message.readStatuses.filter(readStatus => readStatus.userId !== this.state.currentUser.id);
                    console.log(message.readStatuses)
                    if(!!message.readStatuses && message.readStatuses.length !== 0) {
                        resultNewestReadMessageId = message.id;
                        break;
                    }
                }

                this.setState({
                    messages: result,
                    newestReadMessageId: resultNewestReadMessageId
                })
                console.log('ok nha', result)
            })
            .catch(exception => {
                toast.error(exception);
            });
        }

        this.markReadMessage = (messageId) => {
            fetch("http://localhost:5274/Message/MarkReadMessage?messageId=" + messageId, {
                headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}
            }).then(response => {
                if(response.ok) {
                    return response.json();
                }
                throw new Error("Đọc tin nhắn thất bại!");
            }).then(result => {
                const readMessage = this.state.messages.find(message => message.id === result.messageId);
                readMessage.readStatuses = result;
                this.setState({messages: [...this.state.messages]});
                console.log(this.state.messages)
            })
            .catch(exception => {
                toast.error(exception);
            });
        }

        this.fetchChatRooms = () => {
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

        this.fetchDetailChatRoom = (chatRoomId) => {
            //Get chatroom detail
            axios.get(
                'http://localhost:5274/ChatRoom/Detail?id=' + chatRoomId, {
                    headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}
                }
            ).then(data => this.setState({selectedChatRoom: data.data}))
                .catch(error => console.log(error));
        }
    }

    componentDidMount() {
        Notification.requestPermission().then((result) => {
            console.log(result);
        });

        fetch("http://localhost:5274/User/GetCurrentUser", {
            headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}
        }).then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error("Xác thực thất bại!");
        }).then(result => {
            this.setState({
                currentUser: result
            })
        })
        .catch(exception => {
            toast.error(exception);
        });

        this.fetchChatRooms();
    }

    render() {
        return (
            <body className="page-app">
            <NewChatModal show={this.state.showNewChatModal} handleClose={() => this.setState({showNewChatModal: false})} joinChatRoom={this.joinChatRoom} />
            <CreateGroupChatModal show={this.state.showCreateGroupChatModal} handleClose={() => this.setState({showCreateGroupChatModal: false})} joinChatRoom={this.joinChatRoom} />
            <div className="main main-app p-3 p-lg-4" style={{width: '100%', height: '100%', margin: 0}}>
                <div className="chat-panel">
                    <div className={"chat-sidebar" + (this.state.showSidebarFooter ? " footer-menu-show" : "")} >
                        <div className="sidebar-header">
                            <h6 className="sidebar-title me-auto">Chat Messages</h6>
                            <div className="dropdown">
                                <a href="" className="header-link" data-bs-toggle="dropdown"><i
                                    className="ri-more-2-fill"></i></a>
                                <div className="dropdown-menu dropdown-menu-end">
                                    <a href="" className="dropdown-item"><i className="ri-user-add-line"></i> Invite
                                        People</a>
                                    <a href="" className="dropdown-item"><i
                                        className="ri-question-answer-line"></i> Create Channel</a>
                                    <a href="" className="dropdown-item"><i className="ri-server-line"></i> Server
                                        Settings</a>
                                    <a href="" className="dropdown-item"><i className="ri-bell-line"></i> Notification
                                        Settings</a>
                                    <a href="" className="dropdown-item"><i className="ri-lock-2-line"></i> Privacy
                                        Settings</a>
                                </div>
                            </div>
                            <span role="button" className="header-link ms-1 pointer-event" data-bs-toggle="tooltip"
                                  title="New message" onClick={() => this.setState({showNewChatModal: true})}><i
                                className="ri-chat-new-line"></i></span>
                            <span role="button" className="header-link ms-1 pointer-event" data-bs-toggle="tooltip"
                                  title="New chat group" onClick={() => this.setState({showCreateGroupChatModal: true})}><i
                                className="ri-group-line"></i></span>
                        </div>
                        <div id="chatSidebarBody" className="sidebar-body">
                            <label className="sidebar-label mb-3">Recently Contacted</label>
                            <div className="chat-contacts mb-4">
                            <div className="row g-2 row-cols-auto">
                                    <div className="col"><a href="#" className="avatar offline"><img src="../assets/img/img10.jpg" alt=""/></a></div>
                                    <div className="col"><a href="#" className="avatar online"><img src="../assets/img/img11.jpg" alt=""/></a></div>
                                    <div className="col"><a href="#" className="avatar online"><img src="../assets/img/img12.jpg" alt=""/></a></div>
                                    <div className="col"><a href="#" className="avatar online"><img src="../assets/img/img14.jpg" alt=""/></a></div>
                                    <div className="col"><a href="#" className="avatar offline"><img src="../assets/img/img15.jpg" alt=""/></a></div>
                                    <div className="col"><a href="#" className="avatar online"><img src="../assets/img/img6.jpg" alt=""/></a></div>
                                </div>
                            </div>

                            <label className="sidebar-label mb-2">Direct Messages</label>

                            <div className="chat-group">
                                <ListChatRoom joinChatRoom={this.joinChatRoom} chatRoomSelectedId={this.state.chatRoomSelectedId} chatRooms={this.state.chatRooms} currentUserId={this.state.currentUser.id}/>
                            </div>
                        </div>
                        <SidebarFooter user={this.state.currentUser} toggleSidebarFooter={() => this.setState({showSidebarFooter: !this.state.showSidebarFooter})}/>
                    </div>
                    <ChatRoomNew
                        currentUserId={this.state.currentUser.id}
                        messages={this.state.messages}
                        sendMessage={this.sendMessage}
                        newestReadMessageId={this.state.newestReadMessageId}
                        chatRoomId={this.state.selectedChatRoom.id}
                        chatRoom = {this.state.selectedChatRoom}
                        connection = {this.state.conn}
                    />
                </div>
            </div>
            </body>
        );
    }

}

export default Dashboard;