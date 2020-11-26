import React from 'react'
import './Confirmation.css'

export default function Confirmation(props) {
    return (
        <div className="viewCoverScreen">
            <div>
                <div className="viewWrapTextDialogConfirmLogout">
                    <span className="titleDialogConfirmLogout">{props.text}</span>
                </div>
                <div className="viewWrapButtonDialogConfirmLogout">
                    <button className="btnYes" onClick={props.acceptFunction}>
                        Yes
                    </button>
                    <button className="btnNo" onClick={props.rejectFunction}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}