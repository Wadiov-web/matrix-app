import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import http from '../http/axios.config'

class ResetPassword extends Component {
    constructor(props){
        super(props)
    	this.state = {
        	code: '',
            password: '',
            confirmPass: '',
        	error: '',
            success: false
        }
    }
    
    submitForm = (e) => {
        e.preventDefault();
        const packet = {password: this.state.password, confirmPass: this.state.confirmPass}
        http.post(`/reset-forgot-password/${this.state.code}`, packet)
        .then(res => {
            if(res.data.msg == 'password is reset successfully') {
                this.setState({success: true})
            } else {
                this.setState({error: res.data.msg})
                setTimeout(() => this.setState({error: ''}), 3000)
                this.setState({code: '',confirmPass: '', password: ''})
            }
        }).catch(err => console.log(err));
    }

    inputHandler = (e) => this.setState({[e.target.name]: e.target.value})
    
    render() {
        return (
            <div className="wrapper">
                {!this.state.success ? <div>
                    <h1 style={{color: 'white'}}>Reset Password</h1>
                    <p id="error">{this.state.error}</p>
                    <form onSubmit={this.submitForm} className="form">
                        <label>Code</label><br></br>
                        <input 
                            name="code"
                            type="text"
                            value={this.state.code}
                            onChange={this.inputHandler}
                        /><br></br>
                        <input 
                            name="password"
                            type="password"
                            placeholder="New password"
                            value={this.state.password}
                            onChange={this.inputHandler}
                        /><br></br>
                        <input 
                            name="confirmPass"
                            type="password"
                            placeholder="Confirm password"
                            value={this.state.confirmPass}
                            onChange={this.inputHandler}
                        /><br></br>
                        <button type="submit">reset password</button>
                    </form><br></br>
                </div>: 
                <div>
                    <h1>Password is reset successfully</h1>
                    <Link to="/signin"> <button>sign in</button> </Link>
                </div>}
            </div>
        )
    }
}

export default ResetPassword