import React, { Component } from 'react'
import '../profile.css'
import http from '../../http/axios.config'

class Security extends Component {
    state = {
        currentPass: '', 
        newPass: '', 
        newPassConf: '',
        error: ''
    }

    onChange = (e) => { this.setState(() => ( {[e.target.name]: e.target.value} )) }

    changePass = (e) => {
        e.preventDefault()
        http.post('/api/update-password', this.state)
        .then(res => {
            this.setState({error: res.data.msg})
            setTimeout(() => this.setState({error: ''}), 3000)
            this.setState({currentPass: '', newPass: '', newPassConf: ''})
        }).catch(err => console.log(err))
    }
         
    render() {
        return (
            <div>
                <form onSubmit={this.changePass}>
                    <div className="accountInf">
                        <h3>Change Password</h3>
                        <p>{this.state.error}</p>
                        <div className="flexit">
                            <input name="currentPass" value={this.state.currentPass} onChange={this.onChange} type="password" placeholder="Current Password" />
                        </div>
                        <div className="flexit">
                            <input name="newPass" value={this.state.newPass} onChange={this.onChange} type="password" placeholder="New Password" />
                        </div>
                        <div className="flexit">
                            <input name="newPassConf" value={this.state.newPassConf} onChange={this.onChange} type="password" placeholder="Confirm New Password" />
                        </div>
                        <div className="flexit">
                            <button type="submit" id="securityBtn">submit</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default Security