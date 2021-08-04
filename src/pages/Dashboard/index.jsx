import { useState, useEffect, useContext } from 'react';
import firebase from 'firebase';
import { CKEditor } from 'ckeditor4-react';
import { AuthContext } from '../../contexts/Auth';
import ProjectItem from '../../components/ProjectItem';
import ProjectSection from '../../components/ProjectSection';
import { storage } from '../../utils/firebase';

const Dashboard = (props) => {

    // Life Cycle Methods
    useEffect(() => {
        fetchProjects();
    }, [])

    //Contexts
    const { currentUser } = useContext(AuthContext);


    const allInputs = { imgUrl: '' };

    // States
    const [formMode, setFormMode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState('');
    const [message, setMessage] = useState('');
    const [showProject, setshowProject] = useState(false);

    const [projects, setProjects] = useState([]);
    const [projectId, setProjectId] = useState('');

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const [file, setFile] = useState('');
    const [imageAsUrl, setImageAsUrl] = useState(allInputs);

    const [uploadPercentage, setUploadPercentage] = useState('');

    // Event Handlers
    const saveFormHandler = async (event) => {
        
        setLoading(true);
        const { name } = event.target.elements;

        try {
         
            event.preventDefault();

            if(formMode === 'create'){

                if(file){

                    const fileName = `${new Date().getTime()}-${file.name}`;

                    const uploadTask = storage.ref(`/files/${fileName}`).put(file);
                    
                    uploadTask.on('state_changed', snap => {

                    setUploadPercentage(
                        `${Math.floor((snap._delegate.bytesTransferred / snap._delegate.totalBytes)*100)}%`
                    );

                    }, err => {
                        setError(err);
                    }, async () => {
                        await firebase.database().ref('projects').push({
                            name: name.value,
                            description: description,
                            addedBy: currentUser.uid,
                            file: fileName,
                            createdAt: firebase.database.ServerValue.TIMESTAMP,
                            updatedAt: firebase.database.ServerValue.TIMESTAMP
                        });

                        setLoading(false);
                        
                        setMessage('Project Posted!');

                        clearFields();
            
                        setTimeout(() => {
                            setFormMode('');
                            setMessage('');
                            setUploadPercentage('');
                        }, 1500);
                    });
                }else{
                    alert('Select file please.');
                }

            }else{

                if(file){

                    const fileName = `${new Date().getTime()}-${file.name}`;

                    const uploadTask = storage.ref(`/files/${fileName}`).put(file);
                    
                    uploadTask.on('state_changed', snap => {

                    setUploadPercentage(
                        `${Math.floor((snap._delegate.bytesTransferred / snap._delegate.totalBytes)*100)}%`
                    );

                    }, err => {
                        setError(err);
                    }, async () => {

                        await firebase.database().ref('projects').child(projectId).update({
                            name: name.value,
                            description: description,
                            file: fileName,
                            updatedAt: firebase.database.ServerValue.TIMESTAMP
                        });
                
                        setMessage('Project Updated!');
        
                        setLoading(false);

                        clearFields();
                    
                        setTimeout(() => {
                            setFormMode('');
                            setMessage('');
                            setUploadPercentage('');
                        }, 1500);

                    });

                }else{
                    await firebase.database().ref('projects').child(projectId).update({
                        name: name.value,
                        description: description,
                        updatedAt: firebase.database.ServerValue.TIMESTAMP
                    });
            
                    setMessage('Project Updated!');
    
                    setLoading(false);

                    clearFields();
                
                    setTimeout(() => {
                        setFormMode('');
                        setMessage('');
                        setUploadPercentage('');
                    }, 1500);
                }
            }
            
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
                    window.scrollTo(0, 0)
                }

            });   
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

    function viewProject(){
        if(this){
            setshowProject(false);
            setTimeout(() => {
                setProjectId(this);
                setshowProject(true);
            }, 1);
        }
    }

    function addEstimate(){}

    function deleteProject(){
        if(window.confirm('Are you sure you want to delete this project?')){
            setLoading(true);
            setFormMode('');
            clearFields();
            try {
                firebase.database().ref('projects').child(this).remove();
                setMessage('Project deleted!');
                setLoading(false);
                setTimeout(() => setMessage(''), 2000);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        }
    }

    function clearFields(){
        setName('');
        setDescription('');
        setFile(null);
    }

    function cancelFormHandler(){
        setFormMode('');
        clearFields();
    }

    async function handlefile(e){
        setLoading(true);
        try {

            const image = e.target.files[0];
            setFile(image);
    
            setLoading(false);
            
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }

    function downloadFile(){
        storage.ref('files').child(this).getDownloadURL()
        .then(fireBaseUrl => {
            window.open(fireBaseUrl)
        })

    }

    return (
        <div className="container-fluid row">

            <div className={ showProject && !formMode ? 'col-sm-12 col-md-6 col-lg-6 col-xl-6 slide-open' : 'col-md-12 slide-open'}>

                <div className="container my-4" style={{ height: 25 }}>
                    {formMode === '' && <button
                        className="btn btn-primary float-right"
                        onClick={() => setFormMode('create')}
                    >POST PROJECT</button>}
                </div>


                {formMode !== '' && <div className="container border my-3 p-3">
                    <h4 className="mb-4 text-info">
                        {formMode === 'create' ? "NEW POST" : "UPDATE POST"}
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

                            <CKEditor
                                initData={description}
                                onChange={({editor}) => {
                                    setDescription(editor.getData());
                                }}
                                name="description"
                            />

                        </div>

                        <div className="form-group">
                            <label htmlFor="file">File</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={handlefile}
                                required={(formMode === 'create')}
                            />
                        </div>

                        <div className="form-group">
                            <div class="progress">
                                <div
                                    class="progress-bar bg-primary"
                                    style={{width: uploadPercentage}}
                                    role="progressbar"
                                    aria-valuenow="25"
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                >{uploadPercentage}</div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-info">
                            {formMode ==='create' ? "POST" : "UPDATE"}
                        </button>

                        {formMode !== '' && <button
                            className="btn btn-secondary ml-1"
                            onClick={cancelFormHandler}>
                            CANCEL
                        </button>
                        }

                    </form>
                </div>}


                {formMode === "" && <div>
                    <div className="container">
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

                    <div className="container mb-5">

                        {projects.map(x => <ProjectItem
                            name={x.name}
                            key={x._id}
                            description={x.description}
                            file={x.file}
                            deleteEvent={deleteProject.bind(x._id)}
                            editEvent={editProject.bind(x._id)}
                            addEstimate={addEstimate.bind(x._id)}
                            viewProject={viewProject.bind(x._id)}
                            canDelete={currentUser.uid === x.addedBy}
                            canEdit={currentUser.uid === x.addedBy}
                            downloadFile={downloadFile.bind(x.file)}
                        />)}

                    </div>
                </div>}

            </div>

            {formMode == '' && <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 pt-4">
                {showProject && <ProjectSection
                    id={projectId}
                    closeEvent={() => setshowProject(false)}
                />}
            </div>}
        </div>
    );
}

export default Dashboard;

