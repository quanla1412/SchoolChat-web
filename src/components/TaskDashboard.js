import React from 'react';
import TaskType from '../common/TaskType';
import {Button} from 'react-bootstrap';
import ViewTaskModal from './ViewTaskModal';

class TaskDashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentType: TaskType.MINE,
            selectedTask: null
        }
    }

    render() {
        return <div className="chat-body">
            <div className="chat-body-header align-items-center">
                <span role="button" onClick={this.props.handleClose}><i className="ri-arrow-left-s-line fs-24"></i></span>
                <h4 className="ms-2 mt-2">Xem danh sách công việc</h4>
            </div>
            <div className="chat-body-content">
                <nav className="nav nav-line mb-4">
                    <span
                        role="button"
                        className={"nav-link" + (this.state.currentType === TaskType.MINE ? " active" : "")}
                        onClick={() => this.setState({currentType: TaskType.MINE})}
                    >Của tôi</span>
                    <span
                        role="button"
                        className={"nav-link" + (this.state.currentType === TaskType.ASSIGNED_BY_ME ? " active" : "")}
                        onClick={() => this.setState({currentType: TaskType.ASSIGNED_BY_ME})}
                    >Đã giao</span>
                </nav>
                <div className="row g-3 g-lg-4">
                    <div className="col-md">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <label className="task-label">Đã nhận</label>
                        </div>
                        {this.props.tasks.filter(task => task.type === this.state.currentType && !task.isCompleted)
                            .map(task => <div className="card card-task" onClick={() => this.setState({selectedTask: task})}>
                                <div className="card-body p-3 pb-1">
                                    <div
                                        className="d-flex flex-row-reverse align-items-center justify-content-between mt-2 mb-1">
                                        <span className="card-date">{new Date(task.createdDate).toLocaleString("en-US")}</span>
                                        <h6 className="card-title">{task.name}</h6>
                                    </div>
                                    <p className="fs-xs">Được giao bởi: <a href="">{task.creator.name}</a></p>
                                    <p className="fs-sm">{task.description}</p>

                                    <div
                                        className="d-flex align-items-center justify-content-between fs-xs text-secondary mb-1">
                                        <span>Ngày hết hạn: {new Date(task.deadline).toLocaleString("en-US")}</span>
                                        {
                                            task.type === TaskType.MINE ?
                                                <div>
                                                    <Button className="float-end" variant="primary"
                                                            onClick={() => this.props.completeTask(task.id)}>Hoàn
                                                        thành</Button>
                                                </div> : null
                                        }
                                    </div>
                                </div>
                            </div>)}
                    </div>
                    <div className="col-md mt-5 mt-md-3 mt-lg-4">
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <label className="task-label">Hoàn thành</label>
                        </div>
                        {this.props.tasks.filter(task => task.type === this.state.currentType && task.isCompleted)
                            .map(task => <div className="card card-task" onClick={() => this.setState({selectedTask: task})}>
                                <div className="card-body p-3 pb-1">
                                    <div
                                        className="d-flex flex-row-reverse align-items-center justify-content-between mt-2 mb-1">
                                        <span className="card-date">{new Date(task.createdDate).toLocaleString("en-US")}</span>
                                        <h6 className="card-title">{task.name}</h6>
                                    </div>
                                    <p className="fs-xs">Được giao bởi: <a href="">{task.creator.name}</a></p>
                                    <p className="fs-sm">{task.description}</p>

                                    <div
                                        className="d-flex align-items-center justify-content-between fs-xs text-secondary mb-1">
                                        <span>{new Date(task.deadline).toLocaleString("en-US")}</span>
                                    </div>
                                </div>
                            </div>)}
                    </div>
                </div>
            </div>
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

export default TaskDashboard;