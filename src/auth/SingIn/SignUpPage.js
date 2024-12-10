import {useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [studentNumber, setStudentNumber] = useState('');
    const navigate = useNavigate();

    const register = () => {
        fetch('http://localhost:5274/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        }).then(response => {
            if(response.ok) {
                toast.success("Register successfully! Please log in!")
                navigate("/login");
            } else {
                return response.json();
            }
        }).then(result => Object.keys(result.errors).map((key) => {
            toast.error(result.errors[key][0])
        }));
    }

    return <body className="page-sign">
        <div className="card card-sign">
            <div className="card-header">
                <a href="../" className="header-logo mb-4">SchoolChat</a>
                <h3 className="card-title">Đăng ký</h3>
                <p className="card-text">Đăng ký tài khoản để bắt đầu nhắn tin.</p>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <Form.Control onChange={e => setEmail(e.target.value)} value={email}
                                  placeholder="Nhập địa chỉ email"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Mật khẩu</label>
                    <Form.Control type="password" onChange={e => setPassword(e.target.value)} value={password}
                                  placeholder="Nhập mật khẩu"/>
                </div>
                <Button variant="primary" type="submit" className="btn-sign" onClick={register}>Tạo tài khoản</Button>
            </div>
            <div className="card-footer">
                Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </div>
        </div>
    </body>
}


export default SignUpPage;