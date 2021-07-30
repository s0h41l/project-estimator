import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../contexts/Auth';
import firebase from 'firebase';
import app from "../../utils/firebase";
import ProjectItem from '../../components/ProjectItem';

const Dashboard = (props) => {

    // Life Cycle Methods
    useEffect(() => {
        fetchProjects()
    }, [])



    //Contexts
    const { currentUser } = useContext(AuthContext);


    // States
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');
    const [message, setMessage] = useState('');

    const [projects, setProjects] = useState([]);


    // Event Handlers
    const saveFormHandler = (event) => {
        
        setLoading(true);
        const { name, description } = event.target.elements;

        try {
         
            event.preventDefault();

            firebase.database().ref('projects').push({
                name: name.value,
                description: description.value,
                addedBy: currentUser.uid
            });
    
            setMessage('Project Posted!');
    
            setLoading(false);
    
            description.value = "";
            name.value = "";
    
            setTimeout(() => setMessage(''), 1500);
            
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
        
    }

    const fetchProjects = () => {
        firebase.database().ref('projects').on('value', (snapshot) => {
            if(snapshot.val()){
                const keys = Object.keys(snapshot.val());
                setProjects([])
                setProjects(keys.map(key => ({
                    ...snapshot.val()[key],
                    _id: key
                })));
            }
        })
    }

    function editProject(){
        console.log(this);
    }

    function viewProject(){
        console.log(this);
    }

    function addEstimate(){
        console.log(this);
    }

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

    return (
        <div>
            <div className="container border my-3 p-3">
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
                        />
                    </div>

                    {error && <div className="alert alert-danger" role="alert">
                        {error}
                    </div>}

                    {message && <div className="alert alert-success" role="alert">
                        {message}
                    </div>}

                    {loading && <p className="text-primary text-center">
                        Loading....
                    </p>}

                    <button
                        type="submit"
                        className="btn btn-info"
                    >Post Project
                    </button>

                </form>
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
                                        canAddEstimate={true}
                                    />)}
                
            </div>

        </div>
    );
}

export default Dashboard;

