import React, { Component } from 'react'
import '../profile.css'

import axios from 'axios'




class RemoveAccount extends Component {

    state = {
        password: '',
        error: ''
    }

   remove = (e) => {
        e.preventDefault()
        axios.post('/api/remove-user-account/', {password: this.state.password})
        .then(res => {

            console.log(res.data)
            this.setState({error: res.data.msg})
            setTimeout(() => this.setState({error: ''}), 3000)

        }).catch(err => console.log(err))

            // this.setState({password: ''})
   
            // this.setState({error: 'Please type password'});
            // setTimeout(() => this.setState({error: ''}), 3000);
        
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
                    <div class="flexit">
                        <input type="password" onChange={this.onChange} value={this.state.password} placeholder="Enter Your Password" />
                    </div>
                    <button type="submit" id="securityBtn">remove</button>
                </form>
            </div>
        )
    }
}

export default RemoveAccount