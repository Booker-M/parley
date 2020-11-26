import React from 'react'

export default function UserList(props) {
    console.log(props.languages)

    let ids = []
    props.lists.forEach(list => {
        list.forEach((item, index) => {
            ids.push(item.id)
        })
    })

    let requestedIds = []
    props.listRequested.forEach((item, index) => {
        requestedIds.push(item.id)
    })

    let reportedIds = []
    props.listReported.forEach((item, index) => {
        reportedIds.push(item.id)
    })

    let filteredList = props.name === "Nonfriends" ? props.listUser.filter(item => !ids.includes(item.id)) : props.listUser.filter(item => ids.includes(item.id))
    if (filteredList.length > 0) {
        let viewListUser = []
        filteredList.forEach((item, index) => {
            if (item.data().id !== props.currentUserId) {
                viewListUser.push(
                    <div
                        key={index}
                        className={'viewWrapItemCrew'}
                    >
                        <img
                            className="viewAvatarItemCrew"
                            src={item.data().photoUrl}
                            alt="icon avatar"
                        />
                        <div className="viewWrapContentItem">
                            <span className="textHeaderCrew">{`${
                                item.data().nickname
                            } | ${props.languages.filter(lang => lang.code === item.data().myLanguage)[0].name}`}</span>
                            <span className="textItemCrew">{item.data().aboutMe ? item.data().aboutMe : 'Not available'
                            }</span>
                        </div>
                        <button className="btnCrewNo" onClick={() => props.name  === "Nonfriends" ? 
                            (reportedIds.includes(item.id) ? () => {} : props.askReport(item)) : props.declineInvite(item)}>
                        {props.name === "Nonfriends" ? 
                            (reportedIds.includes(item.id) ? "Reported" : "Report") : "Decline"}</button>
                        <button className="btnCrewYes" onClick={() => props.name  === "Nonfriends" ? 
                            (requestedIds.includes(item.id) ? () => {} : props.sendInvite(item)) : props.acceptInvite(item)}>
                        {props.name === "Nonfriends" ? 
                            (requestedIds.includes(item.id) ? "Pending" : "Invite") : "Accept Crew Invite"}</button>
                    </div>
                )
            }
        })
        return viewListUser
    } else {
        return null
    }
}