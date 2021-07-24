import React, { Component } from 'react';
import './notify.css';
import axios from 'axios';
import Img from './wadiov.jpeg';


class Notification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            invits: [],
            notifs: []
        }
    }
    
    getInvitations = () => {
        axios.get('/api/get-invitations')
        .then(res => {
            console.log(res)
            if(res.status == 204) {
                console.log('no invits')
            }
            if(res.status == 200) {
                console.log('invits')

                this.setState(() => (
                    {invits: res.data}
                ))
            }
        })
    }

    getNotifications = () => {
        axios.get('/api/get-notifications')
        .then(res => {
            if(res.status == 204) {
                console.log('no notifs')
                console.log(res)
            }
            if(res.status == 200) {
                console.log('notifs')
                console.log(res)
                this.setState(() => (
                    {notifs: res.data}
                ))
            }
        })
    }
    
    componentDidMount() {
        this.getInvitations()
        this.getNotifications()
        console.log('CDM Notification')
    }
 
    confirm = (invit) => {
        console.log('confirm clicked')
        console.log(invit.username)
        axios.post('/api/confirm-invitations', {invitUsername: invit.username, from: invit.from})
        .then(res => {
            console.log(res)
            this.setState(()=>(
                {invits: res.data.invitations, notifs: res.data.notifications}
            ))
        }).catch(err => console.log(err))
    }
    
    render(){
        return (

            <div className="container">
                <h1 className="title">My Notifications</h1>
                <div>
                    {this.state.invits.reverse().map(invit => {
                        return (
                            <div className="invitation">
                                <img src={Img} id="image" alt=""></img>
                                <div id="info">
                                    <p id="invitName">{invit.username}</p>
                                    <p>sends invitation request</p>
                                    <p>{invit.date}</p>
                                </div>
                                <div className="btns">
                                    <button onClick={this.confirm.bind(this, invit)}>confirm</button>


                                    <button onClick={()=> {
                                        console.log('deny is clicked')
                                        
                                        axios.post('/api/deny-invitations', {invitUsername: invit.username, from: invit.from})
                                        .then(res => {
                                            console.log(res)
                                            this.setState(()=>(
                                                {invits: res.data.invitations, notifs: res.data.notifications}
                                            ))
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
                            <div className="invitation">
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