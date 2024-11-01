import React from 'react';
import ReactDOM from 'react-dom/client';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import SignInPage from './auth/SingIn/SignInPage';
import SignUpPage from './auth/SingIn/SignUpPage';
import {ToastContainer} from 'react-toastify';
import Dashboard from './Dashboard';

fetch('http://localhost:5274/WeatherForecast', { headers: {
        Authorization: `Bearer CfDJ8P5x2La1lMNAnm868j4eMHZqIws4_WZFfRvXoNcM8-JD32Ggq5AyX3WEXxttTkEk6bs5Ei7GS09QBE4po136473jk-4N5lX-6cP34iW2siEYaWjw7IMYVfZK4u53uh-N_Shx3ih4MzCvjxuPhkGh9k0y6yLv9qlU203BynmcSO-WOvpnciF6KDEqWdNwu6t30J3YJIHsfvvk7v6Ao5LqQCyyZ5wIDaeF-93Fh94GBozgLKSTX-4KQDoPfeURK1oGvR3dlfsBny1mnApE_NknLWJL8-hg_QjdDUMAYc3ZFWjUlg8NIqEDcOs0CXsrS1cdqou5clBR5HRZP3lx4qeJfKuZXF2dULDBbUmZqvCtCC0HGT4zTUxXHScyl-RntojxAF9nEb3ybTdQAnosSWG8FrhPN5tmUvsRWfQc7FNTFYtuDbPow--i9DVumdA7D8xUZjw6mVpVIBO3AU8Eu9y1BWpROqMlTk4qJoEdYW1ADTYbQdEceM45P5ISZgT--PjMdo-U9nyWe5Ppt00ZrBLAJVjb9J4J6iIvylZHJmSxkOmd6xCro0tTP_HM4HNTQcSivSiopz7OUnzPI17jg_w7qYCiirSti5OBWrv8lyuu38u5styj0LY0H-iCIWzQhwKAesPafMyUEtgMyDshH8WkSjfnx9FiTP2ld1sBVqqtkNhieDh2txcM9pmdmVlb9S-n2rrBed_-_uF81bi3P6n4ITJM`
    }}).then(result => {
        console.log(result);
    return result.json();
})
.then(data=>{ console.log(data); })
    .catch(reason => console.log(reason));

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
    },
    {
        path: "/dashboard",
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
