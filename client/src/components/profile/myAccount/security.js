import React, { Component } from 'react'
import '../profile.css'
import {FaEllipsisV, FaLock, FaKey } from 'react-icons/fa'
import axios from 'axios'




class Security extends Component {

    state = {
       
    }

    
    render() {

        return (
            <div>
                <div className="accountInf">
                    <h3>Change Password</h3>
                    <div class="flexit">
                        <input type="password" placeholder="Current Password" />
                    </div>
                    <div class="flexit">
                        <input type="password" placeholder="New Password" />
                    </div>
                    <div class="flexit">
                        <input type="password" placeholder="Confirm New Password" />
                    </div>
                    <div class="flexit">
                        <button id="securityBtn">submit</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Security