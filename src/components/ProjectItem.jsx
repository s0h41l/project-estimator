import { Link } from 'react-router-dom';

const ProjectItem = (props) => {
    const {
        name = '',
        description = '',
        canDelete = false,
        canEdit = false,
        canAddEstimate = false,
        deleteEvent = () => console.log('Delete Event.'),
        editEvent = () => console.log('Edit Event.'),
        addEstimate = () => console.log('Add Estimate Event.'),
        viewProject = () => console.log('View Project Event.')
    } = props;
    return (
        <div className="card my-2">
            <div className="card-header pt-2 pb-0">
                <h5>{name.substr(0, 100)}{name.length > 100 && "..."}</h5>
            </div>
            <div
                className="card-body"
                >{description.substr(0, 800)}{description.length > 800 && "..."}
            </div>
            <div className="card-footer">
                {canDelete && <button
                                className="btn btn-sm btn-danger float-right"
                                onClick={deleteEvent}
                                >DELETE</button>}
                {canDelete && <button
                                className="btn btn-sm btn-info float-right mx-1"
                                onClick={editEvent}
                                >EDIT</button>}

                <button
                                className="btn btn-sm btn-primary mr-1"
                                onClick={viewProject}
                                >VIEW PROJECT</button>
                {canAddEstimate && <button
                                className="btn btn-sm btn-secondary"
                                onClick={addEstimate}
                                >ADD ESTIMATION</button>}
            </div>
        </div>
    );
}

export default ProjectItem;