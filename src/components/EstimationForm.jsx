import { useState, useEffect, useContext, useRef } from 'react';
import firebase from 'firebase';
import { AuthContext } from '../contexts/Auth';

const EstimationForm = (props) => {

    const { currentUser } = useContext(AuthContext);

    const {
        projectId,
        mode = 'create',
        editFormCancel = () => console.log('Edit form cancel event!'),
        estimationId = 'hfdjhskjdhkjhds'
    } = props;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [version, setVersion] = useState('');
    const [time, setTime] = useState('');
    const [details, setDetails] = useState('');

    const formContainerRef = useRef();

    useEffect(() => {
        setLoading(true);
        try {

            if(mode === 'edit'){
                firebase.database().ref(`projects/${projectId}/estimations/${estimationId}`).once('value', snap => {
                    if(snap.val()){
                        const {
                            title = '',
                            details = '',
                            time = '',
                            version = '',
                            category = ''
                        } = snap.val();

                        setTitle(title);
                        setDetails(details);
                        setTime(time);
                        setVersion(version);
                        setCategory(category);

                        formContainerRef.current.scrollIntoView();
                    }

                    setLoading(false);
                })
            }else{
                setTitle('');
                setDetails('');
                setVersion('');
                setTime(0);
            }
            
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    }, [mode, estimationId])

    const saveHandler = async (event) => {
        event.preventDefault();

        setLoading(true);
        
        const {
            category,
            title,
            details,
            time,
            version
        } = event.target.elements;

        const estimation = {
            category: category.value,
            title: title.value,
            details: details.value,
            time: time.value,
            version: version.value,
            author: currentUser.uid,
            updatedAt: firebase.database.ServerValue.TIMESTAMP
        }

        try {

            if(mode === 'create'){

                await firebase.database().ref('projects').child(`${projectId}/estimations`).push({
                    ...estimation,
                    createdAt: firebase.database.ServerValue.TIMESTAMP
                });            

                clearFields();
    
                setMessage('Estimation Added!');
                
                setLoading(false)
    
                setTimeout(() => setMessage(''), 15*1000);
            }else{
                
                await firebase.database().ref(`projects/${projectId}/estimations/${estimationId}`).update(estimation);
                
                setMessage('Estimation Updated!');

                setTimeout(() => setMessage(''), 15*1000)

                setLoading(false);
            }
            
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }

    }

    const clearFields = () => {
        setTitle('');
        setTime('');
        setDetails('');
    }

    return (
        <div className="container border border-info my-3 py-3" ref={formContainerRef}>
            <h4 className="text-info">{ mode === 'create' ? 'ADD' : 'EDIT' } ESTIMATION</h4>

            <form onSubmit={saveHandler}> 
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                        name="category"
                        className="form-control w-75"
                    >

                        <option value={currentUser.role}>{currentUser.role.toUpperCase()}</option>
                        {/* <option value="backend" defaultValue={category === 'backend'}>Backend</option>
                        <option value="frontend" defaultValue={category === 'frontend'}>Frontend</option>
                        <option value="ui/ux and design" defaultValue={category == 'ui/ux and design'}>UI/UX & Design</option> */}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="version">Version <span className="text-danger">*</span></label>
                    <input
                        type="text"
                        name="version"
                        className="form-control form-control-sm"
                        placeholder="Enter version"
                        required
                        value={version}
                        onChange={event => setVersion(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="title">Title <span className="text-danger">*</span></label>
                    <input
                        type="text"
                        name="title"
                        className="form-control form-control-sm"
                        placeholder="Enter title"
                        required
                        value={title}
                        onChange={event => setTitle(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="time">Estimated Time in Hour(s)<span className="text-danger">*</span></label>
                    <input
                        type="number"
                        min="0"
                        max="9999"
                        name="time"
                        className="form-control form-control-sm"
                        placeholder="Enter estimated time in hour(s)"
                        required
                        value={time}
                        onChange={event => setTime(event.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="details">Details <span className="text-danger">*</span></label>
                    <textarea
                        className="form-control"
                        name="details"
                        placeholder="Enter details"
                        required
                        value={details}
                        onChange={event => setDetails(event.target.value)}
                    ></textarea>
                </div>

                <div className="my-2">
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

                <div className="form-group" style={{height: 10}}>
                    {mode === 'edit' &&                     <a
                        className="btn btn-sm btn-secondary a-button float-right"
                        onClick={editFormCancel}    
                    >
                    CANCEL
                    </a>}
                    <button
                        type="submit"
                        className="btn btn-sm btn-info float-right mr-1"
                        disabled={loading}
                    >
                        {mode === 'create' ? 'ADD' : 'UPDATE'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EstimationForm;