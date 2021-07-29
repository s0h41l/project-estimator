import { useState, useRef, useEffect } from 'react';
import app from '../../utils/firebase';
import './index.css';

const Login = (props) => {

    // States
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');

    // References
    const email = useRef('');
    const password = useRef('');

    //Event Handlers
    const loginHander = async (event) => {
        setLoading(true);
        event.preventDefault();

        const [_email, _pass] = [
            email.current.value,
            password.current.value
        ]

        try {
            const isAuthenticated = await app.auth().signInWithEmailAndPassword(_email, _pass);
            
            setLoading(false);

        } catch (error) {
            setLoading(false);
            setError(error.message);
        }

        

        console.log(_email, _pass);
    }

    return (
        <div className="container pt-5 w-50">
            <h1 className="display-4 mb-5 text-center text-white">
                LOGIN
            </h1>

            <form onSubmit={loginHander}>
                <input
                    type="email"
                    className="form-control my-2"
                    placeholder="Enter email"
                    ref={email}
                    required
                    
                />

                <input
                    type="password"
                    className="form-control my-2"
                    placeholder="Enter password"
                    ref={password}
                    required
                />

                {error && <div className="alert alert-danger" role="alert">
                    {error}
                </div>}

                <button className="btn btn-info float-right" type="submit">
                    LOGIN
                </button>
            </form>
        </div>
    );
};

export default Login;

