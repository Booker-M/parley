import React from 'react'
import ChatMessage from './Message'
import images from '../Themes/Images'
import moment from 'moment'
import './ListOfMessages.css'

export default function ListOfMessages(props) {

    const getGifImage = value => {
        switch (value) {
            case 'partyParrot':
                return images.partyParrot
            case 'dealWithItParrot':
                return images.dealWithItParrot
            case 'sadParrot':
                return images.sadParrot
            case 'sleepingParrot':
                return images.sleepingParrot
            case 'thumbsUpParrot':
                return images.thumbsUpParrot
            case 'spinningParrot':
                return images.spinningParrot
            case 'angryParrot':
                return images.angryParrot
            case 'confusedParrot':
                return images.confusedParrot
            case 'jumpingParrot':
                return images.jumpingParrot
            default:
                return null
        }
    }

    function isLastMessageLeft(index) {
        if (
            (index + 1 < props.listMessage.length &&
                props.listMessage[index + 1].idFrom === props.currentUserId) ||
            index === props.listMessage.length - 1
        ) {
            return true
        } else {
            return false
        }
    }


    if (props.listMessage.length > 0) {
        let viewListMessage = []
        props.listMessage.forEach((item, index) => {
            if (item.idFrom === props.currentUserId) {
                // Item right (my message)
                if (item.type === 0) {
                    viewListMessage.push(
                        <ChatMessage key={item.timestamp} fromCurrentUser={true} timestamp={item.timestamp} content={item.content} />
                    )
                } else if (item.type === 1) {
                    viewListMessage.push(
                        <div className="viewItemRight2" key={item.timestamp}>
                            <img
                                className="imgItemRight"
                                src={item.content}
                                alt="content message"
                            />
                        </div>
                    )
                } else {
                    viewListMessage.push(
                        <div className="viewItemRight3" key={item.timestamp}>
                            <img
                                className="imgItemRight"
                                src={getGifImage(item.content)}
                                alt="content message"
                            />
                        </div>
                    )
                }
            } else {
                // Item left (peer message)
                if (item.type === 0) {
                    viewListMessage.push(
                        <ChatMessage key={item.timestamp} fromCurrentUser={false} timestamp={item.timestamp} content={item.content} isLastMessageLeft={isLastMessageLeft(index)} profilePicUrl={ props.currentPeerUser.photoUrl }/>
                    )
                } else if (item.type === 1) {
                    viewListMessage.push(
                        <div className="viewWrapItemLeft2" key={item.timestamp}>
                            <div className="viewWrapItemLeft3">
                                {isLastMessageLeft(index) ? (
                                    <img
                                        src={props.currentPeerUser.photoUrl}
                                        alt="avatar"
                                        className="peerAvatarLeft"
                                    />
                                ) : (
                                    <div className="viewPaddingLeft"/>
                                )}
                                <div className="viewItemLeft2">
                                    <img
                                        className="imgItemLeft"
                                        src={item.content}
                                        alt="content message"
                                    />
                                </div>
                            </div>
                            {isLastMessageLeft(index) ? (<span className="textTimeLeft">
                                                                {moment(Number(item.timestamp)).format('ll')}
                                                            </span>
                                                            ) : null}
                            </div>)
                } else {
                    viewListMessage.push(
                        <div className="viewWrapItemLeft2" key={item.timestamp}>
                            <div className="viewWrapItemLeft3">
                                {isLastMessageLeft(index) ? (
                                    <img
                                        src={props.currentPeerUser.photoUrl}
                                        alt="avatar"
                                        className="peerAvatarLeft"
                                    />
                                ) : (
                                    <div className="viewPaddingLeft"/>
                                )}
                                <div className="viewItemLeft3" key={item.timestamp}>
                                    <img
                                        className="imgItemLeft"
                                        src={getGifImage(item.content)}
                                        alt="content message"
                                    />
                                </div>
                            </div>
                            {isLastMessageLeft(index) ? (
                                <span className="textTimeLeft">
                {moment(Number(item.timestamp)).format('ll')}
              </span>
                            ) : null}
                        </div>
                    )
                }
            }
        })
        return viewListMessage
    } else {
        return (
            <div className="viewWrapSayHi">
                <span className="textSayHi">Say ahoy to your new crewmate</span>
                <img
                    className="imgWaveHand"
                    src={images.ic_wave_hand}
                    alt="wave hand"
                />
            </div>
        )
    }
}