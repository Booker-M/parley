import React, {Component} from 'react'
import ReactLoading from 'react-loading'
import {withRouter} from 'react-router-dom'
import {myFirebase, myFirestore} from '../../Config/MyFirebase'
import images from '../Themes/Images'
import './PenPals.css'
import {AppString} from './../Const'

class PenPals extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            isOpenDialogConfirmLogout: false,
            currentPeerUser: null,
            listUser: [],
            listPending: [],
            listFriends: []
        }
        this.currentUserId = localStorage.getItem(AppString.ID)
        this.currentUserAvatar = localStorage.getItem(AppString.PHOTO_URL)
        this.currentUserNickname = localStorage.getItem(AppString.NICKNAME)
        this.currentUserAboutMe = localStorage.getItem(AppString.ABOUT_ME)
        this.currentUserMyLanguage = localStorage.getItem(AppString.MY_LANGUAGE)
        // this.listUser = []
        // this.listPending = []
        // this.listFriends = []
    }

    componentDidMount() {
        this.checkLogin()
    }

    checkLogin = () => {
        if (!localStorage.getItem(AppString.ID)) {
            this.setState({isLoading: false}, () => {
                this.props.history.push('/')
            })
        } else {
            this.getListUser()
        }
    }

    getListUser = async () => {
        const allUsers = await myFirestore.collection(AppString.NODE_USERS).get()
        this.state.listUser = allUsers.docs.length > 0 ? [...allUsers.docs] : []
        const myPending = await myFirestore.collection(AppString.NODE_USERS).doc(this.currentUserId).collection(AppString.PENDING).get()
        this.state.listPending = myPending.docs.length > 0 ? [...myPending.docs] : []
        const myFriends = await myFirestore.collection(AppString.NODE_USERS).doc(this.currentUserId).collection(AppString.FRIENDS).get()
        this.state.listFriends = myFriends.docs.length > 0 ? [...myFriends.docs] : []
        this.setState({isLoading: false})
        console.log(this.state.listUser.data())
        console.log(this.state.listPending.data())
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

    onProfileClick = () => {
        this.props.history.push('/profile')
    }

    sendInvite = (user) => {
        this.setState({isLoading: true})
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(user.id)
            .collection(AppString.PENDING)
            .doc(this.currentUserId)
            .set({id: this.currentUserId}).then(
        this.getListUser())
    }

    acceptInvite = (user) => {
        this.setState({isLoading: true})
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(this.currentUserId)
            .collection(AppString.FRIENDS)
            .doc(user.id)
            .set({id: user.id}).then(
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(user.id)
            .collection(AppString.FRIENDS)
            .doc(this.currentUserId)
            .set({id: this.currentUserId})).then(
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(this.currentUserId)
            .collection(AppString.PENDING)
            .doc(user.id)
            .delete()).then(
        this.getListUser())
    }

    declineInvite = (user) => {
        this.setState({isLoading: true})
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(this.currentUserId)
            .collection(AppString.PENDING)
            .doc(user.id)
            .delete().then(
        this.getListUser())
    }

    report = (user) => {

    }

    renderListUser = (name, list) => {
        // console.log(myFirestore.collection(AppString.NODE_USERS).doc(this.currentUserId).collection(AppString.PENDING))
        // !list.includes(item.id)
        let filteredList = []//name === "Nonfriends" ? myFirestore.collection(AppString.NODE_USERS).where("id", "in", myFirestore.collection(AppString.NODE_USERS).doc(this.currentUserId).collection(AppString.PENDING)) : this.state.listUser.filter(item => list.includes(item.id))
        if (filteredList.length > 0) {
            let viewListUser = []
            filteredList.forEach((item, index) => {
                if (item.data().id !== this.currentUserId) {
                    viewListUser.push(
                        <div
                            key={index}
                            className={
                                this.state.currentPeerUser &&
                                this.state.currentPeerUser.id === item.data().id
                                    ? 'viewWrapItemFocusedPenpal'
                                    : 'viewWrapItemPenpal'
                            }
                        >
                            <img
                                className="viewAvatarItemPenpal"
                                src={item.data().photoUrl}
                                alt="icon avatar"
                            />
                            <div className="viewWrapContentItem">
                                <span className="textItem">{`${
                                    item.data().nickname
                                    } | ${item.data().myLanguage}`}</span>
                                                <span className="textItem">{`About me: ${
                                                    item.data().aboutMe ? item.data().aboutMe : 'Not available'
                                                    }`}</span>
                            </div>
                            <button className="btnNo" onClick={() => name  === "Nonfriends" ? this.report(item) : this.declineInvite(item)}>
                                {name === "Nonfriends" ? "Report" : "Decline Crew Invite"}</button>
                            <button className="btnYes" onClick={() => name  === "Nonfriends" ? this.sendInvite(item) : this.acceptInvite(item)}>
                                {name === "Nonfriends" ? "Send Crew Invite" : "Accept Crew Invite"}</button>
                        </div>
                    )
                }
            })
            return viewListUser
        } else {
            return null
        }
    }

    render() {
        return (
            <div className="root">
                {/* Header */}
                <div className="header">
                    <span>Parley</span>
                    <img
                        className="icProfile"
                        alt="An icon default avatar"
                        src={this.currentUserAvatar}
                        onClick={this.onProfileClick}
                    />
                    <img
                        className="icLogout"
                        alt="An icon logout"
                        src={images.ic_logout}
                        onClick={this.onLogoutClick}
                    />
                </div>

                {/* Body */}
                <div className="bodyPenpal">
                    <span className="heading">{this.state.listPending.length > 0 ? "Pending Crewmates" : ""}</span>
                    <div className="viewListNonfriends"> {this.renderListUser("Pending", this.state.listPending)}</div>
                    <span className="heading">Recruit Your Crew</span>
                    <div className="viewListNonfriends"> {this.renderListUser("Nonfriends", this.state.listFriends)}</div>
                </div>

                {/* Dialog confirm */}
                {this.state.isOpenDialogConfirmLogout ? (
                    <div className="viewCoverScreen">
                        {this.renderDialogConfirmLogout()}
                    </div>
                ) : null}

                {/* Loading */}
                {this.state.isLoading ? (
                    <div className="viewLoading">
                        <ReactLoading
                            type={'spin'}
                            color={'#203152'}
                            height={'3%'}
                            width={'3%'}
                        />
                    </div>
                ) : null}
            </div>
        )
    }

    renderDialogConfirmLogout = () => {
        return (
            <div>
                <div className="viewWrapTextDialogConfirmLogout">
                    <span className="titleDialogConfirmLogout">Are you sure to logout?</span>
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

export default withRouter(PenPals)
