import React, {Component} from 'react'
import ReactLoading from 'react-loading'
import {withRouter} from 'react-router-dom'
import {myFirestore} from '../../Config/MyFirebase'
import WelcomeBoard from '../WelcomeBoard/WelcomeBoard'
import './Main.css'
import ChatBoard from './../ChatBoard/ChatBoard'
import {AppString} from './../Const'
import Header from './../Header/Header'

class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            currentPeerUser: null,
            listUser: [],
            listFriends: []
        }
        this.currentUserId = localStorage.getItem(AppString.ID)
        this.currentUserAvatar = localStorage.getItem(AppString.PHOTO_URL)
        this.currentUserNickname = localStorage.getItem(AppString.NICKNAME)
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
        const myFriends = await myFirestore.collection(AppString.NODE_USERS).doc(this.currentUserId).collection(AppString.FRIENDS).get()
        this.state.listFriends = myFriends.docs.length > 0 ? [...myFriends.docs] : []
        this.setState({isLoading: false})
    }

    renderListUser = () => {
        let ids = []
        this.state.listFriends.forEach((item, index) => {
            ids.push(item.id)
        })
        let filteredList = this.state.listUser.filter(item => ids.includes(item.id))
        if (filteredList.length > 0) {
            let viewListUser = []
            filteredList.forEach((item, index) => {
                if (item.data().id !== this.currentUserId) {
                    viewListUser.push(
                        <button
                            key={index}
                            className={
                                this.state.currentPeerUser &&
                                this.state.currentPeerUser.id === item.data().id
                                    ? 'viewWrapItemFocused'
                                    : 'viewWrapItem'
                            }
                            onClick={() => {
                                this.setState({currentPeerUser: item.data()})
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

    render() {
        return (
            <div className="root">
                <Header
                    showToast={this.props.showToast}
                    history={this.props.history}
                />

                {/* Body */}
                <div className="body">
                    <div className="viewListUser"> {this.renderListUser()}</div>
                    <div className="viewBoard">
                        {this.state.currentPeerUser ? (
                            <ChatBoard
                                currentPeerUser={this.state.currentPeerUser}
                            />
                        ) : (
                            <WelcomeBoard
                                currentUserNickname={this.currentUserNickname}
                                currentUserAvatar={this.currentUserAvatar}
                            />
                        )}
                    </div>
                </div>

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

export default withRouter(Main)
