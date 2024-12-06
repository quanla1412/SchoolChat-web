import React from 'react';
import {Form} from 'react-bootstrap';
import CreateEventModal from './CreateEventModal';
import 'unicode-emoji-picker';

class SendMessageFormNew extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            message: '',
            showCreateEventModal: false,
            showEmojiPicker: false
        }

        this.sendMessageClick = () => {
            if(!!this.state.message) {
                this.props.sendMessage(this.state.message);
                this.setState({message: ''})
            }
        };

        this.onKeyUpEvent = (e) => {
            console.log(e)
            if (e.key === 'Enter') {
                this.sendMessageClick();
            }
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
                    <a href="" className="nav-link"><i className="ri-add-line"></i></a>
                    <a href="" className="nav-link"><i className="ri-image-line"></i></a>
                    <span role="button" className="nav-link" onClick={() => this.setState({showCreateEventModal: true})}><i className="ri-calendar-line"></i></span>
                    {
                        this.state.showEmojiPicker ?
                            <div id="emojiPickerContainer" className="position-absolute" style={{top: -352}}>
                                <unicode-emoji-picker></unicode-emoji-picker>
                            </div> : null
                    }
                    <span role="button" className="nav-link" style={{marginLeft: 5}} onClick={() => this.setState({showEmojiPicker: !this.state.showEmojiPicker})}>
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
                <nav className="nav nav-icon">
                    <a href="" className="nav-link"><i className="ri-thumb-up-line"></i></a>
                </nav>
            </div>
            <CreateEventModal
                show={this.state.showCreateEventModal}
                handleClose = {() => this.setState({showCreateEventModal: false})}
                currentChatRoomId={this.props.currentChatRoomId}
            />
        </React.Fragment>
    }
}

export default SendMessageFormNew;