import {Button, Form, ListGroup, Modal} from 'react-bootstrap';
import React from 'react';
import {toast} from 'react-toastify';

const SelectedUserItem = ({user, unselectUser}) => {
    return <div className="me-2">
        <div style={{
            width: 20,
            height: 20,
            borderRadius: '100%',
            backgroundColor: 'white',
            position: 'relative',
            top: 16,
            left: 56,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                width: 16,
                height: 16,
                borderRadius: '100%',
                backgroundColor: 'red',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <span role="button" onClick={unselectUser}><i className="ri-close-line text-white fw-bold pointer-event"></i></span>
            </div>
        </div>
        <img src="/assets/img/img7.jpg" alt="" style={{width: 80, height: 80, borderRadius: '100%'}}/>
        <p style={{width: 80, textOverflow: 'ellipsis', overflow: 'hidden'}}>{user.email}</p>
    </div>
}

class CreateGroupChatModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchString: '',
            users: [],
            groupName: '',
            selectedUsers: []
        }

        this.fetchUsers = () => {
            fetch('http://localhost:5274/User/GetUsers?searchString=' + this.state.searchString + '&excludeCurrentUser=true', {
                headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}
            }).then(response => {
                if(response.ok) {
                    return response.json();
                }
                throw new Error("Lấy dữ liệu thất bại!");
            }).then(result => {
                const selectedUserIds = this.state.selectedUsers.map(user => user.id);
                result = result.filter(user => !selectedUserIds.includes(user.id));
                this.setState({users: result})
            })
            .catch(exception => toast(exception));
        }

        this.createChatRoom = () => {
            const selectedUserIds = this.state.selectedUsers.map(user => user.id);

            if(selectedUserIds.length < 2) {
                toast.error("Nhóm chat phải có từ 3 người trở lên!");
                return;
            }

            fetch('http://localhost:5274/ChatRoom/Create', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    name: this.state.name,
                    toUserIds: selectedUserIds,
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

        this.selectUser = (user) => {
            this.setState({
                selectedUsers: [...this.state.selectedUsers, user],
                users: this.state.users.filter(userItem => userItem.id !== user.id)
            });
        }

        this.unselectUser = (user) => {
            this.setState({
                users: [...this.state.users, user],
                selectedUsers: this.state.selectedUsers.filter(userItem => userItem.id !== user.id)
            });
        }
    }

    componentDidMount() {
        this.fetchUsers();
    }

    render() {
        return <Modal show={this.props.show} onHide={this.props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Tạo nhóm chat mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <Form.Control value={this.state.groupName} onChange={e => this.setState({groupName: e.target.value})} placeholder="Nhập tên nhóm"/>
                </div>
                <hr/>
                <div className="d-flex">
                    <Form.Control value={this.state.searchString} onChange={e => this.setState({searchString: e.target.value})} placeholder="Nhập tên hoặc email"/>
                    <Button className="ms-2" variant="primary" onClick={this.fetchUsers}>Tìm</Button>
                </div>
                <div className="my-2 d-flex">
                    {this.state.selectedUsers.map(selectedUser => <SelectedUserItem user={selectedUser} unselectUser={() => this.unselectUser(selectedUser)}/>)}
                </div>
                <ListGroup>
                    {this.state.users.map(user => <ListGroup.Item action key={user.id} onClick={() => this.selectUser(user)}> {user.email} </ListGroup.Item>)}
                </ListGroup>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.props.handleClose}>
                    Đóng
                </Button>
                <Button variant="primary" onClick={this.createChatRoom}>
                    Tạo
                </Button>
            </Modal.Footer>
        </Modal>
    }
}

export default CreateGroupChatModal;