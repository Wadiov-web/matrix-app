import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import http from '../http/axios.config'

class ForgotPassword extends Component {
    constructor(props){
        super(props)
    	this.state = {
        	email: '',
        	error: '',
		success: ''
	    }
    }
   
    submitForm = (e) => {
        e.preventDefault();
        const packet = {email: this.state.email}
        http.post('/forgot-password', packet)
        .then(res => {
            if(res.data.msg == 'reset email is sent') {
                this.setState({success: res.data.msg})
                setTimeout(() => this.props.props.history.push('/reset-forgot-pass'), 3000)
            } else {
                this.setState({error: res.data.msg})
                setTimeout(() => this.setState({error: ''}), 3000)
            }
        }).catch(err => console.log(err));
        this.setState({email: '', password: ''})
    }

    inputHandler = (e) => this.setState({[e.target.name]: e.target.value})
    
    render() {
        return (
            <div className="wrapper">
                <h1 style={{color: 'white'}}>Forgot Password</h1>
                <p id="error">{this.state.error}</p>
		        <p>{this.state.success}</p>
                <form onSubmit={this.submitForm} className="form">
                    <label>Email</label><br></br>
                    <input 
                        name="email"
                        type="email"
                        value={this.state.email}
                        onChange={this.inputHandler}
                    ></input><br></br>
                    <button type="submit">submit email</button>
                </form><br></br>
                <Link to="/signin"> <button>sign in</button> </Link>
            </div>
        )
    }
}

export default ForgotPassword;
