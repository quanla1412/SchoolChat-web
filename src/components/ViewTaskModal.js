import {Button, Modal} from 'react-bootstrap';

const ViewTaskModal = ({task, handleClose, completeTask}) => {
    return <Modal show={task != null} className="modal-event modal-dialog-centered" centered>
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title" id="modalLabelEventView">{task.name}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
            </div>
            <div className="modal-body">
                <div className="date-item">
                    <i className="ri-calendar-line"></i>
                    <div>Ngày giao: <span>{new Date(task.createdDate).toLocaleString('en-US')}</span></div>
                </div>
                <div className="date-item">
                    <i className="ri-user-2-line"></i>
                    <div>Người giao: <span>{task.creator.name}</span></div>
                </div>
                <div className="date-item">
                    <i className="ri-calendar-check-line"></i>
                    <div>Thời hạn: <span>{new Date(task.deadline).toLocaleString('en-US')}</span></div>
                </div>
                <div className="date-item">
                    <i className="ri-check-double-line"></i>
                    <div>Tình trạng: <span>{task.isCompleted ? "Hoàn thành" : "Đã nhận"}</span></div>
                </div>

                <div className="date-item">
                    <i className="ri-group-line"></i>
                    <div>Thành viên: <span>{task.taskAssignees.map(user => user.name).join(', ')}</span></div>
                </div>
                <label className="mt-3 mb-2">Nội dung: </label>
                <p>{task.description}</p>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-white me-auto" data-bs-dismiss="modal" onClick={handleClose}>Đóng</button>
                {
                    !task.isCompleted ? <Button variant="primary" onClick={() => completeTask(task.id)}>Hoàn thành</Button> : null
                }
            </div>
        </div>
    </Modal>
}

export default ViewTaskModal;