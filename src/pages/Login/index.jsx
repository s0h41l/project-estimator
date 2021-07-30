import { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import app from '../../utils/firebase';
import { AuthContext } from '../../contexts/Auth';
import './index.css';

const Login = (props) => {

    const history = useHistory();

    // Contexts
    const { currentUser } = useContext(AuthContext);

    if(currentUser){
        history.push('/');
    }

    // States
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');

    // References
    const email = useRef('');
    const password = useRef('');

    //Event Handlers
    const loginHander = useCallback(async (event) => {
        setLoading(true);
        event.preventDefault();

        const { email, password } = event.target.elements;
        try {

            await app.auth().signInWithEmailAndPassword(email.value, password.value);
            
            setMessage('Login Successfull!');

            setLoading(false);

            setTimeout(() => {
                history.push('/');
            },1000);

        } catch (error) {
            setLoading(false);
            setError(error.message);
        }
 
    });

    return (
        <div className="container pt-5 w-50">
            <h1 className="display-4 mb-5 text-center text-primary">
                LOGIN
            </h1>

            <form onSubmit={loginHander}>
                <input
                    type="email"
                    name="email"
                    className="form-control my-2"
                    placeholder="Enter email"
                    required
                    
                />

                <input
                    type="password"
                    name="password"
                    className="form-control my-2"
                    placeholder="Enter password"
                    required
                />

                {error && <div className="alert alert-danger" role="alert">
                    {error}
                </div>}

                {message && <div className="alert alert-success" role="alert">
                    {message}
                </div>}

                {loading && <p className="text-primary text-center">
                    Loading....
                </p>}

                <button className="btn btn-info float-right" type="submit">
                    LOGIN
                </button>
            </form>
        </div>
    );
};

export default Login;

