import React from 'react'
import Tooltip from '@material-ui/core/Tooltip';

export default function Button(props) {

    return (
        <div>
            <Tooltip title={props.text} arrow>
            <img id="button"
                className={props.class}
                src={props.image}
                onClick={props.function}/>
            </Tooltip>
        </div>
    )
}
