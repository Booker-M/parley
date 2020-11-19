import React, {useState, useEffect, Component} from 'react'
import ReactLoading from 'react-loading'
import {withRouter} from 'react-router-dom'
import {myFirestore} from '../../Config/MyFirebase'
import { useHistory } from "react-router-dom";
import './Crew.css'
import {AppString} from './../Const'
import Header from './../Header/Header'

// function Crew(props) {
//     const [isLoading, setLoading] = useState(true);
//     const [isOpenReportConfirm, setOpenReportConfirm] = useState(false)
//     const [currentPeerUser, setCurrentPeerUser] = useState(null)
//     const [listUser, setListUser] = useState([])
//     const [listPending, setListPending] = useState([])
//     const [listFriends, setListFriends] = useState([])
//     const [listRequested, setListRequested] = useState([])
//     const history = useHistory();

//     const currentUserId = localStorage.getItem(AppString.ID)
//     const currentUserAvatar = localStorage.getItem(AppString.PHOTO_URL)
//     const currentUserNickname = localStorage.getItem(AppString.NICKNAME)
//     const currentUserAboutMe = localStorage.getItem(AppString.ABOUT_ME)
//     const currentUserMyLanguage = localStorage.getItem(AppString.MY_LANGUAGE)
//     const reportedUser = ""

//     useEffect(() => {
//         checkLogin();
//     }, []);

//     const checkLogin = () => {
//         if (!localStorage.getItem(AppString.ID)) {
//             setLoading(false);
//             history.push('/');
//         } else {
//             setLoading(false);
//         }
//     }

//     const getListUser = async () => {
//         const allUsers = await myFirestore.collection(AppString.NODE_USERS).get()
//         console.log(allUsers)
//         setListUser(allUsers.docs.length > 0 ? [...allUsers.docs] : [])
//         const myPending = await myFirestore.collection(AppString.NODE_USERS).doc(currentUserId).collection(AppString.PENDING).get()
//         setListPending(myPending.docs.length > 0 ? [...myPending.docs] : [])
//         const myFriends = await myFirestore.collection(AppString.NODE_USERS).doc(currentUserId).collection(AppString.FRIENDS).get()
//         setListFriends(myFriends.docs.length > 0 ? [...myFriends.docs] : [])
//         const myRequested = await myFirestore.collection(AppString.NODE_USERS).doc(currentUserId).collection(AppString.REQUESTED).get()
//         setListRequested(myRequested.docs.length > 0 ? [...myRequested.docs] : [])
//         setLoading(false)
//     }

//     const sendInvite = (user) => {
//         setLoading(true)
//         myFirestore
//             .collection(AppString.NODE_USERS)
//             .doc(currentUserId)
//             .collection(AppString.REQUESTED)
//             .doc(user.id)
//             .set({id: user.id}).then(
//         myFirestore
//             .collection(AppString.NODE_USERS)
//             .doc(user.id)
//             .collection(AppString.PENDING)
//             .doc(currentUserId)
//             .set({id: currentUserId})).then(
//         getListUser())
//     }

//     const acceptInvite = (user) => {
//         setLoading(true)
//         myFirestore
//             .collection(AppString.NODE_USERS)
//             .doc(currentUserId)
//             .collection(AppString.FRIENDS)
//             .doc(user.id)
//             .set({id: user.id}).then(
//         myFirestore
//             .collection(AppString.NODE_USERS)
//             .doc(user.id)
//             .collection(AppString.FRIENDS)
//             .doc(currentUserId)
//             .set({id: currentUserId})).then(
//         myFirestore
//             .collection(AppString.NODE_USERS)
//             .doc(user.id)
//             .collection(AppString.REQUESTED)
//             .doc(currentUserId)
//             .delete()).then(
//         myFirestore
//             .collection(AppString.NODE_USERS)
//             .doc(currentUserId)
//             .collection(AppString.PENDING)
//             .doc(user.id)
//             .delete()).then(
//         getListUser())
//     }

//     const declineInvite = (user) => {
//         setLoading(true)
//         myFirestore
//             .collection(AppString.NODE_USERS)
//             .doc(currentUserId)
//             .collection(AppString.PENDING)
//             .doc(user.id)
//             .delete().then(
//         myFirestore
//             .collection(AppString.NODE_USERS)
//             .doc(user.id)
//             .collection(AppString.REQUESTED)
//             .doc(currentUserId)
//             .delete()).then(
//         getListUser())
//     }

