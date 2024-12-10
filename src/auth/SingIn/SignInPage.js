import {useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';

const SignInPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const signIn = () => {
        fetch('http://localhost:5274/login', {
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
                return response.json();
            } else {
                toast.error("Login failed!")
            }
        }).then(result => {
            localStorage.setItem('token', result.accessToken);
            toast.success("Login successfully!");
            navigate("/");
        });
    }

    return <body className="page-sign">
        <div className="card card-sign">
            <div className="card-header">
                <a href="../" className="header-logo mb-4">School Chat</a>
                <h3 className="card-title">Đăng nhập</h3>
                <p className="card-text">Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.</p>
            </div>
            <div className="card-body">
                <div className="mb-4">
                    <label className="form-label">Email</label>
                    <Form.Control onChange={e => setEmail(e.target.value)} value={email} placeholder="Nhập email"/>
                </div>
                <div className="mb-4">
                    <label className="form-label d-flex justify-content-between">Mật khẩu</label>
                    <Form.Control type="password" onChange={e => setPassword(e.target.value)} value={password} placeholder="Nhập mật khẩu"/>
                </div>
                <Button variant="primary" type="submit" onClick={signIn}>Đăng nhập</Button>
            </div>
            <div className="card-footer">
                Chưa có tài khoản? <Link to="/register">Tạo tài khoản</Link>
            </div>
        </div>
    </body>
}


export default SignInPage;