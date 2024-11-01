import {useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';

const SignUpPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
                <a href="../" className="header-logo mb-4">ChatAllNight</a>
                <h3 className="card-title">Sign Up</h3>
                <p className="card-text">It's free to signup and only takes a minute.</p>
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <label className="form-label">Email address</label>
                    <Form.Control onChange={e => setEmail(e.target.value)} value={email} placeholder="Enter your email address"/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <Form.Control type="password" onChange={e => setPassword(e.target.value)} value={password} placeholder="Enter your password"/>
                </div>
                <div className="mb-4">
                    <small>By clicking <strong>Create Account</strong> below, you agree to our terms of service and privacy
                        statement.</small>
                </div>
                <Button variant="primary" type="submit" className="btn-sign" onClick={register}>Create Account</Button>

                <div className="divider"><span>or sign up using</span></div>

                <div className="row gx-2">
                    <div className="col">
                        <button className="btn btn-facebook"><i className="ri-facebook-fill"></i> Facebook</button>
                    </div>
                    <div className="col">
                        <button className="btn btn-google"><i className="ri-google-fill"></i> Google</button>
                    </div>
                </div>
            </div>
            <div className="card-footer">
                Already have an account? <Link to="/login">Sign In</Link>
            </div>
        </div>
    </body>
}


export default SignUpPage;