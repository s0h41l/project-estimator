import { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../contexts/Auth';


const PrivateRoute = ({ component: RouteComponent, ...res }) => {
    const { currentUser } = useContext(AuthContext);

    return (

        <Route
            {...res}
            render={ routeProps => !!currentUser ? 
                (
                    <RouteComponent {...routeProps} />
                )
             : (
                <Redirect to={"/login"} />
            )}    
        />
        
    );
}

export default PrivateRoute;
