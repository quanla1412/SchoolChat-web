import {Button, Form, ListGroup, Modal} from 'react-bootstrap';
import {useState} from 'react';
import {toast} from 'react-toastify';

const NewChatModal = ({show, handleClose, joinChatRoom}) => {
    const [searchString, setSearchString] = useState('');
    const [users, setUsers] = useState([]);

    const getUsers = () => {
        fetch('http://localhost:5274/User/GetUsers', {
            headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}
        }).then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error("Lấy dữ liệu thất bại!");
        }).then(result => {
            setUsers(result);
        })
            .catch(exception => toast(exception));
    }

    const createChatRoom = (toUserId) => {
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
            joinChatRoom(result.id);
            toast.success("Tạo đoạn chat mới thành công!");
            handleClose();
        });

    }

    return <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>New chat</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className="d-flex">
                <Form.Control value={searchString} onChange={e => setSearchString(e.target.value)} placeholder="Nhập tên hoặc email"/>
                <Button className="ms-2" variant="primary" onClick={getUsers}>Tìm</Button>
            </div>
            <hr/>
            <ListGroup>
                {users.map(user => <ListGroup.Item action key={user.id} onClick={() => createChatRoom(user.id)}> {user.email} </ListGroup.Item>)}
            </ListGroup>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
            <Button variant="primary" onClick={handleClose}>
                Save Changes
            </Button>
        </Modal.Footer>
    </Modal>
}

export default NewChatModal;