import React from 'react';

const MessageItem = ({currentUserId, message, isReadMessage}) => {
    const isMyMessage = currentUserId === message.fromUserId;

    const sentDate = new Date(message.sentDate)
        .toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        .toLowerCase()
        .replace(' ','');

    return <div className={'msg-item' + (isMyMessage ? ' reverse' : '')}>
        {!isMyMessage ? <div className="avatar online"><img src="/assets/img/img7.jpg" alt=""/></div> : null}
        <div className="msg-body">
            <div className="row gx-3 row-cols-auto">
                <div className="col">
                    <div className="msg-bubble">
                        {message.text}
                        <span>{sentDate}</span>
                    </div>
                </div>
                <div className="col">
                    <nav className="nav nav-icon">
                        <a href="" className="nav-link"><i className="ri-reply-line"></i></a>
                        <a href="" className="nav-link"><i className="ri-more-fill"></i></a>
                    </nav>
                </div>
            </div>
            {isReadMessage ? <div className="mini-avatar"><img src="/assets/img/img7.jpg" alt=""/></div> : null}
        </div>
    </div>
}

class MessageContainerNew extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        var chatBodyContent = document.getElementById("chatBodyContent");
        chatBodyContent.scrollTop = chatBodyContent.scrollHeight;
        console.log(this.props.newestReadMessageId)
    }

    render() {
        return <div id="chatBodyContent" className="chat-body-content">
            {this.props.messages.map(message => <MessageItem currentUserId={this.props.currentUserId} message={message} isReadMessage={this.props.newestReadMessageId === message.id}/>)}
        </div>
    }


}

export default MessageContainerNew;