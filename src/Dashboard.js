import {Col, Container, Row} from 'react-bootstrap';
import WaitingRoom from './components/waitingroom';
import ChatRoom from './components/ChatRoom';
import NewChatModal from './components/NewChatModal';
import React, {useState} from 'react';
import {HubConnectionBuilder, LogLevel} from '@microsoft/signalr';
import ChatRoomNew from './components/ChatRoomNew';
import {toast} from 'react-toastify';
import ListChatRoom from './components/ListChatRoom';

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        // Initializing the state
        this.state = {
            showNewChatModal: false,
            conn: null,
            messages: [],
            currentUserId: ''
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

                conn.on("ReceiveMessage", (userId, msg) => {
                    this.setState({ messages: [...this.state.messages, {userId, msg}] })

                    const notification = new Notification("SchoolChat", { body: msg.message.message, icon: '/assets/img/img7.png' });
                    console.log("msg: ", msg);
                });

                await conn.start();
                await conn.invoke("JoinSpecificChatRoom", {chatRoomId, userId: this.state.currentUserId});

                this.setState({
                    conn: conn,
                    chatRoomSelectedId: chatRoomId
                })
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
                currentUserId: result.id
            })
            console.log("Laasy duowc r ", result.id)
        })
        .catch(exception => {
            toast.error(exception);
        });
    }

    render() {
        return (
            <body className="page-app">
            <NewChatModal show={this.state.showNewChatModal} handleClose={() => this.setState({showNewChatModal: false})} joinChatRoom={this.joinChatRoom} />
            <div className="main main-app p-3 p-lg-4" style={{width: '100%', height: '100%', margin: 0}}>
                <div className="chat-panel">
                    <div className="chat-sidebar">
                        <div className="sidebar-header">
                            <h6 className="sidebar-title me-auto">Chat Messages</h6>
                            <div className="dropdown">
                                <a href="" className="header-link" data-bs-toggle="dropdown"><i className="ri-more-2-fill"></i></a>
                                <div className="dropdown-menu dropdown-menu-end">
                                    <a href="" className="dropdown-item"><i className="ri-user-add-line"></i> Invite People</a>
                                    <a href="" className="dropdown-item"><i className="ri-question-answer-line"></i> Create Channel</a>
                                    <a href="" className="dropdown-item"><i className="ri-server-line"></i> Server Settings</a>
                                    <a href="" className="dropdown-item"><i className="ri-bell-line"></i> Notification Settings</a>
                                    <a href="" className="dropdown-item"><i className="ri-lock-2-line"></i> Privacy Settings</a>
                                </div>
                            </div>
                            <span role="button" className="header-link ms-1 pointer-event" data-bs-toggle="tooltip" title="New message" onClick={() => this.setState({showNewChatModal: true})}><i className="ri-chat-new-line"></i></span>
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
                                <ListChatRoom joinChatRoom={this.joinChatRoom} chatRoomSelectedId={this.state.chatRoomSelectedId} />
                                <div className="chat-item unread">
                                    <div className="avatar offline"><img src="../assets/img/img11.jpg" alt=""/></div>
                                    <div className="chat-item-body">
                                        <div className="d-flex align-items-center mb-1"><h6 className="mb-0">Dyanne Aceron</h6><small className="ms-auto">10:35am</small></div>
                                        <span>Hi Hello! My name is Dyanne Aceron. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.</span>
                                    </div>
                                </div>
                                <div className="chat-item">
                                    <div className="avatar online"><img src="../assets/img/img14.jpg" alt=""/></div>
                                    <div className="chat-item-body">
                                        <div className="d-flex align-items-center mb-1"><h6 className="mb-0">Leo Mendez</h6><small className="ms-auto">1d</small></div>
                                        <span>There are many variations of pass. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia</span>
                                    </div>
                                </div>
                                <div className="chat-item unread">
                                    <div className="avatar online"><img src="../assets/img/img15.jpg" alt=""/></div>
                                    <div className="chat-item-body">
                                        <div className="d-flex align-items-center mb-1"><h6 className="mb-0">Meriam Salomon</h6><small className="ms-auto">2d</small></div>
                                        <span>Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</span>
                                    </div>
                                </div>
                                <div className="chat-item">
                                    <div className="avatar online"><img src="../assets/img/img17.jpg" alt=""/></div>
                                    <div className="chat-item-body">
                                        <div className="d-flex align-items-center mb-1"><h6 className="mb-0">Rolando Paloso</h6><small className="ms-auto">2d</small></div>
                                        <span>There are many variations of paserror sit voluptatem accusantium doloremque laudantium, totam rem aperiam</span>
                                    </div>
                                </div>
                                <div className="chat-item">
                                    <div className="avatar offline"><img src="../assets/img/img19.jpg" alt=""/></div>
                                    <div className="chat-item-body">
                                        <div className="d-flex align-items-center mb-1"><h6 className="mb-0">Marianne Audrey</h6><small className="ms-auto">5d</small></div>
                                        <span>Hi Hello! There are many variations ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit</span>
                                    </div>
                                </div>
                                <div className="chat-item">
                                    <div className="avatar offline"><img src="../assets/img/img6.jpg" alt=""/></div>
                                    <div className="chat-item-body">
                                        <div className="d-flex align-items-center mb-1"><h6 className="mb-0">Adrian Monino</h6><small className="ms-auto">1w</small></div>
                                        <span>Lorem ipsum is simply dummy text sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt</span>
                                    </div>
                                </div>
                                <div className="chat-item unread">
                                    <div className="avatar offline"><img src="../assets/img/img7.jpg" alt=""/></div>
                                    <div className="chat-item-body">
                                        <div className="d-flex align-items-center mb-1"><h6 className="mb-0">Andrew Ylaya</h6><small className="ms-auto">1w</small></div>
                                        <span>It is a long established fact that aquis autem vel eum iure reprehenderit qui in ea voluptate velit esse</span>
                                    </div>
                                </div>
                                <div className="chat-item">
                                    <div className="avatar online"><img src="../assets/img/img8.jpg" alt=""/></div>
                                    <div className="chat-item-body">
                                        <div className="d-flex align-items-center mb-1"><h6 className="mb-0">Maricel Villalon</h6><small className="ms-auto">2w</small></div>
                                        <span>Hello!, I will be distracted by the requam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur</span>
                                    </div>
                                </div>
                                <div className="chat-item">
                                    <div className="avatar online"><img src="../assets/img/img10.jpg" alt=""/></div>
                                    <div className="chat-item-body">
                                        <div className="d-flex align-items-center mb-1"><h6 className="mb-0">Warren Vito</h6><small className="ms-auto">3w</small></div>
                                        <span>There are many variations of passc up iditate non provident, similique sunt in culpa</span>
                                    </div>
                                </div>
                                <div className="chat-item unread">
                                    <div className="avatar offline"><img src="../assets/img/img11.jpg" alt=""/></div>
                                    <div className="chat-item-body">
                                        <div className="d-flex align-items-center mb-1"><h6 className="mb-0">Lovely Ceballos</h6><small className="ms-auto">6w</small></div>
                                        <span>Hello!, I will be distracted by the replaceat facere possimus, omnis voluptas assumenda</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <ChatRoomNew currentUserId={this.state.currentUserId} messages={this.state.messages} sendMessage={this.sendMessage}/>
                </div>
            </div>
            </body>
        );
    }

}

export default Dashboard;