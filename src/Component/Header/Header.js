import React, {useState} from 'react'
import {withRouter} from 'react-router-dom'
import {myFirebase} from '../../Config/MyFirebase'
import images from '../Themes/Images'
import { useHistory } from "react-router-dom";
import './Header.css'
import {AppString} from './../Const'
import Button from './Button'
import Confirmation from '../Confirmation/Confirmation'

function Header(props) {
    const [isOpenDialogConfirmLogout, setOpenDialogConfimLogOut] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [login, setLogin] = useState(props.login ? true : false)
    const history = useHistory();

    const currentUserAvatar = localStorage.getItem(AppString.PHOTO_URL)

    const onLogoutClick = () => {
        setOpenDialogConfimLogOut(true)
    }

    const doLogout = () => {
        setLoading(true)
        myFirebase
        .auth()
        .signOut()
        .then(() => {
            setLoading(false)
            localStorage.clear()
            history.push('/')
        })
        .catch(function (err) {
            setLoading(false)
        })
    }

    const hideDialogConfirmLogout = () => {
        setOpenDialogConfimLogOut(false)
    }

    const onMessageClick = () => {
        history.push('/main')
    }

    const onCrewClick = () => {
        history.push('/crew')
    }

    const onProfileClick = () => {
        history.push('profile')
    }

    if (props.login) {
        return (
            <div className="header">
                <img
                    className="parrotCenter"
                    alt="Parley Logo"
                    src={images.parrot}
                />
                <span className="textCenter">Parley</span>
            </div>
        )
    } else {
        return (
                <div>
                    {/* Header */}
                    <div className="header">
                        <img
                            className="parrot"
                            alt="Parley Logo"
                            src={images.parrot}
                        />
                        <span className="text">Parley</span>
                        <Button
                            class={"icon"}
                            image={images.ic_logout}
                            function={onLogoutClick}
                            text={"Logout"}
                        />
                        <Button
                            class={"profile"}
                            image={currentUserAvatar}
                            function={onProfileClick}
                            text={"Profile"}
                        />
                        <Button
                            class={"icon"}
                            image={images.ic_crew}
                            function={onCrewClick}
                            text={"Crew Search"}
                        />
                        <Button
                            class={"icon"}
                            image={images.ic_message}
                            function={onMessageClick}
                            text={"Messager"}
                        />
                    </div>

                    {/* Dialog confirm */}
                    {isOpenDialogConfirmLogout ? (
                        <Confirmation
                            text={`Are you ready to logout?`}
                            acceptFunction={() => doLogout()}
                            rejectFunction={() => hideDialogConfirmLogout()}/>
                    ) : null}
                </div>
        )
    }

}

export default withRouter(Header)
