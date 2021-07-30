import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/Auth";
import app from "../utils/firebase";


const Header = (props) => {
    const { currentUser } = useContext(AuthContext);
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-info">
            <Link to="/" className="navbar-brand home-brand">Projects</Link>
            
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        <div className="w-100">
            <a className="na float-right text-white mx-2 cursor" onClick={() => app.auth().signOut()}>LogOut</a>
            <span className="float-right text-white">{currentUser.email}</span>
        </div>

        </nav>
    )
}

export default Header;
