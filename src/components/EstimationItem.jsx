import { useState, useEffect, useContext } from 'react';
import firebase from 'firebase';
import { FaRegTrashAlt } from 'react-icons/fa';
import { RiEdit2Line } from 'react-icons/ri'
import { AuthContext } from '../contexts/Auth';

const EstimationItem = (props) => {

    const { currentUser } = useContext(AuthContext);
    const [personName, setPersonName]= useState('Anonymous');
    const {
        editHandler = () => console.log('Edit handler!'),
        deleteHandler= () => console.log('Delete Handler')
    } = props;

    const {
        title = '',
        details = '',
        time = 0,
        category = 'backend',
        author = 'Ou0WYGouqdRmoYhmrzgDERT9xkd2'
    } = props;

    useEffect(() => {
        firebase.database().ref('users').child(author).once('value', (snap) => {
            if(snap && snap.val()){
                const { name } = snap.val();
                setPersonName(name);
            }
        })
    }, [])

    return (
        <div className={`card my-3 ${category == 'backend' ? 'bg-secondary text-white' : category == 'frontend' ? 'bg-primary text-white': 'bg-success text-white'}`}>
            <div
                className="card-header pt-1 pb-0 pl-2 mb-0 d-flex justify-content-between">
                <p className="text-bold my-0">
                    {title}
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
                        <button
                            onClick={editHandler}
                            className="btn btn-sm btn-xs btn-info mx-1"
                            title="Edit Estimation"
                            ><RiEdit2Line/>
                        </button>
                        <button
                            onClick={deleteHandler}
                            className="btn btn-sm btn-xs btn-danger"
                            title="Delete Estimation"
                            ><FaRegTrashAlt/>
                        </button>
                    </div>}
                </div>
            </div>
        </div>
    );
}

export default EstimationItem;