import React, {useEffect, useState} from 'react'
import {myFirebase} from '../../Config/MyFirebase'
import images from '../Themes/Images'
import { useHistory } from "react-router-dom";
import './Header.css'
import {AppString} from './../Const'
import Button from './Button'
import Confirmation from '../Confirmation/Confirmation'
import {myFirestore} from '../../Config/MyFirebase'
import Badge from '@material-ui/core/Badge';
import { withStyles } from '@material-ui/core/styles';


export default function Header(props) {
    const [isOpenDialogConfirmLogout, setOpenDialogConfimLogOut] = useState(false)
    const [listPending, setListPending] = useState([])
    const history = useHistory();
    const currentUserId = localStorage.getItem(AppString.ID)
    const currentUserAvatar = localStorage.getItem(AppString.PHOTO_URL)

    useEffect(() => {
        if (currentUserId) {
            getListUser()
        }
    }, [currentUserId])

    const getListUser = async () => {
        const myPending = await myFirestore.collection(AppString.NODE_USERS).doc(currentUserId).collection(AppString.PENDING).get()
        setListPending(myPending.docs.length > 0 ? [...myPending.docs] : [])
    }

    const onLogoutClick = () => {
        setOpenDialogConfimLogOut(true)
    }

    const doLogout = () => {
        myFirebase
        .auth()
        .signOut()
        .then(() => {
            localStorage.clear()
            history.push('/')
        })
        .catch(function (err) {
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

    const StyledBadge = withStyles((theme) => ({
        badge: {
          right: 12,
          top: 13,
          backgroundColor: '#ea493f',
        },
      }))(Badge);

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
                        <div class={"badge-button"}>
                        <StyledBadge badgeContent={listPending.length}>
                            <Button
                                class={"icon"}
                                image={images.ic_crew}
                                function={onCrewClick}
                                text={"Crew Search"}
                            />
                        </StyledBadge>
                        </div>
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
