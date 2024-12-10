import React from 'react';
import {Form} from 'react-bootstrap';
import CreateEventModal from './CreateEventModal';
import 'unicode-emoji-picker';
import CreateTaskModal from './CreateTaskModal';
import axios from 'axios';
import {toast} from 'react-toastify';
import MessageType from '../common/MessageType';

class SendMessageFormNew extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            showCreateEventModal: false,
            showCreateTaskModal: false,
            showEmojiPicker: false
        }

        this.sendMessageClick = () => {
            if(!!this.state.message) {
                this.props.sendMessage(this.state.message, MessageType.TEXT);
                this.setState({message: ''})
            }
        };

        this.onKeyUpEvent = (e) => {
            if (e.key === 'Enter') {
                this.sendMessageClick();
            }
        }

        this.sendImageClick = () => {
            const input = document.getElementById('send-image-input');
            input.click();
        }

        this.sendFileClick = () => {
            const input = document.getElementById('send-file-input');
            input.click();
        }

        this.handleChooseFile = (isImage) => {
            let input;
            if(isImage)
                input = document.getElementById('send-image-input');
            else
                input = document.getElementById('send-file-input');
            const [file] = input.files;
            if (!file)
                return;

            const formData = new FormData();
            formData.append("files", file);
            console.log(formData.get("files"))
            axios.post("http://localhost:5274/Message/UploadFile", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(response => {
                    const imagePath = response.data;
                    console.log(imagePath)
                    this.props.sendMessage(imagePath, isImage ? MessageType.IMAGE : MessageType.FILE);
                })
                .catch(error => {
                    toast.error("Cập nhật thông tin thất bại")
                    console.log("UpdateProfile failed: " + error)
                });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.showEmojiPicker) {
            const emojiPicker = document.querySelector('unicode-emoji-picker');
            emojiPicker.addEventListener('emoji-pick', (event) => {
                this.setState({message: this.state.message + event.detail.emoji})
            });

            emojiPicker.addEventListener('focusout', (event) => {
                this.setState({showEmojiPicker: false})
            });
        }
    }

    render() {
        return <React.Fragment>
            <div className="chat-body-footer">
                <nav className="nav nav-icon position-relative">
                    <span role="button" className="nav-link" onClick={() => this.setState({showCreateTaskModal: true})}>
                        <i className="ri-task-line"></i>
                    </span>
                    <span role="button" className="nav-link" onClick={this.sendImageClick}>
                        <i className="ri-image-line"></i>
                    </span>
                    <input type="file" className="d-none" id="send-image-input" onChange={() => this.handleChooseFile(true)}/>
                    <span role="button" className="nav-link" style={{marginLeft: 5}} onClick={this.sendFileClick}>
                        <i className="ri-file-text-line"></i>
                    </span>
                    <input type="file" className="d-none" id="send-file-input" onChange={() => this.handleChooseFile(false)}/>
                    <span role="button" className="nav-link" style={{marginLeft: 5}} onClick={() => this.setState({showCreateEventModal: true})}>
                        <i className="ri-calendar-line"></i>
                    </span>
                    {
                        this.state.showEmojiPicker ?
                            <div id="emojiPickerContainer" className="position-absolute" style={{top: -352}}>
                                <unicode-emoji-picker></unicode-emoji-picker>
                            </div> : null
                    }
                    <span role="button" className="nav-link" style={{marginLeft: 5}}
                          onClick={() => this.setState({showEmojiPicker: !this.state.showEmojiPicker})}>
                        <i className="ri-emotion-happy-line"></i>
                    </span>
                </nav>
                <div className="msg-box">
                    <Form.Control onChange={e => this.setState({message: e.target.value})} value={this.state.message}
                                  placeholder="Write your message..."
                                  onKeyUp={this.onKeyUpEvent}/>
                    {
                        !!this.state.message ?
                            <span id="sendMessageButton" role="button" className="msg-send"
                                  onClick={this.sendMessageClick}><i
                                className="ri-send-plane-2-line"></i></span> : null
                    }
                </div>
            </div>
            <CreateEventModal
                show={this.state.showCreateEventModal}
                handleClose = {() => this.setState({showCreateEventModal: false})}
                currentChatRoom={this.props.currentChatRoom}
            />
            <CreateTaskModal
                show = {this.state.showCreateTaskModal}
                handleClose = {() => this.setState({showCreateTaskModal: false})}
                currentChatRoomId = {this.props.currentChatRoom.id}
                listUsers = {this.props.currentChatRoom.users}
            />
        </React.Fragment>
    }
}

export default SendMessageFormNew;