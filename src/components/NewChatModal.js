import {Button, Form, ListGroup, Modal} from 'react-bootstrap';
import React, {useState} from 'react';
import {toast} from 'react-toastify';

class NewChatModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchString: '',
            users: []
        }

        this.fetchUsers = () => {
            fetch('http://localhost:5274/User/GetUsers?searchString=' + this.state.searchString, {
                headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}
            }).then(response => {
                if(response.ok) {
                    return response.json();
                }
                throw new Error("Lấy dữ liệu thất bại!");
            }).then(result => {
                this.setState({users: result})
            })
            .catch(exception => toast(exception));
        }

        this.createChatRoom = (toUserId) => {
            fetch('http://localhost:5274/ChatRoom/Create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    toUserId: toUserId,
                }),
            }).then(response => {
                if(response.ok) {
                    return response.json();
                } else {
                    toast.error("Tạo thất bại!")
                }
            }).then(result => {
                this.props.joinChatRoom(result.id);
                toast.success("Tạo đoạn chat mới thành công!");
                this.props.handleClose();
            });

        }
    }

    componentDidMount() {
        this.fetchUsers();
    }

    render() {
        return <Modal show={this.props.show} onHide={this.props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>New chat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex">
                    <Form.Control value={this.state.searchString} onChange={e => this.setState({searchString: e.target.value})} placeholder="Nhập tên hoặc email"/>
                    <Button className="ms-2" variant="primary" onClick={this.fetchUsers}>Tìm</Button>
                </div>
                <hr/>
                <ListGroup>
                    {this.state.users.map(user => <ListGroup.Item action key={user.id} onClick={() => this.createChatRoom(user.id)}> {user.email} </ListGroup.Item>)}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.props.handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    }
}

export default NewChatModal;