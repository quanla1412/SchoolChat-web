import React from 'react';
import UpdateChatRoomInformationModal from './UpdateChatRoomInformationModal';
import ViewTaskModal from './ViewTaskModal';

class ChatRoomInformationSidebar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showUpdateModal: false,
            showListUsers: false,
            showTasks: false,
            showTaskViewModel: false,
            selectedTask: null
        }
    }

    render() {
        return <div id="chatroom-information-sidebar" className="chat-sidebar" style={{left: 'auto', right: 0}}>
            <div className="sidebar-body">
                <div className="d-flex flex-column align-items-center">
                    <img
                        src={!!this.props.chatRoom.avatar ? 'http://localhost:5274/images/' + this.props.chatRoom.avatar : (this.props.chatRoom.isSingle ? "/assets/img/default-avatar.jpg" : "/assets/img/group-avatar-icon.jpg")}
                        alt="default avatar"
                        style={{borderRadius: '50%', width: 100, height: 100}}
                        className="mb-3"
                    />
                    <h5>{this.props.chatRoom.name}</h5>
                </div>
                {
                    !this.props.chatRoom.isSingle ? <nav className="nav">
                        <span role="button" onClick={() => this.setState({showUpdateModal: true})}><i
                            className="ri-edit-2-line"></i> Chỉnh sửa nhóm</span>
                    </nav> : null
                }
                <nav className="nav">
                    <span role="button" onClick={() => this.setState({showListUsers: !this.state.showListUsers})}>
                        <i className="ri-group-2-line"></i>Thành viên trong nhóm
                        {this.state.showListUsers ?
                            <i className="ri-arrow-up-s-line ms-auto me-0"></i> :
                            <i className="ri-arrow-down-s-line ms-auto me-0"></i>}
                    </span>
                </nav>
                {this.state.showListUsers ? this.props.chatRoom.users.map(user => <nav className="nav">
                    <span>
                        {user.name}
                    </span>
                </nav>) : null}
                <nav className="nav">
                    <span role="button" onClick={() => this.setState({showTasks: !this.state.showTasks})}>
                        <i className="ri-list-check-3"></i>Công việc của nhóm
                        {this.state.showTasks ?
                            <i className="ri-arrow-up-s-line ms-auto me-0"></i> :
                            <i className="ri-arrow-down-s-line ms-auto me-0"></i>}
                    </span>
                </nav>
                {this.state.showTasks ? this.props.chatRoom.tasks.map(task => <nav className="nav">
                    <span onClick={() => this.setState({selectedTask: task})}>
                        {task.name}
                    </span>
                </nav>) : null}

            </div>
            <UpdateChatRoomInformationModal
                show={this.state.showUpdateModal}
                handleClose={() => this.setState({showUpdateModal: false})}
                chatRoom={this.props.chatRoom}
                updateChatRoom={this.props.updateChatroomInformation}
            />
            {
                this.state.selectedTask != null ?
                    <ViewTaskModal
                        task={this.state.selectedTask}
                        handleClose={() => this.setState({selectedTask: null})}
                        completeTask={this.props.completeTask}
                    /> : null
            }
        </div>
    }
}

export default ChatRoomInformationSidebar;