import { useState } from "react";

export default (props) => {
    const {
        children,
        version = '',
        category = '',
        time = 0
    } = props;

    const [expandContainer, setExpandContainer] = useState(false);
    return (
        <div>
            <h6
                onClick={() => setExpandContainer(!expandContainer)}
                className={
                    `font-weight-bold pointer border-bottom ${category === 'backend'
                        ? 'text-secondary border-secondary' :
                        category === 'frontend' ?
                            'text-primary border-primary' :
                            'text-success border-success'
                    }`
                }>{
                    version
                } <small className="float-right">{time}h</small>
            </h6>
            <div className={expandContainer ? '' : `d-none`}>
                {children}
            </div>
        </div>
    );
}