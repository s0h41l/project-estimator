import { useContext } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import PrivateRoute from "./routes/private";
import Login from './pages/Login/index';
import Dashboard from './pages/Dashboard/index';
import Header from "./components/Header";

import { AuthContext } from "./contexts/Auth";

import './assets/css/bootstrap-4.css';
import './assets/css/styles.css';

const App = () => {

  const { currentUser } = useContext( AuthContext );

  return (

      <Router>

        {currentUser && <Header/>}

        <PrivateRoute exact path={"/"} component={Dashboard}/>
        
        <Route exact path="/login">
          <Login />
        </Route>

      </Router>
  );
}

export default App;
