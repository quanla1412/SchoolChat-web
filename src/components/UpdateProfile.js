import {Button, Form} from 'react-bootstrap';
import React from 'react';
import {toast} from 'react-toastify';

class UpdateProfile extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {}
        }

        this.save = () => {
            fetch('http://localhost:5274/User/UpdateProfile', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    id: this.state.user.id,
                    name: this.state.user.name,
                    birthday: this.state.user.birthday,
                    gender: this.state.user.gender,
                    phone: this.state.user.phone
                }),
            }).then(response => {
                if(response.ok) {
                    toast.success("Cập nhật thông tin thành công");
                } else {
                    toast.error("Cập nhật thông tin thất bại")
                }
            });
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
        return <div className="main p-4 p-lg-5 m-0">
            <h2 className="main-title">Cập nhật thông tin</h2>

            <div className="card card-settings">
                <div className="card-header">
                    <h5 className="card-title">Thông tin cá nhân</h5>
                </div>
                <div className="card-body p-0">
                    <div className="setting-item">
                        <div className="row g-2 align-items-center">
                            <div className="col-md-5">
                                <h6>Họ và tên</h6>
                                <p>Tên hiển thị</p>
                            </div>
                            <div className="col-md">
                                <Form.Control value={this.state.user.name} onChange={(e) => this.setState({user: {...this.state.user, name: e.target.value}})} placeholder="Nhập họ tên của bạn..."/>
                            </div>
                        </div>
                    </div>
                    <div className="setting-item">
                        <div className="row g-2">
                            <div className="col-md-5">
                                <h6>Sinh nhật</h6>
                            </div>
                            <div className="col-md">
                                <input type="date" className="form-control" value={this.state.user.birthday} onChange={(e) => this.setState({user: {...this.state.user, birthday: e.target.value}})}/>
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
                                <Form.Control placeholder="Nhập số điện thoại của bạn..."  value={this.state.user.phone}
                                              onChange={(e) => this.setState({user: {...this.state.user, phone: e.target.value}})}/>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <Button variant="primary" className="float-end" style={{margin: '0px 20px 20px 20px'}} onClick={this.save}>Lưu</Button>
                </div>
            </div>
        </div>
    }
}

export default UpdateProfile;