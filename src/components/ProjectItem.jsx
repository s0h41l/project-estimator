import { Link } from 'react-router-dom';

const ProjectItem = (props) => {
    const {
        name = '',
        description = '',
        file = '',
        canDelete = false,
        canEdit = false,
        canAddEstimate = false,
        deleteEvent = () => console.log('Delete Event.'),
        editEvent = () => console.log('Edit Event.'),
        addEstimate = () => console.log('Add Estimate Event.'),
        viewProject = () => console.log('View Project Event.'),
        downloadFile = () => console.log('Download file event.')
    } = props;
    return (
        <div className="card my-3">
            <div className="card-header pt-2 pb-0">
                <h5>{name.substr(0, 100)}{name.length > 100 && "..."}</h5>
            </div>
            <div
                className="card-body"
                dangerouslySetInnerHTML={{__html: description}}
                >
            </div>
            <div className="card-footer">
                {canDelete && <button
                    className="btn btn-sm btn-danger float-right"
                    onClick={deleteEvent}
                >DELETE</button>}
                {canEdit && <button
                    className="btn btn-sm btn-info float-right mx-1"
                    onClick={editEvent}
                >EDIT</button>}

                {file && <button
                    target="_blank"
                    className="btn btn-sm btn-secondary float-right"
                    onClick={downloadFile}
                >FILE</button>}

                <button
                    className="btn btn-sm btn-primary mr-1"
                    onClick={viewProject}
                >VIEW PROJECT</button>

            
            </div>
        </div>
    );
}

export default ProjectItem;