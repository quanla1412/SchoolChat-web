const MessageItem = ({currentUserId, message}) => {
    console.log(currentUserId)
    const isMyMessage = currentUserId === message.userId;
    return <div className={"msg-item" + isMyMessage ? " reverse" : null}>
        { isMyMessage ? <div className="avatar online"><img src="../assets/img/img16.jpg" alt=""/></div> : null }
        <div className="msg-body">
            <div className="row gx-3 row-cols-auto">
                <div className="col">
                    <div className="msg-bubble">
                        {message.msg} - {message.userId}
                        <span>10:47am</span>
                    </div>
                </div>
                <div className="col">
                    <nav className="nav nav-icon">
                        <a href="" className="nav-link"><i className="ri-reply-line"></i></a>
                        <a href="" className="nav-link"><i className="ri-more-fill"></i></a>
                    </nav>
                </div>
            </div>
        </div>
    </div>
}

const MessageContainerNew = ({currentUserId, messages}) => {
    return <div id="chatBodyContent" className="chat-body-content">
        <div className="divider"><span>August 20, 2023</span></div>

        <div className="msg-item">
            <div className="avatar online"><img src="../assets/img/img16.jpg" alt=""/></div>
            <div className="msg-body">
                <div className="row gx-3 row-cols-auto">
                    <div className="col">
                        <div className="msg-bubble">Excepteur sint occaecat cupidatat non
                            proident <span>8:45pm</span></div>
                    </div>
                    <div className="col">
                        <nav className="nav nav-icon">
                            <a href="" className="nav-link"><i className="ri-reply-line"></i></a>
                            <a href="" className="nav-link"><i className="ri-more-fill"></i></a>
                        </nav>
                    </div>
                </div>
                <div className="row gx-3 row-cols-auto">
                    <div className="col">
                        <div className="msg-bubble">Nam libero tempore, cum soluta nobis est eligendi optio cumque
                            nihil impedit quo minus id quod maxime placeat facere possimus. <span>9:15pm</span>
                        </div>
                    </div>
                    <div className="col">
                        <nav className="nav nav-icon">
                            <a href="" className="nav-link"><i className="ri-reply-line"></i></a>
                            <a href="" className="nav-link"><i className="ri-more-fill"></i></a>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <div className="msg-item reverse">
            <div className="msg-body">
                <div className="row gx-3 row-cols-auto">
                    <div className="col">
                        <div className="msg-bubble">Neque porro quisquam est, qui dolorem ipsum <span>9:20pm</span>
                        </div>
                    </div>
                    <div className="col">
                        <nav className="nav nav-icon">
                            <a href="" className="nav-link"><i className="ri-reply-line"></i></a>
                            <a href="" className="nav-link"><i className="ri-more-fill"></i></a>
                        </nav>
                    </div>
                </div>
                <div className="row gx-3 row-cols-auto">
                    <div className="col">
                        <div className="msg-bubble">Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                            accus <span>9:21pm</span></div>
                    </div>
                    <div className="col">
                        <nav className="nav nav-icon">
                            <a href="" className="nav-link"><i className="ri-reply-line"></i></a>
                            <a href="" className="nav-link"><i className="ri-more-fill"></i></a>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <div className="divider"><span>Today</span></div>

        <div className="msg-item">
            <div className="avatar online"><img src="../assets/img/img16.jpg" alt=""/></div>
            <div className="msg-body">
                <div className="row gx-3 row-cols-auto">
                    <div className="col">
                        <div className="msg-bubble">Excepteur sint occaecat cupidatat non proident, sunt in culpa
                            qui officia deserunt mollit anim id est laborum. <span>10:30am</span></div>
                    </div>
                    <div className="col">
                        <nav className="nav nav-icon">
                            <a href="" className="nav-link"><i className="ri-reply-line"></i></a>
                            <a href="" className="nav-link"><i className="ri-more-fill"></i></a>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <div className="msg-item reverse">
            <div className="msg-body">
                <div className="row gx-3 row-cols-auto">
                    <div className="col">
                        <div className="msg-bubble">Accusantium doloremque laudantium <span>10:40am</span></div>
                    </div>
                    <div className="col">
                        <nav className="nav nav-icon">
                            <a href="" className="nav-link"><i className="ri-reply-line"></i></a>
                            <a href="" className="nav-link"><i className="ri-more-fill"></i></a>
                        </nav>
                    </div>
                </div>
                <div className="row gx-3 row-cols-auto">
                    <div className="col">
                        <div className="msg-bubble">Accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                            quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                            explicabo...<span>10:41am</span></div>
                    </div>
                    <div className="col">
                        <nav className="nav nav-icon">
                            <a href="" className="nav-link"><i className="ri-reply-line"></i></a>
                            <a href="" className="nav-link"><i className="ri-more-fill"></i></a>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        {messages.map(message => <MessageItem message={message}/>)}

        <div id="msgEmpty" className="msg-item reverse d-none">
            <div className="msg-body">
                <div className="row gx-3 row-cols-auto">
                    <div className="col">
                        <div className="msg-bubble"><span></span></div>
                    </div>
                    <div className="col">
                        <nav className="nav nav-icon">
                            <a href="" className="nav-link"><i className="ri-reply-line"></i></a>
                            <a href="" className="nav-link"><i className="ri-more-fill"></i></a>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

    </div>
}

export default MessageContainerNew;