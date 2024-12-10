import {Button, Form, Modal} from 'react-bootstrap';
import React, {useState} from 'react';

const UpdateChatRoomInformationModal = ({show, handleClose, chatRoom, updateChatRoom}) => {
    const [name, setName] = useState(chatRoom.name);
    const [avatar, setAvatar] = useState(null);

    const uploadAvatar = (e) => {
        const input = document.getElementById('upload-avatar-update-profile');
        const imagePreviewHTML = document.getElementById('avatar-update-profile');
        const [file] = input.files;
        if (file) {
            imagePreviewHTML.src = URL.createObjectURL(file);
            setAvatar(file);
        }
    }

    return <Modal show={show} onHide={handleClose}>
         <Modal.Header closeButton>
             <Modal.Title>Cập nhật thông tin nhóm</Modal.Title>
         </Modal.Header>
        <Modal.Body>
            <div className='d-flex flex-column align-items-center mb-3'>
                <img id="avatar-update-profile"
                     className="avatar-update-profile"
                     src={!!chatRoom.avatar ? "http://localhost:5274/images/" + chatRoom.avatar : (chatRoom.isSingle ? "/assets/img/default-avatar.jpg" : "/assets/img/group-avatar-icon.jpg")}
                     alt="avatar"/>
                <input id="upload-avatar-update-profile" className="form-control mt-2" type="file" onChange={uploadAvatar} />
            </div>
            <div>
                <Form.Label>Tên nhóm</Form.Label>
                <Form.Control value={name} onChange={(e) => setName(name)} placeholder="Nhập họ tên của bạn..."/>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Đóng
            </Button>
            <Button variant="primary" onClick={() => updateChatRoom(name, avatar)}>
                Tạo
            </Button>
        </Modal.Footer>
    </Modal>
}

export default UpdateChatRoomInformationModal;