//     const report = (user) => {
//         reportedUser = user.data().nickname;
//         setOpenReportConfirm(true)
//     }

//     const renderReportConfirm = () => {
//         return (
//             <div>
//                 <div className="viewWrapTextDialogConfirmLogout">
//                     <span className="titleDialogConfirmLogout">Are you sure you want to report {reportedUser}?</span>
//                 </div>
//                 <div className="viewWrapButtonDialogConfirmLogout">
//                     <button className="btnYes" onClick={hideReportConfirm}>
//                         Yes
//                     </button>
//                     <button className="btnNo" onClick={hideReportConfirm}>
//                         Cancel
//                     </button>
//                 </div>
//             </div>
//         )
//     }

//     const hideReportConfirm = () => {
//         setOpenReportConfirm(false)
//     }

//     const renderListUser = (name, ...lists) => {
//         let ids = []
//         lists.forEach(list => {
//             list.forEach((item, index) => {
//                 ids.push(item.id)
//             })
//         })
//         let requestedIds = []
//         listRequested.forEach((item, index) => {
//             requestedIds.push(item.id)
//         })
//         let filteredList = name === "Nonfriends" ? listUser.filter(item => !ids.includes(item.id)) : listUser.filter(item => ids.includes(item.id))
//         if (filteredList.length > 0) {
//             let viewListUser = []
//             filteredList.forEach((item, index) => {
//                 if (item.data().id !== currentUserId) {
//                     viewListUser.push(
//                         <div
//                             key={index}
//                             className={
//                                 currentPeerUser &&
//                                 currentPeerUser.id === item.data().id
//                                     ? 'viewWrapItemFocusedPenpal'
//                                     : 'viewWrapItemPenpal'
//                             }
//                         >
//                             <img
//                                 className="viewAvatarItemPenpal"
//                                 src={item.data().photoUrl}
//                                 alt="icon avatar"
//                             />
//                             <div className="viewWrapContentItem">
//                                 <span className="textItem">{`${
//                                     item.data().nickname
//                                 } | ${item.data().myLanguage}`}</span>
//                                 <span className="textItem">{`About me: ${
//                                     item.data().aboutMe ? item.data().aboutMe : 'Not available'
//                                 }`}</span>
//                             </div>
//                             <button className="btnCrewNo" onClick={() => name  === "Nonfriends" ? report(item) : declineInvite(item)}>
//                                 {name === "Nonfriends" ? "Report" : "Decline Crew Invite"}</button>
//                             <button className="btnCrewYes" onClick={() => name  === "Nonfriends" ? 
//                                 (requestedIds.includes(item.id) ? () => {} : sendInvite(item)) : acceptInvite(item)}>
//                             {name === "Nonfriends" ? 
//                                 (requestedIds.includes(item.id) ? "Pending Invite" : "Send Crew Invite") : "Accept Crew Invite"}</button>
//                         </div>
//                     )
//                 }
//             })
//             return viewListUser
//         } else {
//             return null
//         }
//     }

//     return (
//         <div className="root">
//             <Header
//                 history={props.history}
//             />

//             {/* Body */}
//             <div className="bodyPenpal">
//                 <span className="heading">{listPending.length > 0 ? "Pending Crewmates" : ""}</span>
//                 <div className="viewListNonfriends"> {renderListUser("Pending", listPending)}</div>
//                 <span className="heading">Recruit Your Crew</span>
//                 <div className="viewListNonfriends"> {renderListUser("Nonfriends", listFriends, listPending)}</div>
//             </div>

//             {/* Dialog confirm */}
//             {isOpenReportConfirm ? (
//                 <div className="viewCoverScreen">
//                     {renderReportConfirm()}
//                 </div>
//             ) : null}

//             {/* Loading */}
//             {isLoading ? (
//                 <div className="viewLoading">
//                     <ReactLoading
//                         type={'spin'}
//                         color={'#203152'}
//                         height={'3%'}
//                         width={'3%'}
//                     />
//                 </div>
//             ) : null}
//         </div>
//     )
// }

// export default withRouter(Crew)


