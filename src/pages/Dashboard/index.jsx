import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../contexts/Auth';
import firebase from 'firebase';
import ProjectItem from '../../components/ProjectItem';
import ProjectModal from '../../components/ProjectModal';

const Dashboard = (props) => {

    // Life Cycle Methods
    useEffect(() => {
        fetchProjects();
    }, [])

    //Contexts
    const { currentUser } = useContext(AuthContext);


    // States
    const [formMode, setFormMode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');
    const [message, setMessage] = useState('');
    const [showViewModal, setshowViewModal] = useState(false);

    const [projects, setProjects] = useState([]);
    const [projectId, setProjectId] = useState('');

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    // Event Handlers
    const saveFormHandler = (event) => {
        
        setLoading(true);
        const { name, description } = event.target.elements;

        try {
         
            event.preventDefault();

            if(formMode == 'create'){
                firebase.database().ref('projects').push({
                    name: name.value,
                    description: description.value,
                    addedBy: currentUser.uid
                });
        
                setMessage('Project Posted!');
            }else{
                firebase.database().ref('projects').child(projectId).update({
                    name: name.value,
                    description: description.value
                });
        
                setMessage('Project Updated!');
                setFormMode('');
            }
    
            setLoading(false);
            
            clearFields();
            
            setTimeout(() => setMessage(''), 1500);
            
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
        
    }

    const fetchProjects = () => {
        firebase.database().ref('projects').on('value', (snapshot) => {
            if(snapshot.val()){
                const keys = Object.keys(snapshot.val()).reverse();
                setProjects([])
                setProjects(keys.map(key => ({
                    ...snapshot.val()[key],
                    _id: key
                })));
            }
        })
    }

    function editProject(){
        setLoading(true);
        setProjectId(this);
        try {
            firebase.database().ref('projects').child(this).once('value', (snap) => {

                if(snap.val()){
                    const { name, description } = snap.val();
                    setName(name);
                    setDescription(description);
                    setLoading(false);
                    setFormMode('edit');
                }

            });   
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

    function viewProject(){
        if(this){
            setProjectId(this);
            setshowViewModal(true);
        }
    }

    function addEstimate(){}

    function deleteProject(){
        if(window.confirm('Are you sure you want to delete this project?')){
            setLoading(true);
            try {
                firebase.database().ref('projects').child(this).remove();
                setMessage('Project deleted!');
                setLoading(false);
                setTimeout(() => setMessage(''), 1500);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        }
    }

    function clearFields(){
        setName('');
        setDescription('');
    }

    function cancelFormHandler(){
        setFormMode('');
        clearFields();
    }

    return (
        <div>
            {showViewModal && <ProjectModal
                                id={projectId}
                                closeEvent={() => setshowViewModal(false)}
                            />}

            <div className="container my-4 px-0" style={{height: 25}}>
                {formMode == '' && <button
                                        className="btn btn-primary float-right"
                                        onClick={() => setFormMode('create')}
                                    >POST PROJECT</button>}
                {formMode !== '' && <button
                                        className="btn btn-secondary float-right"
                                        onClick={cancelFormHandler}>
                                        CANCEL
                                    </button>}
            </div>


            {formMode !== '' && <div className="container border my-3 p-3">
                <h4 className="mb-4 text-info">
                    {formMode == 'create' ? "NEW POST" : "UPDATE POST"}
                </h4>
                <form onSubmit={saveFormHandler}>
                    <div className="form-group">
                        <label
                            htmlFor="name"
                            >Project Name <span className="text-danger">*</span> 
                            </label>
                        <input
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Enter project name"
                            required
                            value={name}
                            onChange={event => setName(event.target.value)}
                        />
                    </div>
                    <div className="form-control mb-2">
                        <label
                            htmlFor="description"
                        >Description <span className="text-danger">*</span> 
                        </label>
                        <textarea
                            name="description"
                            rows="5"
                            className="form-control"
                            required
                            value={description}
                            onChange={event => setDescription(event.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-info"
                    >{formMode == 'create' ? "POST" : "UPDATE"}
                    </button>

                </form>
            </div>}


            <div className="container px-0">
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

            <div className="container px-0 mb-5">

                {projects.map(x => <ProjectItem
                                        name={x.name}
                                        key={x._id}
                                        description={x.description}
                                        deleteEvent={deleteProject.bind(x._id)}
                                        editEvent={editProject.bind(x._id)}
                                        addEstimate={addEstimate.bind(x._id)}
                                        viewProject={viewProject.bind(x._id)}
                                        canDelete={currentUser.uid == x.addedBy}
                                        canEdit={currentUser.uid == x.addedBy}
                                    />)}
                
            </div>

        </div>
    );
}

export default Dashboard;

