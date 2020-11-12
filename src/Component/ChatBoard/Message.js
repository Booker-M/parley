import moment from 'moment'
import React, {Component} from 'react'
import 'react-toastify/dist/ReactToastify.css'
import './ChatBoard.css'
import {AppString} from './../Const'
import {translateText} from '../../Config/MyTranslate.js'

export default class ChatMessage extends Component {
    constructor(props) {
      super(props);
      this.state = {
        translation: "",
        showTranslation: false,
      }
      this.myLanguage = localStorage.getItem(AppString.MY_LANGUAGE)
      this.handleClick = this.handleClick.bind(this)
    }
  
    async handleClick() {
      const translation = await translateText(this.props.content, this.myLanguage)
      this.setState({translation: translation, showTranslation: !this.state.showTranslation})
    }
  
    render() {
        if (this.props.fromCurrentUser) {
            return (<>
                <div className="viewItemRight" key={this.props.timestamp} onClick={this.handleClick}>
                    <span className="textContentItem">{this.state.showTranslation ? this.state.translation : this.props.content}</span>
                </div>
            </>)
        } else {
            return (<>
                <div className="viewWrapItemLeft" key={this.props.timestamp}>
                    <div className="viewWrapItemLeft3">
                        {this.props.isLastMessageLeft ? (
                            <img
                                src={this.props.profilePicUrl}
                                alt="avatar"
                                className="peerAvatarLeft"
                            />
                        ) : (
                            <div className="viewPaddingLeft"/>
                        )}
                        <div className="viewItemLeft" onClick={this.handleClick}>
                            <span className="textContentItem">{this.state.showTranslation ? this.state.translation : this.props.content}</span>
                        </div>
                    </div>
                    {this.props.isLastMessageLeft ? (
                        <span className="textTimeLeft">
                        {moment(Number(this.props.timestamp)).format('ll')}
                        </span>
                        ) : null}
                </div>
            </>)
        }
    }
  }