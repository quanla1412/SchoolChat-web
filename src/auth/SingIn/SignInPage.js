import {useState} from 'react';
import {Button, Form} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import {toast, ToastContainer} from 'react-toastify';

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



        fetch('http://localhost:5274/WeatherForecast?', {
            credentials: "include",
        }).then(response => {
            if(response.ok) {
                return response.json();
            }
            throw new Error("Login failed!");
        }).then(result => console.log(result))
            .catch(exception => console.log(exception));
    }

    return <body className="page-sign">
        <div className="card card-sign">
            <div className="card-header">
                <a href="../" className="header-logo mb-4">ChatAllNight</a>
                <h3 className="card-title">Sign In</h3>
                <p className="card-text">Welcome back! Please signin to continue.</p>
            </div>
            <div className="card-body">
                <div className="mb-4">
                    <label className="form-label">Email address</label>
                    <Form.Control onChange={e => setEmail(e.target.value)} value={email} placeholder="Enter your email address"/>
                </div>
                <div className="mb-4">
                    <label className="form-label d-flex justify-content-between">Password <a href="">Forgot
                        password?</a></label>
                    <Form.Control type="password" onChange={e => setPassword(e.target.value)} value={password} placeholder="Enter your password"/>
                </div>
                <Button variant="primary" type="submit" onClick={signIn}>Sign In</Button>

                <div className="divider"><span>or sign in with</span></div>

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
                Don't have an account? <Link to="/register">Create an Account</Link>
            </div>
        </div>
    </body>
}


export default SignInPage;