class Crew extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            isOpenReportConfirm: false,
            currentPeerUser: null,
            listUser: [],
            listPending: [],
            listFriends: [],
            listRequested: []
        }
        this.currentUserId = localStorage.getItem(AppString.ID)
        this.currentUserAvatar = localStorage.getItem(AppString.PHOTO_URL)
        this.currentUserNickname = localStorage.getItem(AppString.NICKNAME)
        this.currentUserAboutMe = localStorage.getItem(AppString.ABOUT_ME)
        this.currentUserMyLanguage = localStorage.getItem(AppString.MY_LANGUAGE)
        this.reportedUser = "";
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
        const myRequested = await myFirestore.collection(AppString.NODE_USERS).doc(this.currentUserId).collection(AppString.REQUESTED).get()
        this.state.listRequested = myRequested.docs.length > 0 ? [...myRequested.docs] : []
        this.setState({isLoading: false})
    }

    sendInvite = (user) => {
        this.setState({isLoading: true})
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(this.currentUserId)
            .collection(AppString.REQUESTED)
            .doc(user.id)
            .set({id: user.id}).then(
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(user.id)
            .collection(AppString.PENDING)
            .doc(this.currentUserId)
            .set({id: this.currentUserId})).then(
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
            .doc(user.id)
            .collection(AppString.REQUESTED)
            .doc(this.currentUserId)
            .delete()).then(
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
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(user.id)
            .collection(AppString.REQUESTED)
            .doc(this.currentUserId)
            .delete()).then(
        this.getListUser())
    }

    report = (user) => {
        this.reportedUser = user.data().nickname;
        this.setState({isOpenReportConfirm: true})
    }

    renderReportConfirm = () => {
        return (
            <div>
                <div className="viewWrapTextDialogConfirmLogout">
        <span className="titleDialogConfirmLogout">Are you sure you want to report {this.reportedUser}?</span>
                </div>
                <div className="viewWrapButtonDialogConfirmLogout">
                    <button className="btnYes" onClick={this.hideReportConfirm}>
                        Yes
                    </button>
                    <button className="btnNo" onClick={this.hideReportConfirm}>
                        Cancel
                    </button>
                </div>
            </div>
        )
    }

    hideReportConfirm = () => {
        this.setState({
            isOpenReportConfirm: false
        })
    }

    renderListUser = (name, ...lists) => {
        let ids = []
        lists.forEach(list => {
            list.forEach((item, index) => {
                ids.push(item.id)
            })
        })
        let requestedIds = []
        this.state.listRequested.forEach((item, index) => {
            requestedIds.push(item.id)
        })
        let filteredList = name === "Nonfriends" ? this.state.listUser.filter(item => !ids.includes(item.id)) : this.state.listUser.filter(item => ids.includes(item.id))
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
                                    ? 'viewWrapItemFocusedCrew'
                                    : 'viewWrapItemCrew'
                            }
                        >
                            <img
                                className="viewAvatarItemCrew"
                                src={item.data().photoUrl}
                                alt="icon avatar"
                            />
                            <div className="viewWrapContentItem">
                                <span className="textItemCrew">{`${
                                    item.data().nickname
                                } | ${item.data().myLanguage}`}</span>
                                <span className="textItemCrew">{`${
                                    item.data().aboutMe ? item.data().aboutMe : 'Not available'
                                }`}</span>
                            </div>
                            <button className="btnCrewNo" onClick={() => name  === "Nonfriends" ? this.report(item) : this.declineInvite(item)}>
                                {name === "Nonfriends" ? "Report" : "Decline Crew Invite"}</button>
                            <button className="btnCrewYes" onClick={() => name  === "Nonfriends" ? 
                                (requestedIds.includes(item.id) ? () => {} : this.sendInvite(item)) : this.acceptInvite(item)}>
                            {name === "Nonfriends" ? 
                                (requestedIds.includes(item.id) ? "Pending Invite" : "Send Crew Invite") : "Accept Crew Invite"}</button>
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
                <Header
                    showToast={this.props.showToast}
                    history={this.props.history}
                />

                {/* Body */}
                <div className="bodyCrew">
                    <span className="heading">{this.state.listPending.length > 0 ? "Pending Crewmates" : ""}</span>
                    <div className="viewListNonfriends"> {this.renderListUser("Pending", this.state.listPending)}</div>
                    <span className="heading">Find Your Crew</span>
                    <div className="viewListNonfriends"> {this.renderListUser("Nonfriends", this.state.listFriends, this.state.listPending)}</div>
                </div>

                {/* Dialog confirm */}
                {this.state.isOpenReportConfirm ? (
                    <div className="viewCoverScreen">
                        {this.renderReportConfirm()}
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
}

export default withRouter(Crew)