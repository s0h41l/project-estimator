import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from './pages/Login/index';
import Dashboard from './pages/Dashboard/index';
import PrivateRoute from "./routes/private";

import { AuthProvider } from "./contexts/Auth";

import './assets/css/bootstrap-4.css';
import './assets/css/styles.css';

const App = () => {
  return (
    <AuthProvider>

      <Router>
        <PrivateRoute exact path={"/dashboard"} component={Dashboard}/>
        <Route exact path="/login">
          <Login />
        </Route>
      </Router>

    </AuthProvider>
  );
}

export default App;
