import {Button, Modal} from 'react-bootstrap';
import React from 'react';
import Select from 'react-select';

class AddNewUserToChatModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedOptions: []
        };

        this.renderComponent = () => {
            return this.props.users.map(user => {
                return {
                    label: user.name,
                    value: user.id
                };
            });
        };

        this.handleChange = (selectedOption) => {
            this.setState({ selectedOptions: [...selectedOption] });
        };

        this.addUserToChatRoom = () => {
            const userIds = this.state.selectedOptions.map(option => option.value);
            this.props.addUserToChatRoom(userIds);
        }
    }

    render() {
        return <Modal show={this.props.show} onHide={this.props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Thêm thành viên vào nhóm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Select
                    options={this.renderComponent()}
                    onChange={this.handleChange}
                    isMulti={true}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={this.props.handleClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    }
}

export default AddNewUserToChatModal;