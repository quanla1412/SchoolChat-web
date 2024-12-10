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
import ChatRoomInformationSidebar from './components/ChatRoomInformationSidebar';
import TaskDashboard from './components/TaskDashboard';
import WelcomeScreen from './components/WelcomeScreen';

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
            dashboardMode: DashboardMode.WELCOME_SCREEN,
            onlineUserIds: [],
            showInformationSidebar: false,
            tasks: []
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
                    chatRoomSelectedId: chatRoomId,
                    dashboardMode: DashboardMode.CHATROOM
                })
                this.fetchMessages(chatRoomId);
                this.fetchDetailChatRoom(chatRoomId);
            } catch (e) {
                console.log(e)
            }
        };

        this.sendMessage = async (message, type) => {
            try {
                await this.state.conn.invoke("SendMessage", {message, type});
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

        this.fetchChatRooms = (firstTime) => {
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
            console.log('fetchDetailChatRoom')
            //Get chatroom detail
            axios.get(
                'http://localhost:5274/ChatRoom/Detail?id=' + chatRoomId, {
                    headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}
                }
            ).then(data => {
                this.setState({selectedChatRoom: data.data});
            })
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
                    }
                });

                conn.on("NewUserOfflineListener", (userId) => {
                    this.setState({onlineUserIds: [...this.state.onlineUserIds.filter(onlineUserId => onlineUserId !== userId)]});
                });

                conn.on("ReceiveMessage", (message) => {
                    if(this.state.currentUser.id !== message.fromUser.id) {
                        this.markReadMessage(message.id)
                    }

                    const receiveChatRoom = this.state.chatRooms.find(chatRoom => chatRoom.id === message.chatRoomId)
                    receiveChatRoom.newestMessage = message;

                    if(this.state.selectedChatRoom.id === message.chatRoomId && !this.state.messages.map(m => m.id).includes(message.id))
                        this.setState({
                            messages:  [...this.state.messages, message],
                            chatRooms: [...this.state.chatRooms]
                        });
                    else
                        this.setState({
                            chatRooms: [...this.state.chatRooms]
                        });

                    // const notification = new Notification("SchoolChat", { body: msg.message.message, icon: '/assets/img/img7.png' });
                });

                await conn.start();
                await conn.invoke("ConnectToHub", {userId: this.state.currentUser.id});
                this.setState({conn: conn});
            } catch (e) {
                console.log(e)
            }
        };

        this.updateChatroomInformation = (name, avatar) => {
            const formData = new FormData();
            formData.append('Id', this.state.selectedChatRoom.id);
            formData.append('name', name);
            formData.append("avatar", avatar);

            axios.post('http://localhost:5274/ChatRoom/Update', formData)
                .then(response => {
                    this.setState({selectedChatRoom: {...this.state.selectedChatRoom, name: response.data.name, avatar: response.data.avatar}})
                    toast.success("Cập nhật thông tin thành công");
                }).catch(error => {
                toast.error("Cập nhật thông tin thất bại")
                console.log("UpdateChatRoom failed: " + error)
            });
        }

        this.showTaskDashboard = () => {
            axios.get('http://localhost:5274/UserTask/GetByUserId?UserId=' + this.state.currentUser.id)
                .then(result => {
                    this.setState({
                        tasks: result.data,
                        dashboardMode: DashboardMode.TASK,
                        showInformationSidebar: false
                    });
                }).catch(ex => {
                    toast.error("Lấy dữ liệu công việc thất bại");
                    console.log(ex);
                });
        }

        this.completeTask = (taskId) => {
            axios.get('http://localhost:5274/UserTask/CompleteTask?TaskId=' + taskId)
                .then(result => {
                    this.state.tasks.filter(task => task.id === taskId).forEach(task => task.isCompleted = true);
                    if(this.state.selectedChatRoom.id != null)  {
                        const existingTasks = this.state.selectedChatRoom.tasks.filter(task => task.id === taskId);
                        existingTasks.forEach(task => task.isCompleted = true);
                        this.setState({selectedChatRoom: {...this.state.selectedChatRoom, tasks: [...this.state.selectedChatRoom.tasks]}})
                    }
                    this.setState({
                        tasks: [...this.state.tasks]
                    });
                }).catch(ex => {
                    toast.error("Hoàn thành công việc thất bại");
                    console.log(ex);
                });
        }
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
                return <AppCalendar handleClose={() => this.setState({dashboardMode: DashboardMode.CHATROOM})}/>
            case DashboardMode.UPDATE_PROFILE:
                return <UpdateProfileNew handleClose={() => this.setState({dashboardMode: DashboardMode.CHATROOM})}/>
            case DashboardMode.TASK:
                return <TaskDashboard
                    handleClose={() => this.setState({dashboardMode: DashboardMode.CHATROOM})}
                    tasks={this.state.tasks}
                    completeTask={this.completeTask}
                />
            case DashboardMode.WELCOME_SCREEN:
                return <WelcomeScreen
                />
            default:
                return <ChatRoomNew
                    currentUserId={this.state.currentUser.id}
                    messages={this.state.messages}
                    sendMessage={this.sendMessage}
                    newestReadMessageId={this.state.newestReadMessageId}
                    chatRoom = {this.state.selectedChatRoom}
                    connection = {this.state.conn}
                    onlineUserIds = {this.state.onlineUserIds}
                    isShowInformationSideboard={this.state.showInformationSidebar}
                    showInformationSideboard={() => this.setState({showInformationSidebar: !this.state.showInformationSidebar})}
                    updateUsersInChatRoom={(users) => this.setState({selectedChatRoom: {...this.state.selectedChatRoom, users: [...this.state.selectedChatRoom.users, users]}})}
                />;
        }
    }

    render() {
        return (
            <body className="page-app">
            <NewChatModal
                show={this.state.showNewChatModal}
                handleClose={() => this.setState({showNewChatModal: false})}
                joinChatRoom={this.joinChatRoom}
            />
            <CreateGroupChatModal show={this.state.showCreateGroupChatModal} handleClose={() => this.setState({showCreateGroupChatModal: false})} joinChatRoom={this.joinChatRoom} />
            <div className="main main-app p-3 p-lg-4" style={{width: '100%', height: '100%', margin: 0}}>
                <div className="chat-panel">
                    <div className={"chat-sidebar" + (this.state.showSidebarFooter ? " footer-menu-show" : "")}>
                        <div className="sidebar-header">
                            <h6 className="sidebar-title me-auto">SchoolChat</h6>
                            <span role="button" className="header-link ms-1 pointer-event" data-bs-toggle="tooltip"
                                  title="New message" onClick={() => this.setState({showNewChatModal: true})}><i
                                className="ri-chat-new-line"></i></span>
                            <span role="button" className="header-link ms-1 pointer-event" data-bs-toggle="tooltip"
                                  title="New chat group"
                                  onClick={() => this.setState({showCreateGroupChatModal: true})}><i
                                className="ri-group-line"></i></span>
                        </div>
                        <div id="chatSidebarBody" className="sidebar-body">
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
                            showCalendar={() => this.setState({dashboardMode: DashboardMode.CALENDAR, showInformationSidebar: false})}
                            showUpdateProfile={() => this.setState({dashboardMode: DashboardMode.UPDATE_PROFILE, showInformationSidebar: false})}
                            showTask={this.showTaskDashboard}
                        />
                    </div>
                    {this.renderDashboard()}
                    {this.state.showInformationSidebar ?
                        <ChatRoomInformationSidebar
                            chatRoom={this.state.selectedChatRoom}
                            updateChatroomInformation={this.updateChatroomInformation}
                            completeTask={this.completeTask}
                        /> :
                        null
                    }
                </div>
            </div>
            </body>
        );
    }

}

export default Dashboard;