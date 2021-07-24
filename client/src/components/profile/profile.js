import React, { Component } from 'react'
import './profile.css'
import {FaEllipsisV, FaUserCog, FaSignOutAlt } from 'react-icons/fa'
import axios from 'axios'

import Side1 from './side1'
import Side2 from './side2'
import MyAccount from './myAccount/myAccount'

class Profile extends Component {

    state = {
        more: false,
        myAccount: false
    }

    more = () => { this.setState(() => ({more: !this.state.more})) }

    myAccount = () => { this.setState(() => ({myAccount: true, more: false})) }
    goBack = () => { this.setState(() => ({myAccount: false})) }
   
    logout = () => {
        axios.post('/logout')
        .then(res => {
            if (res.status == 200) {
                localStorage.setItem('SignedInStatus', false)
                this.props.props.history.push('/signin');
            } else {
                console.log('Server could not log out user')
            }
        })
    }


    render() {
        console.log('profile page renders')
        return (
            <div className="profileDiv">
                <div className="tab0">
                    <img />
                    <h1>Tommy Storan</h1>
                    <div className="status0">
                        <button className="statusInfo0" onClick={this.more}>
                            <p>more</p>
                            <FaEllipsisV className="icon"/>
                        </button>
                    </div>
                    {this.state.more ?
                    <div className="menu">
                        <li onClick={this.myAccount}><FaUserCog className="icon" /><p>My account</p></li>        
                        <li onClick={this.logout}><FaSignOutAlt /><p>Log out</p></li>
                    </div> : null}
                </div>

                <div className="sidesContainer">
                    {this.state.myAccount ? <MyAccount goBack={this.goBack} /> :
                    <React.Fragment>
                        <Side1 />
                        <Side2 />
                    </React.Fragment>
                    }
                </div>

            </div>
        )
    }
}

export default Profile