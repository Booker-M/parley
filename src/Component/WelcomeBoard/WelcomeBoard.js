import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import './WelcomeBoard.css'

export default function WelcomeBoard(props) {
    return (
        <div className="viewWelcomeBoard">
            <span className="textTitleWelcome">{`Welcome, ${props.currentUserNickname}`}</span>
            <img
                className="avatarWelcome"
                src={props.currentUserAvatar}
                alt="icon avatar"
            />
            <span className="textDescriptionWelcome">
                Explore the world through conversation.
            </span>
        </div>
    )
}