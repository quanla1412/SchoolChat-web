import {Button, Form, Modal} from 'react-bootstrap';
import React, {useState} from 'react';
import axios, {HttpStatusCode} from 'axios';
import {toast} from 'react-toastify';

const CreateEventModal = ({show, handleClose, currentChatRoomId}) => {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [description, setDescription] = useState('');

    const createEvent = () => {
        axios.post("http://localhost:5274/Event/Create", {
            name,
            startDate,
            endDate,
            description,
            chatRoomId: currentChatRoomId
        }).then((result) => {
            if(result.status != HttpStatusCode.Ok)
                throw new Error(result.response.data);
            toast.success("Tạo sự kiện thành công");
            console.log(result)
            handleClose();
        }).catch((ex) => {
            toast.error("Tạo sự kiện thất bại");
            console.log("Create Event Error: ", ex);
        });
    }

    return <Modal
        show={show}
        onHide={handleClose}
        aria-labelledby="contained-modal-title-vcenter"
        centered
    >
        <Modal.Header closeButton>
            <Modal.Title>Tạo sự kiện</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Group className="mb-3" >
                <Form.Label>Tên sự kiện <span className="text-danger">*</span></Form.Label>
                <Form.Control value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập tên sự kiện"/>
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Ngày giờ bắt đầu <span className="text-danger">*</span></Form.Label>
                <input type="datetime-local" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Ngày giờ kết thúc <span className="text-danger">*</span></Form.Label>
                <input type="datetime-local" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Ghi chú</Form.Label>
                <Form.Control as="textarea" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Nhập tên sự kiện"/>
            </Form.Group>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Đóng
            </Button>
            <Button variant="primary" onClick={createEvent}>
                Tạo
            </Button>
        </Modal.Footer>
    </Modal>
}

export default CreateEventModal;
