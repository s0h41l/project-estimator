import { Link } from "react-router-dom";


const Header = (props) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-info">
            <Link to="/users" className="navbar-brand home-brand">Projects</Link>
            
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>

        {/* <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
                <a className="nav-link" href="#">Projects</a>
            </li>
            </ul>
        </div> */}
        </nav>
    )
}

export default Header;
