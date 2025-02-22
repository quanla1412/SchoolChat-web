import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider, useNavigate} from 'react-router-dom';
import SignInPage from './auth/SingIn/SignInPage';
import SignUpPage from './auth/SingIn/SignUpPage';
import {ToastContainer} from 'react-toastify';
import Dashboard from './Dashboard';
import 'remixicon/fonts/remixicon.css'
import UpdateProfile from './components/UpdateProfile';
import axios from 'axios';


// Config axios defaults
axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem('token');
axios.interceptors.response.use(response => {
    return response;
}, error => {
    if (error.code === "ERR_NETWORK") {
        console.log(error)
        window.location.href='/login';
    }
    return error;
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <Dashboard />,
    },
    {
        path: "/login",
        element: <SignInPage />,
    },
    {
        path: "/register",
        element: <SignUpPage />,
    },
    {
        path: "/update-profile",
        element: <UpdateProfile />,
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <ToastContainer hideProgressBar={true} autoClose={3000}/>
      <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
