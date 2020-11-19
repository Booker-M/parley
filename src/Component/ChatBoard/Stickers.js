import moment from 'moment'
import React, {Component, useState, useEffect} from 'react'
import ReactLoading from 'react-loading'
import 'react-toastify/dist/ReactToastify.css'
import {myFirestore, myStorage} from '../../Config/MyFirebase'
import images from '../Themes/Images'
import './ChatBoard.css'
import {AppString} from './../Const'
import ChatMessage from './Message.js'

function Stickers {
    return (
        <div className="viewStickers">
        <img
            className="imgSticker"
            src={images.partyParrot}
            alt="sticker"
            onClick={() => this.onSendMessage('partyParrot', 2)}
        />
        <img
            className="imgSticker"
            src={images.mimi2}
            alt="sticker"
            onClick={() => this.onSendMessage('mimi2', 2)}
        />
        <img
            className="imgSticker"
            src={images.mimi3}
            alt="sticker"
            onClick={() => this.onSendMessage('mimi3', 2)}
        />
        <img
            className="imgSticker"
            src={images.mimi4}
            alt="sticker"
            onClick={() => this.onSendMessage('mimi4', 2)}
        />
        <img
            className="imgSticker"
            src={images.mimi5}
            alt="sticker"
            onClick={() => this.onSendMessage('mimi5', 2)}
        />
        <img
            className="imgSticker"
            src={images.mimi6}
            alt="sticker"
            onClick={() => this.onSendMessage('mimi6', 2)}
        />
        <img
            className="imgSticker"
            src={images.mimi7}
            alt="sticker"
            onClick={() => this.onSendMessage('mimi7', 2)}
        />
        <img
            className="imgSticker"
            src={images.mimi8}
            alt="sticker"
            onClick={() => this.onSendMessage('mimi8', 2)}
        />
        <img
            className="imgSticker"
            src={images.mimi9}
            alt="sticker"
            onClick={() => this.onSendMessage('mimi9', 2)}
        />
    </div>
    )
}

renderStickers = () => {
    return (
        <div className="viewStickers">
            <img
                className="imgSticker"
                src={images.partyParrot}
                alt="sticker"
                onClick={() => this.onSendMessage('partyParrot', 2)}
            />
            <img
                className="imgSticker"
                src={images.mimi2}
                alt="sticker"
                onClick={() => this.onSendMessage('mimi2', 2)}
            />
            <img
                className="imgSticker"
                src={images.mimi3}
                alt="sticker"
                onClick={() => this.onSendMessage('mimi3', 2)}
            />
            <img
                className="imgSticker"
                src={images.mimi4}
                alt="sticker"
                onClick={() => this.onSendMessage('mimi4', 2)}
            />
            <img
                className="imgSticker"
                src={images.mimi5}
                alt="sticker"
                onClick={() => this.onSendMessage('mimi5', 2)}
            />
            <img
                className="imgSticker"
                src={images.mimi6}
                alt="sticker"
                onClick={() => this.onSendMessage('mimi6', 2)}
            />
            <img
                className="imgSticker"
                src={images.mimi7}
                alt="sticker"
                onClick={() => this.onSendMessage('mimi7', 2)}
            />
            <img
                className="imgSticker"
                src={images.mimi8}
                alt="sticker"
                onClick={() => this.onSendMessage('mimi8', 2)}
            />
            <img
                className="imgSticker"
                src={images.mimi9}
                alt="sticker"
                onClick={() => this.onSendMessage('mimi9', 2)}
            />
        </div>
    )
}