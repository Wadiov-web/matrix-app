import React, { Component } from 'react'
import '../profile.css'
import {FaEllipsisV } from 'react-icons/fa'
import axios from 'axios'

import SetInfos from './setInfos'
import Security from './security'
import RemoveAccount from './removeAccount'



class MyAccount extends Component {

    state = {
        setInfos: true,
        security: false,
        removeAcc: false
    }

    setInfos = () => { 
        this.setState((prevState) => (
            {setInfos: true, security: false, removeAcc: false}
        ))
    }
    
    security = () => { this.setState(() => ({security: true, setInfos: false, removeAcc: false})) }
    removeAcc = () => { this.setState(() => ({removeAcc: true, setInfos: false, security: false})) }


    render() {
        console.log('wadiov render')
        return (
            <div className="myAccount">
                <button onClick={this.props.goBack} id="backBtn">back</button>
                <div className="setMenu">
                    <li onClick={this.setInfos}><p className={this.state.setInfos ? "active": null}>Infos Setting</p></li>
                    <li onClick={this.security}><p className={this.state.security ? "active": null}>Security</p></li>
                    <li onClick={this.removeAcc}><p className={this.state.removeAcc ? "active": null}>Remove Account</p></li>
                </div>
              
                {(() => {
                    if(this.state.setInfos){
                        return (<SetInfos />)
                    }
                    if(this.state.security){
                        return (<Security />)
                    }
                    if(this.state.removeAcc){
                        return (<RemoveAccount />)
                    }

                })()}
            </div>
        )
    }
}

export default MyAccount