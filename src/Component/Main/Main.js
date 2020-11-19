import React, {useState, useEffect} from 'react'
import ReactLoading from 'react-loading'
import {withRouter} from 'react-router-dom'
import {myFirestore} from '../../Config/MyFirebase'
import WelcomeBoard from '../WelcomeBoard/WelcomeBoard'
import './Main.css'
import { useHistory } from "react-router-dom";
import ChatBoard from './../ChatBoard/ChatBoard'
import {AppString} from './../Const'
import Header from './../Header/Header'


function Main(props) {
    const [isLoading, setLoading] = useState('true');
    const [currentPeerUser, setCurrentPeerUser] = useState(null)
    const [listUser, setListUser] = useState([])
    const [listFriends, setListFriends] = useState([])
    const history = useHistory();
    
    const currentUserId = localStorage.getItem(AppString.ID);
    const currentUserAvatar = localStorage.getItem(AppString.PHOTO_URL)
    const currentUserNickname = localStorage.getItem(AppString.NICKNAME)

    useEffect(() => {
        checkLogin();
    }, []);

    const checkLogin = () => {
        if (!localStorage.getItem(AppString.ID)) {
            setLoading(false)
            history.push('/')

        } else {
            getListUser()
        }
    }

    const getListUser = async () => {
        const allUsers = await myFirestore.collection(AppString.NODE_USERS).get()
        setListUser(allUsers.docs.length > 0 ? [...allUsers.docs] : [])
        const myFriends = await myFirestore.collection(AppString.NODE_USERS).doc(currentUserId).collection(AppString.FRIENDS).get()
        setListFriends(myFriends.docs.length > 0 ? [...myFriends.docs] : [])
        setLoading(false)
    }

    const renderListUser = () => {
        let ids = []
        listFriends.forEach((item, index) => {
            ids.push(item.id)
        })
        let filteredList = listUser.filter(item => ids.includes(item.id))
        if (filteredList.length > 0) {
            let viewListUser = []
            filteredList.forEach((item, index) => {
                if (item.data().id !== currentUserId) {
                    viewListUser.push(
                        <button
                            key={index}
                            className={
                                currentPeerUser &&
                                currentPeerUser.id === item.data().id
                                    ? 'viewWrapItemFocused'
                                    : 'viewWrapItem'
                            }
                            onClick={() => {
                                setCurrentPeerUser(item.data());
                            }}
                        >
                            <img
                                className="viewAvatarItem"
                                src={item.data().photoUrl}
                                alt="icon avatar"
                            />
                            <div className="viewWrapContentItem">
                                <span className="textItem">{`${
                                    item.data().nickname
                                }`}</span>
                            </div>
                        </button>
                    )
                }
            })
            return viewListUser
        } else {
            return null
        }
    }

    return (
        <div className="root">
            <Header
                history={props.history}
            />

            {/* Body */}
            <div className="body">
                <div className="viewListUser"> {renderListUser()}</div>
                <div className="viewBoard">
                    {currentPeerUser ? (
                        <ChatBoard
                            currentPeerUser={currentPeerUser}
                        />
                    ) : (
                        <WelcomeBoard
                            currentUserNickname={currentUserNickname}
                            currentUserAvatar={currentUserAvatar}
                        />
                    )}
                </div>
            </div>

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
    
export default withRouter(Main)
