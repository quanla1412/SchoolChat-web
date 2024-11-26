const PinnedMessageContainer = ({message}) => <div className="d-flex border-bottom">
    <div className="d-flex justify-content-center align-items-center py-2 px-3 text-primary">
        <i className="ri-pushpin-fill fs-18"></i>
    </div>
    <div className="">
        <p className="fs-11 mt-1 mb-0">{message.fromUser.name}</p>
        <h5 className="fs-11 mb-1 fw-bold">{message.text}</h5>
    </div>
</div>

export default PinnedMessageContainer;