
import { useEffect, useState } from 'react';
import firebase from 'firebase';
import EstimationForm from './EstimationForm';
import EstimationItem from './EstimationItem';


const ProjectSection = (props) => {

    const {
        id,
        closeEvent = () => console.log('Close modal event.'),
        addEstimateEvent = () => console.log('Add Estimate event.'),
    } = props;


    useEffect(() => {
        fetchProject(id);
        return () => {
            setProject({});
        }
    }, [])

    const [formMode, setFormMode] = useState('create');
    const [editItemId, setEditItemId] = useState('xxxxxxx');
    const [loading, setLoading] = useState(false);
    const [project, setProject] = useState({});
    const [estimationList, setEstimations] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const fetchProject = (id) => {
        setLoading(true);
        try {

            firebase.database().ref(`projects`).child(id).on('value', (snap) => {
                setProject(snap.val());
                setLoading(false);
            });  


            firebase.database().ref(`projects/${id}/estimations`).orderByChild('version').on('value', (snap) => {
                if(snap && snap.val()){
                    const estimations = snap.val();
                    if(estimations){
                        const keys = Object.keys(estimations);
                        setEstimations(keys.map(key => ({
                            ...estimations[key],
                            key
                        })));
                    }
                    setLoading(false);
                }
            });   
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

    function showEstimations(estimations){
        let version = '';
        return estimations.map(estimation => {
            let jsx = <div key={estimation.key}>
                {
                    version !== estimation.version && <h6
                        className={
                            `font-weight-bold border-bottom ${
                                estimation.category  ===  'backend' 
                                    ? 'text-secondary border-secondary' :
                                    estimation.category === 'frontend' ?
                                    'text-primary border-primary' :
                                    'text-success border-success'
                            }`
                        }>{
                            estimation.version
                            }
                        </h6>
                }    
                <EstimationItem
                    title={estimation.title}
                    details={estimation.details}
                    time={estimation.time}
                    category={estimation.category}
                    author={estimation.author}
                    editHandler={updateEstimation.bind(estimation.key)}
                    deleteHandler={deleteEstimationHandler.bind(estimation.key)}
                />
            </div>

            version = estimation.version;
            return jsx;
        })

    }

    async function deleteEstimationHandler(){
        if(window.confirm('Are you sure you want to delete this?')){
            setLoading(true);
            try {
                
                await firebase.database().ref(`projects/${id}/estimations`).child(this).remove();
                setMessage('Estimation Deleted!');
                setLoading(false);
                setTimeout(() => setMessage(''), 1.5*1000);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        }
    }

    async function updateEstimation(){
        setEditItemId(this);
        setFormMode('edit');
    }


    return (

        <div className="border p-3">
            <div className="d-flex justify-content-between">
                <h5>{project.name}</h5>
                <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={closeEvent}
                        >Close</button>
            </div>
            <div
                className="project-details mt-3"
                dangerouslySetInnerHTML={{__html: project.description}}
            ></div>

            <hr />

            <EstimationForm
                projectId={id}
                mode={formMode}
                editFormCancel={() => setFormMode('create')}
                estimationId={editItemId}
            />

            <div className="container my-4">
                {error && <div className="alert alert-danger">
                    {error}
                </div>}

                {message && <div className="alert alert-success">
                    {message}
                </div>}

                {loading && <p className="text-primary text-center">
                    Loading....
                </p>}
            </div>

            <hr />

            <h4 className="text-info">
                ESTIMATIONS
            </h4>

            <div className="row mt-3">
                <div className="col-sm-12 col-md-6 col-xl-4 px-2 border-right">

                    <div className="d-flex justify-content-between">
                    <h5 className="mb-4">BACKEND</h5>
                    <span className="text-muted">
                        {
                            estimationList.filter(x => x.category === 'backend').reduce((a, c) => a + +c.time, 0)
                        }h
                    </span>
                    </div>
                    {showEstimations(estimationList.filter(x => x.category === 'backend'))}
                </div>
                <div className="col-sm-12 col-md-6 col-xl-4 px-2 border-right">
                    <div className="d-flex justify-content-between">
                    <h5 className="mb-4">FRONTEND</h5>
                    <span className="text-muted">
                        {
                            estimationList.filter(x => x.category === 'frontend').reduce((a, c) => a + +c.time, 0)
                        }h
                    </span>
                    </div>
                    {showEstimations(estimationList.filter(x => x.category === 'frontend'))}
                </div>
                <div className="col-sm-12 col-md-6 col-xl-4 px-2">
                    <div className="d-flex justify-content-between">
                    <h5 className="mb-4">UI/UX & DESIGN</h5>
                    <span className="text-muted">
                        {
                            estimationList.filter(x => x.category === 'ui/ux and design').reduce((a, c) => a + +c.time, 0)
                        }h
                    </span>
                    </div>
                    {showEstimations(estimationList.filter(x => x.category === 'ui/ux and design'))}
                </div>
            </div>


            <div>
            </div>
        </div>
    );
}

export default ProjectSection;