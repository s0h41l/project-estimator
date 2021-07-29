import { useState, useRef } from 'react';
import './login.css';

const Login = (props) => {

    const email = useRef('');
    const password = useRef('');

    const loginHander = () => {

        const [_email, _pass] = [email.current.value, password.current.value]

        console.log(_email, _pass);
    }

    return (
        <div className="container pt-5 w-50">
            <h1 className="display-4 mb-5 text-center text-white">
                LOGIN
            </h1>

            <input
                type="email"
                className="form-control my-2"
                placeholder="Enter email"
                ref={email}
                
            />

            <input
                type="password"
                className="form-control my-2"
                placeholder="Enter password"
                ref={password}
            />

            <button className="btn btn-info float-right" onClick={loginHander}>
                LOGIN
            </button>
        </div>
    );
};

export default Login;

