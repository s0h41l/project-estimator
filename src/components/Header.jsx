import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase";
import { AuthContext } from "../contexts/Auth";
import app from "../utils/firebase";


const Header = (props) => {
    
    const [name, setName] = useState('');

    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        firebase.database().ref('users').child(currentUser.uid).once('value', (snap) => {

            console.log(currentUser.uid, snap.val());
            if(snap.val()){
                const { name } = snap.val();
                setName(name);
            }
        })
    }, [])

    return (
        <nav className="navbar navbar-expand navbar-light bg-info">
            <Link to="/" className="navbar-brand home-brand">Projects</Link>
            
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="w-100">
            <a className="na float-right text-white mx-2 cursor" onClick={() => app.auth().signOut()}>LogOut</a>
            <span className="float-right text-white">{name}</span>
        </div>

        </nav>
    )
}

export default Header;
