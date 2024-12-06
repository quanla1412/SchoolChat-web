import NewChatModal from './components/NewChatModal';
import React from 'react';
import {HubConnectionBuilder, LogLevel} from '@microsoft/signalr';
import ChatRoomNew from './components/ChatRoomNew';
import {toast} from 'react-toastify';
import ListChatRoom from './components/ListChatRoom';
import CreateGroupChatModal from './components/CreateGroupChatModal';
import SidebarFooter from './components/SidebarFooter';
import axios from 'axios';
import AppCalendar from './components/AppCalendar';
import DashboardMode from './common/DashboardMode';
import UpdateProfileNew from './components/UpdateProfileNew';

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
            selectedChatRoom: {},
            dashboardMode: DashboardMode.CHATROOM,
            onlineUserIds: []
        };

        this.joinChatRoom = async (chatRoomId) => {
            try {
                // Set up handler
                this.state.conn.on("CreateNewChat", (userId, msg) => {
                    this.setState({ messages: [...this.state.messages, {userId, msg}] })
                    console.log("msg: ", msg);
                });

                this.state.conn.on("JoinSpecificChatRoom", (userId, msg) => {
                    // this.setState({ messages: [...this.state.messages, {userId, msg}] })
                    console.log("msg: ", msg);
                });

                this.state.conn.on("NewPinnedMessage", (pinnedMessage) => {
                    this.setState({selectedChatRoom: {...this.state.selectedChatRoom, pinnedMessage }});
                });

                this.state.conn.on("UnpinMessage", () => {
                    this.setState({selectedChatRoom: {...this.state.selectedChatRoom, pinnedMessage: null }});
                });

                this.state.conn.on("UnsentMessage", (messageId) => {
                    const unsentMessage = this.state.messages.find(message => message.id === messageId);
                    unsentMessage.isUnsent = true;
                    unsentMessage.text = "Tin nhắn đã được thu hồi";
                    this.setState({messages: [...this.state.messages]});
                });


                this.state.conn.on("DeleteMessage", (messageId) => {
                    this.setState({messages: [...this.state.messages.filter(message => message.id !== messageId)]});
                });

                await this.state.conn.invoke("JoinSpecificChatRoom", chatRoomId);

                this.setState({
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
                readMessage.readStatuses = [result];
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

        this.initialConnectToChatHub = async () => {
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

                conn.on("OnlineUserIds", (userIds) => {
                    this.setState({onlineUserIds: userIds});
                });

                conn.on("NewUserOnlineListener", (userId) => {
                    if(!this.state.onlineUserIds.includes(userId)) {
                        this.setState({onlineUserIds: [...this.state.onlineUserIds, userId]});
                        console.log("New User Online Id: ", userId)
                    }
                });

                conn.on("NewUserOfflineListener", (userId) => {
                    this.setState({onlineUserIds: [...this.state.onlineUserIds.filter(onlineUserId => onlineUserId !== userId)]});
                    console.log("New User Offline Id: ", userId)
                });

                conn.on("ReceiveMessage", (message) => {
                    if(this.state.currentUser.id !== message.fromUser.id) {
                        this.markReadMessage(message.id)
                    }

                    const receiveChatRoom = this.state.chatRooms.find(chatRoom => chatRoom.id === message.chatRoomId)
                    receiveChatRoom.newestMessage = message;

                    console.log(this.state.selectedChatRoom)

                    this.setState({
                        messages: this.state.selectedChatRoom.id != message.chatRoomId ? [...this.state.messages] : [...this.state.messages, message],
                        chatRooms: [...this.state.chatRooms]
                    });

                    // const notification = new Notification("SchoolChat", { body: msg.message.message, icon: '/assets/img/img7.png' });
                });

                await conn.start();
                await conn.invoke("ConnectToHub", {userId: this.state.currentUser.id});
                this.setState({conn: conn})
            } catch (e) {
                console.log(e)
            }
        };
    }

    componentDidMount() {
        this.initialConnectToChatHub();

        Notification.requestPermission().then((result) => {
            console.log(result);
        });

        axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('token');
        axios.get('http://localhost:5274/User/GetCurrentUser')
            .then((result) => {
                this.setState({
                    currentUser: result.data
                })
            })
            .catch(function (error) {
                console.log(error.toJSON());
                toast.error("Có lỗi xảy ra!");
            });

        this.fetchChatRooms();
    }

    renderDashboard() {

        switch (this.state.dashboardMode) {
            case DashboardMode.CALENDAR:
                return <AppCalendar/>
            case DashboardMode.UPDATE_PROFILE:
                return <UpdateProfileNew handleClose={() => this.setState({dashboardMode: DashboardMode.CHATROOM})}/>
            default:
                return <ChatRoomNew
                    currentUserId={this.state.currentUser.id}
                    messages={this.state.messages}
                    sendMessage={this.sendMessage}
                    newestReadMessageId={this.state.newestReadMessageId}
                    chatRoom = {this.state.selectedChatRoom}
                    connection = {this.state.conn}
                    onlineUserIds = {this.state.onlineUserIds}
                />;
        }
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
                                <ListChatRoom
                                    joinChatRoom={this.joinChatRoom}
                                    chatRoomSelectedId={this.state.chatRoomSelectedId}
                                    chatRooms={this.state.chatRooms}
                                    currentUserId={this.state.currentUser.id}
                                    onlineUserIds={this.state.onlineUserIds}
                                />
                            </div>
                        </div>
                        <SidebarFooter
                            user={this.state.currentUser}
                            toggleSidebarFooter={() => this.setState({showSidebarFooter: !this.state.showSidebarFooter})}
                            showCalendar = {() => this.setState({dashboardMode: DashboardMode.CALENDAR})}
                            showUpdateProfile = {() => this.setState({dashboardMode: DashboardMode.UPDATE_PROFILE})}
                        />
                    </div>
                    {this.renderDashboard()}
                </div>
            </div>
            </body>
        );
    }

}

export default Dashboard;