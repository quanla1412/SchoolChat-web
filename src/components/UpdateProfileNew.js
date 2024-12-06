import {Button, Form} from 'react-bootstrap';
import React from 'react';
import {toast} from 'react-toastify';
import axios from 'axios';

class UpdateProfileNew extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            previewAvatar: ''
        }

        this.save = () => {
            const formData = new FormData();
            formData.append('Id', this.state.user.id);
            formData.append('name', this.state.user.name);
            formData.append('birthday', this.state.user.birthday);
            formData.append('gender', this.state.user.gender);
            formData.append('phone', this.state.user.phone);
            formData.append('avatarFiles', this.state.user.avatar);

            console.log(formData.get("id"))

            axios.post('http://localhost:5274/User/UpdateProfile', formData)
                .then(response => {
                    toast.success("Cập nhật thông tin thành công");
                }).catch(error => {
                    toast.error("Cập nhật thông tin thất bại")
                    console.log("UpdateProfile failed: " + error)

                });
        }

        this.uploadAvatar = (e) => {
            const input = document.getElementById('upload-avatar-update-profile');
            const imagePreviewHTML = document.getElementById('avatar-update-profile');
            const [file] = input.files
            if (file) {
                imagePreviewHTML.src = URL.createObjectURL(file)
                this.setState({user: {...this.state.user, avatar: file}})
            }
        }
    }

    componentDidMount() {
        fetch("http://localhost:5274/User/GetCurrentUser", {
            headers: {Authorization: 'Bearer ' + localStorage.getItem('token')}
        }).then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error("Xác thực thất bại!");
        }).then(result => {
            result.birthday = result.birthday.substring(0, result.birthday.indexOf('T'))
            this.setState({
                user: result
            })
            console.log(result)
        })
        .catch(exception => {
            toast.error(exception);
        });
    }

    render() {
        return <div className="chat-body">
            <div className="chat-body-header align-items-center">
                <span role="button" onClick={this.props.handleClose}><i className="ri-arrow-left-s-line fs-24"></i></span>
                <h4 className="ms-2 mt-2">Cập nhật thông tin</h4>
            </div>
            <div className="chat-body-content">
                    <div className="setting-item">
                        <div className="row g-2 align-items-center">
                            <div className="col-md-5">
                                <h6>Ảnh đại diện</h6>
                            </div>
                            <div className="col-md">
                                <div className='d-flex flex-column'>
                                    <img id="avatar-update-profile"
                                         className="avatar-update-profile"
                                         src={!!this.state.user.avatar ? "http://localhost:5274/images/" + this.state.user.avatar : "/assets/img/default-avatar.jpg"}
                                         alt="avatar"/>
                                    <input id="upload-avatar-update-profile" className="form-control mt-2" type="file" onChange={this.uploadAvatar}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="setting-item">
                    <div className="row g-2 align-items-center">
                            <div className="col-md-5">
                                <h6>Họ và tên</h6>
                                <p>Tên hiển thị</p>
                            </div>
                            <div className="col-md">
                                <Form.Control value={this.state.user.name} onChange={(e) => this.setState({
                                    user: {
                                        ...this.state.user,
                                        name: e.target.value
                                    }
                                })} placeholder="Nhập họ tên của bạn..."/>
                            </div>
                        </div>
                    </div>
                    <div className="setting-item">
                        <div className="row g-2">
                            <div className="col-md-5">
                                <h6>Sinh nhật</h6>
                            </div>
                            <div className="col-md">
                                <input type="date" className="form-control" value={this.state.user.birthday}
                                       onChange={(e) => this.setState({
                                           user: {
                                               ...this.state.user,
                                               birthday: e.target.value
                                           }
                                       })}/>
                            </div>
                        </div>
                    </div>
                    <div className="setting-item">
                        <div className="row g-2">
                            <div className="col-md-5">
                                <h6>Giới tính</h6>
                            </div>
                            <div className="col-md">
                                <div key={`inline-radio`} className="mb-3">
                                    <Form.Check
                                        inline
                                        label="Nam"
                                        name="gender"
                                        type={'radio'}
                                        id={`inline-radio-1`}
                                        checked={this.state.user.gender === "MALE"}
                                        onChange={() => this.setState({user: {...this.state.user, gender: "MALE"}})}
                                    />
                                    <Form.Check
                                        inline
                                        label="Nữ"
                                        name="gender"
                                        type={'radio'}
                                        id={`inline-radio-2`}
                                        checked={this.state.user.gender === "FEMALE"}
                                        onChange={() => this.setState({user: {...this.state.user, gender: "FEMALE"}})}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="setting-item">
                        <div className="row g-2 align-items-center">
                            <div className="col-md-5">
                                <h6>Email</h6>
                            </div>
                            <div className="col-md">
                                <Form.Control value={this.state.user.email} disabled={true}/>
                            </div>
                        </div>
                    </div>
                    <div className="setting-item">
                        <div className="row g-2 align-items-center">
                            <div className="col-md-5">
                                <h6>Số điện thoại</h6>
                            </div>
                            <div className="col-md">
                                <Form.Control placeholder="Nhập số điện thoại của bạn..." value={this.state.user.phone}
                                              onChange={(e) => this.setState({
                                                  user: {
                                                      ...this.state.user,
                                                      phone: e.target.value
                                                  }
                                              })}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <Button variant="primary" className="float-end" style={{margin: '0px 20px 20px 20px'}}
                            onClick={this.save}>Lưu</Button>
            </div>
        </div>
    }
}

export default UpdateProfileNew;