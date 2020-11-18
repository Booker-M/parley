import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {myFirebase} from '../../Config/MyFirebase'
import images from '../Themes/Images'
import './Header.css'
import {AppString} from './../Const'

class Header extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpenDialogConfirmLogout: false,
            login: this.props.login ? true : false,
        }
        this.currentUserAvatar = localStorage.getItem(AppString.PHOTO_URL)
    }

    onLogoutClick = () => {
        this.setState({
            isOpenDialogConfirmLogout: true
        })
    }

    doLogout = () => {
        this.setState({isLoading: true})
        myFirebase
            .auth()
            .signOut()
            .then(() => {
                this.setState({isLoading: false}, () => {
                    localStorage.clear()
                    this.props.showToast(1, 'Logout success')
                    this.props.history.push('/')
                })
            })
            .catch(function (err) {
                this.setState({isLoading: false})
                this.props.showToast(0, err.message)
            })
    }

    hideDialogConfirmLogout = () => {
        this.setState({
            isOpenDialogConfirmLogout: false
        })
    }

    onMessageClick = () => {
        this.props.history.push('/main')
    }

    onCrewClick = () => {
        this.props.history.push('/crew')
    }

    onProfileClick = () => {
        this.props.history.push('/profile')
    }

    render() {
        if (this.props.login) {
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
        }
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
                    <img
                        className="icon"
                        alt="An icon logout"
                        src={images.ic_logout}
                        onClick={this.onLogoutClick}
                    />
                    <img
                        className="profile"
                        alt="An icon default avatar"
                        src={this.currentUserAvatar}
                        onClick={this.onProfileClick}
                    />
                    <img
                        className="icon"
                        alt="An icon crew"
                        src={images.ic_crew}
                        onClick={this.onCrewClick}
                    />
                    <img
                        className="icon"
                        alt="An icon message"
                        src={images.ic_message}
                        onClick={this.onMessageClick}
                    />
                </div>

                {/* Dialog confirm */}
                {this.state.isOpenDialogConfirmLogout ? (
                    <div className="viewCoverScreen">
                        {this.renderDialogConfirmLogout()}
                    </div>
                ) : null}
            </div>
        )
    }

    renderDialogConfirmLogout = () => {
        return (
            <div>
                <div className="viewWrapTextDialogConfirmLogout">
                    <span className="titleDialogConfirmLogout">Are you ready to logout?</span>
                </div>
                <div className="viewWrapButtonDialogConfirmLogout">
                    <button className="btnYes" onClick={this.doLogout}>
                        Yes
                    </button>
                    <button className="btnNo" onClick={this.hideDialogConfirmLogout}>
                        Cancel
                    </button>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)
