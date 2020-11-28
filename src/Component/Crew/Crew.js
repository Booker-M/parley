import React, {useState, useEffect} from 'react'
import ReactLoading from 'react-loading'
import {myFirestore} from '../../Config/MyFirebase'
import './Crew.css'
import {AppString} from './../Const'
import Header from './../Header/Header'
import UserList from './UserList'
import {listLanguagesWithTarget} from '../../Config/MyTranslate.js'
import Confirmation from '../Confirmation/Confirmation'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Crew(props) {
    const [isLoading, setLoading] = useState(true);
    const [isOpenReportConfirm, setOpenReportConfirm] = useState(false)
    const [isOpenUnreportConfirm, setOpenUnreportConfirm] = useState(false)
    const [isOpenUninviteConfirm, setOpenUninviteConfirm] = useState(false)
    const [listUser, setListUser] = useState([])
    const [listPending, setListPending] = useState([])
    const [listFriends, setListFriends] = useState([])
    const [listRequested, setListRequested] = useState([])
    const [listReported, setListReported] = useState([])
    const [reportedUser, setReportedUser] = useState("")
    const [languages, setLanguages] = useState([])

    const currentUserId = localStorage.getItem(AppString.ID)

    useEffect(() => {
        getListUser();
        updateLanguages()
    }, [])

    async function updateLanguages() {
        setLanguages(await listLanguagesWithTarget())
    }

    const getListUser = async () => {
        const allUsers = await myFirestore.collection(AppString.NODE_USERS).get()
        setListUser(allUsers.docs.length > 0 ? [...allUsers.docs] : [])
        const myPending = await myFirestore.collection(AppString.NODE_USERS).doc(currentUserId).collection(AppString.PENDING).get()
        setListPending(myPending.docs.length > 0 ? [...myPending.docs] : [])
        const myFriends = await myFirestore.collection(AppString.NODE_USERS).doc(currentUserId).collection(AppString.FRIENDS).get()
        setListFriends(myFriends.docs.length > 0 ? [...myFriends.docs] : [])
        const myRequested = await myFirestore.collection(AppString.NODE_USERS).doc(currentUserId).collection(AppString.REQUESTED).get()
        setListRequested(myRequested.docs.length > 0 ? [...myRequested.docs] : [])
        const myReported = await myFirestore.collection(AppString.NODE_USERS).doc(currentUserId).collection(AppString.REPORTED).get()
        setListReported(myReported.docs.length > 0 ? [...myReported.docs] : [])
        setLoading(false)
    }

    const invite = (user) => {
        setLoading(true)
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(currentUserId)
            .collection(AppString.REQUESTED)
            .doc(user.id)
            .set({id: user.id}).then(
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(user.id)
            .collection(AppString.PENDING)
            .doc(currentUserId)
            .set({id: currentUserId})).then(
        getListUser())
        toast.success(`Invited ${user.data().nickname} to your crew`)
    }

    const uninvite = (user) => {
        setLoading(true)
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(currentUserId)
            .collection(AppString.REQUESTED)
            .doc(user.id)
            .delete().then(
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(user.id)
            .collection(AppString.PENDING)
            .doc(currentUserId)
            .delete()).then(
        getListUser())
        setOpenUninviteConfirm(false)
        toast.warn(`Removed your invite of ${user.data().nickname}`)
    }

    const askUninvite = (user) => {
        setReportedUser(user)
        setOpenUninviteConfirm(true)
    }

    const acceptInvite = (user) => {
        setLoading(true)
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(currentUserId)
            .collection(AppString.FRIENDS)
            .doc(user.id)
            .set({id: user.id}).then(
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(user.id)
            .collection(AppString.FRIENDS)
            .doc(currentUserId)
            .set({id: currentUserId})).then(
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(user.id)
            .collection(AppString.REQUESTED)
            .doc(currentUserId)
            .delete()).then(
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(currentUserId)
            .collection(AppString.PENDING)
            .doc(user.id)
            .delete()).then(
        getListUser())
        toast.success(`Added ${user.data().nickname} to your crew`)
    }

    const declineInvite = (user) => {
        setLoading(true)
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(currentUserId)
            .collection(AppString.PENDING)
            .doc(user.id)
            .delete().then(
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(user.id)
            .collection(AppString.REQUESTED)
            .doc(currentUserId)
            .delete()).then(
        getListUser())
        toast.warn(`Declined ${user.data().nickname}'s invitation`)
    }

    const report = (user) => {
        setLoading(true)
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(currentUserId)
            .collection(AppString.REPORTED)
            .doc(user.id)
            .set({id: user.id}).then(
        getListUser())
        setOpenReportConfirm(false)
        toast.warn(`Reported ${user.data().nickname}`)
    }

    const askReport = (user) => {
        setReportedUser(user)
        setOpenReportConfirm(true)
    }

    const unreport = (user) => {
        setLoading(true)
        myFirestore
            .collection(AppString.NODE_USERS)
            .doc(currentUserId)
            .collection(AppString.REPORTED)
            .doc(user.id)
            .delete().then(
        getListUser())
        setOpenUnreportConfirm(false)
        toast.warn(`Remove your report of ${user.data().nickname}`)
    }

    const askUnreport = (user) => {
        setReportedUser(user)
        setOpenUnreportConfirm(true)
    }

    return (
        <div className="root">
            <Header
                history={props.history}
            />

            {/* Body */}
            <div className="bodyCrew">
                <span className="heading">{listPending.length > 0 ? "Pending Crewmates" : ""}</span>
                <UserList className={"viewList"} name={"Pending"} lists={[listPending]} currentUserId={currentUserId} listUser={listUser} listRequested={listRequested} listReported={listReported}
                    declineInvite={declineInvite} acceptInvite={acceptInvite} languages={languages}/>
                <span className="heading">Find Your Crew</span>
                <UserList className={"viewList"} name={"Nonfriends"} lists={[listFriends, listPending]} currentUserId={currentUserId} listUser={listUser} listRequested={listRequested} listReported={listReported}
                    askReport={askReport} askUnreport={askUnreport} invite={invite} askUninvite={askUninvite} languages={languages}/>
            </div>

            {/* Dialog confirm */}
            {isOpenReportConfirm ? (
                <Confirmation
                    text={`Are you sure you want to report ${reportedUser.data().nickname}?`}
                    acceptFunction={() => report(reportedUser)}
                    rejectFunction={() => setOpenReportConfirm(false)}/>
            ) : null}

            {isOpenUnreportConfirm ? (
                <Confirmation
                    text={`Are you sure you want to remove your report of ${reportedUser.data().nickname}?`}
                    acceptFunction={() => unreport(reportedUser)}
                    rejectFunction={() => setOpenUnreportConfirm(false)}/>
            ) : null}

            {isOpenUninviteConfirm ? (
                <Confirmation
                    text={`Are you sure you want to remove your invite of ${reportedUser.data().nickname}?`}
                    acceptFunction={() => uninvite(reportedUser)}
                    rejectFunction={() => setOpenUninviteConfirm(false)}/>
            ) : null}

            {/* Loading */}
            {isLoading ? (
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