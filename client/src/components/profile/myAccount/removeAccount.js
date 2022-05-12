import React, { Component } from 'react'
import '../profile.css'
import http from '../../http/axios.config'

class RemoveAccount extends Component {
    constructor(props){
        super(props)
        this.state = {
            password: '',
            error: ''
        }
    }

   remove = (e) => {
        e.preventDefault()
        http.post('/api/remove-user-account/', {password: this.state.password})
        .then(res => {
            if(res.data.msg === 'account removed'){
            this.setState({error: res.data.msg})
                setTimeout(() => {
                    this.setState({error: ''})
                    this.props.logout()
                }, 3000)
            }
            this.setState({error: res.data.msg})
            setTimeout(() => {
                this.setState({error: ''})
       	    }, 3000)
        }).catch(err => console.log(err))
    }

   onChange = (e) => { this.setState({password: e.target.value}) }

    render() {
        return (
            <div className="removeWrap">
                <h3>Remove Account</h3>
                <div className="warn">
                <p>{this.state.error}</p>
                <h4>warning</h4>
                    <p>Removing this account process is going to erase all of your data completely and you will not be able to access your account nor registring using this email address again, Make sure you are fully aware of this process before proceding forward.</p>
                </div>
                <form onSubmit={this.remove}>
                    <div className="flexit">
                        <input type="password" onChange={this.onChange} value={this.state.password} placeholder="Enter Your Password" />
                    </div>
                    <button type="submit" id="securityBtn">remove</button>
                </form>
            </div>
        )
    }
}

export default RemoveAccount