import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

//Axios.defaults.withCredentials: true;

class Signin extends Component {
   
    constructor(props){
        super(props)
    }

    state = {
        email: '',
        password: '',
        error: ''
    }

    submitForm = (e) => {
        e.preventDefault();

        if (this.state.email === '' || this.state.password === '') {
            this.setState({error: 'Please fill in all fields!'});
            setTimeout(() => this.setState({error: ''}), 3000);
        } else {
            // Post user to server
            const packet ={
                email: this.state.email,
                password: this.state.password
            }
            axios.post('/login', packet)
            .then(res => {
                let status = res.data.msg;
                if(status == 'user not found') {
                    this.setState({error: status});
                }
                if(status == 'password incorrect') {
                    this.setState({error: status});
                }
                if(res.data.loggedIn == true) {
                    
                    localStorage.setItem('SignedInStatus', true)
                    this.props.props.history.push('/dashBoard/home')
                }
            }).catch(err => console.log(err));

            this.setState({email: '', password: ''})
        } 
    }

    inputHandler = (e) => this.setState({[e.target.name]: e.target.value})
    
    render() {

        return (
            <div className="wrapper">
                <h1 style={{color: 'white'}}>Signin</h1>
                <p id="error">{this.state.error}</p>
                <form onSubmit={this.submitForm} className="form">

                    <label>Email</label><br></br>
                    <input 
                        name="email"
                        type="email"
                        value={this.state.email}
                        onChange={this.inputHandler}
                        ></input><br></br>

                    <label>Password</label><br></br>
                    <input 
                        name="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.inputHandler}
                        ></input><br></br>

                       <button type="submit">SignIn</button>
                </form><br></br>
                <Link to="/signup"> <button>sign Up</button> </Link>
            </div>
        );
    }
}

export default Signin;