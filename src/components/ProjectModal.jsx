
import { useEffect, useState } from 'react';
import firebase from 'firebase';


const ProjectModal = (props) => {

    const {
        id,
        closeEvent = () => console.log('Close modal event.'),
        addEstimateEvent = () => console.log('Add Estimate vent.'),
    } = props;


    useEffect(() => {
        fetchProject(id);
        return () => {
            setProject({});
        }
    }, [])

    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState({});
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchProject = (id) => {
        setLoading(true);
        try {
            firebase.database().ref('projects').child(id).once('value', (snap) => {
                setProject(snap.val());
                setLoading(false);
            });   
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }


    return (
        <div className="modal fade show d-block openModal">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header pt-2 pb-1">
                    <h5>{project.name}</h5>
                    <button
                        type="button"
                        className="close"
                        onClick={closeEvent}
                        >
                        <span>×</span>
                    </button>
                </div>
                <div className="modal-body" style={{height: '50vh', overflowY: 'auto'}}>
                    <p>{project.description}</p>



                    <div className="container my-4">
                        {error && <div className="alert alert-danger" role="alert">
                            {error}
                        </div>}

                        {message && <div className="alert alert-success" role="alert">
                            {message}
                        </div>}

                        {loading && <p className="text-primary text-center">
                            Loading....
                        </p>}
                    </div>

                    <div className="container border">
                        jk
                    </div>

                </div>
                <div className="modal-footer">

                <button
                    className="btn btn-sm btn-primary mx-0"
                    onClick={addEstimateEvent}
                    >ADD ESTIMATION
                </button>

                    <button
                        type="button"
                        className="btn btn-sm btn-secondary"
                        onClick={closeEvent}
                    >Close</button>
                    {/* <button type="button" className="btn btn-sm btn-primary">Save changes</button> */}
                </div>
                </div>
            </div>
        </div>
    );
}

export default ProjectModal;