import {Button, Form, Modal} from 'react-bootstrap';
import React from 'react';
import axios, {HttpStatusCode} from 'axios';
import {toast} from 'react-toastify';
import Select from 'react-select';

class CreateTaskModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            deadline: '',
            description: '',
            userOptions: [],
            selectedUserOptions: []
        };

        this.createTask = () => {
            const newTask = {
                chatRoomId: this.props.currentChatRoomId,
                name: this.state.name,
                description: this.state.description,
                deadline: this.state.deadline,
                taskAssigneeIds: this.state.selectedUserOptions.map(option => option.value)
            }

            axios.post("http://localhost:5274/UserTask/Create", newTask)
                .then((result) => {
                    toast.success("Giao việc thành công");
                    this.props.handleClose();
                }).catch((ex) => {
                    toast.error("Giao việc thất bại");
                    console.log("Create Event Error: ", ex);
                });
        }
    }
    
    componentDidMount() {
    }

    render() {
        return <Modal
            show={this.props.show}
            onHide={this.props.handleClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Giao công việc mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" >
                    <Form.Label>Tiêu đề <span className="text-danger">*</span></Form.Label>
                    <Form.Control value={this.state.name} onChange={(e) => this.setState({name: e.target.value})} placeholder="Nhập tiêu đề"/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Nội dung <span className="text-danger">*</span></Form.Label>
                    <Form.Control as="textarea" value={this.state.description} onChange={(e) => this.setState({description: e.target.value})} placeholder="Nhập nội dung công việc"/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Giao cho <span className="text-danger">*</span></Form.Label>
                    <Select
                        options={this.props.listUsers?.map(user => {
                            return {
                                label: user.name,
                                value: user.id
                            };
                        })}
                        value={this.state.selectedUserOptions}
                        onChange={(selectedOption) => this.setState({selectedUserOptions: [...selectedOption]})}
                        isMulti={true}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Thời hạn <span className="text-danger">*</span></Form.Label>
                    <input type="datetime-local" className="form-control" value={this.state.deadline} onChange={(e) => this.setState({deadline: e.target.value})} />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.props.handleClose}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={this.createTask}>
                    Tạo
                </Button>
            </Modal.Footer>
        </Modal>
    }
}

export default CreateTaskModal;
