import React, { Component } from 'react';
import './notify.css';
import http from '../http/axios.config'
import URL from '../http/URL'

class Notification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            invits: [],
            notifs: []
        }
    }
    
    getInvitations = () => {
        http.get('/api/get-invitations')
        .then(res => {
            if(res.status === 200) {
                this.setState(() => ({invits: res.data}))
            }
        })
    }

    getNotifications = () => {
        http.get('/api/get-notifications')
        .then(res => {
            if(res.status === 200) {
                this.setState(() => ({notifs: res.data}))
            }
        })
    }
    
    componentDidMount() {
        this.getInvitations()
        this.getNotifications()
    }

    confirm = (invit) => {
        http.post('/api/confirm-invitations', {invitUsername: invit.username, from: invit.from})
        .then(res => {
            this.setState(() => ({invits: res.data.invitations, notifs: res.data.notifications}))
        }).catch(err => console.log(err))
    }
    
    render(){
        return (
            <div className="container">
                <h1 className="title">My Notifications</h1>
                <div>
                    {this.state.invits.reverse().map(invit => {
                        return (
                            <div key={Math.random()} className="invitation">
                                <img src={`${URL}/uploads/${invit.image}`} id="image" />
                                <div id="info">
                                    <p id="invitName">{invit.username}</p>
                                    <p>sends invitation request</p>
                                    <p>{invit.date}</p>
                                </div>
                                <div className="btns">
                                    <button onClick={this.confirm.bind(this, invit)}>confirm</button>
                                    <button onClick={()=> {
                                        http.post('/api/deny-invitations', {invitUsername: invit.username, from: invit.from})
                                        .then(res => {
                                            this.setState(()=>({invits: res.data.invitations, notifs: res.data.notifications}))
                                        }).catch(err => console.log(err))
                                    }} id="deny">deny</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <div>
                    {this.state.notifs.length > 0 ? this.state.notifs.reverse().map(notif => {
                        return (
                        <div key={Math.random()} className="invitation">
                            <div id="info">
                                <p id="invitName">{notif.username}</p>
                                <p>{notif.msg}</p>
                                <p>{notif.date}</p>
                            </div>
                        </div>
                        )
                    }): null}
                </div>
            </div>
        )
    }
}

export default Notification
