import { useState, useEffect, useContext } from 'react';
import firebase from 'firebase';
import { AuthContext } from '../contexts/Auth';

const EstimationItem = (props) => {

    const { currentUser } = useContext(AuthContext);
    const [personName, setPersonName]= useState('Anonymous');

    const {
        title = '',
        details = '',
        time = 0,
        category = 'backend',
        author = 'Ou0WYGouqdRmoYhmrzgDERT9xkd2'
    } = props;

    useEffect(() => {
        firebase.database().ref('users').child(author).once('value', (snap) => {
            if(snap.val()){
                const { name } = snap.val();
                setPersonName(name);
            }
        })
    }, [])

    return (
        <div className="card my-3">
            <div className="card-header pt-1 pb-0 pl-2 mb-0 d-flex justify-content-between">
                <p className="text-bold my-0">
                    {title} | <span className="text-secondary">{category.toUpperCase()}</span>
                </p>
                <small>{time}h</small>
            </div>
            <div className="card-body p-2">
                <small>{details}</small>
            </div>
            <div className="card-footer py-1 px-2">
                <div className="d-flex justify-content-between">
                    <small>{personName}</small>
                    { currentUser.uid == author && <div>
                        <button className="btn btn-sm btn-xs btn-info mx-1">EDIT</button>
                        <button className="btn btn-sm btn-xs btn-danger">DELETE</button>
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default EstimationItem;