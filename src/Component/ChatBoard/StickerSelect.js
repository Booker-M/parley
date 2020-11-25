import React from 'react'
import 'react-toastify/dist/ReactToastify.css'
import images from '../Themes/Images'
import Sticker from './Sticker'
import './ChatBoard.css'

function StickerSelect(props) {
    return (
            <div className="viewStickers">
                <Sticker
                    image = {images.partyParrot}
                    imageString = {'partyParrot'}
                    onSendMessage = {props.onSendMessage}
                />
                <Sticker
                    image = {images.dealWithItParrot}
                    imageString = {'dealWithItParrot'}
                    onSendMessage = {props.onSendMessage}
                />
                <Sticker
                    image = {images.sadParrot}
                    imageString = {'sadParrot'}
                    onSendMessage = {props.onSendMessage}
                />
                <Sticker
                    image = {images.sleepingParrot}
                    imageString = {'sleepingParrot'}
                    onSendMessage = {props.onSendMessage}
                />
                <Sticker
                    image = {images.thumbsUpParrot}
                    imageString = {'thumbsUpParrot'}
                    onSendMessage = {props.onSendMessage}
                />
                <Sticker
                    image = {images.spinningParrot}
                    imageString = {'spinningParrot'}
                    onSendMessage = {props.onSendMessage}
                />
                <Sticker
                    image = {images.angryParrot}
                    imageString = {'angryParrot'}
                    onSendMessage = {props.onSendMessage}
                />
                <Sticker
                    image = {images.confusedParrot}
                    imageString = {'confusedParrot'}
                    onSendMessage = {props.onSendMessage}
                />
                <Sticker
                    image = {images.jumpingParrot}
                    imageString = {'jumpingParrot'}
                    onSendMessage = {props.onSendMessage}
                />
            </div>
        )
    }

    export default(StickerSelect);