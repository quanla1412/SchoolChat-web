import {useState} from 'react';
import {Button, Col, Form, FormControl, Row} from 'react-bootstrap';

const WaitingRoom = ({ joinChatRoom }) => {
    const [username, setUsername] = useState();
    const [chatroom, setChatroom] = useState();

    return <Form onSubmit={ e => {
        e.preventDefault();
        joinChatRoom(username, chatroom);
    }}>
        <Row className='px-5 py-5'>
            <Col sm={12}>
                <Form.Group>
                    <FormControl placeholder='Username' onChange={e => setUsername(e.target.value)} />
                    <FormControl placeholder='ChatRoom' onChange={e => setChatroom(e.target.value)} />
                </Form.Group>
            </Col>
            <Col sm={12}>
                <hr/>
                <Button variant='success' type='submit'>Join</Button>
            </Col>
        </Row>
    </Form>
}

export default WaitingRoom;