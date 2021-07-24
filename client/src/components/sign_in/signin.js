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

        // Post user to server
        const packet = {
            email: this.state.email,
            password: this.state.password
        }
        axios.post('/signin', packet)
        .then(res => {
            
            this.setState({error: res.data.msg})
            setTimeout(() => this.setState({error: ''}), 3000)

            if(res.data.loggedIn) {
                localStorage.setItem('SignedInStatus', true)
                this.props.props.history.push('/dashBoard/home')
            }
        }).catch(err => console.log(err));

        this.setState({email: '', password: ''})
    
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