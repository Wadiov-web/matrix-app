import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import './signup.css';


class Signup extends Component{
    
    constructor(props){
        super(props)
        this.state = {
            image: '',
            birthday: '',
            gender: '',
            username: '',
            email: '',
            password: '',
            error: ''
        }
    }
    
    

    submitForm = (e) => {
        e.preventDefault();
    
        let fd = new FormData()
        console.log(this.state)


        this.setState({username: '', email: '', password: ''});
    }

    inputHandler = (e) => this.setState({[e.target.name]: e.target.value});
    selectFile = (e) => this.setState( {image: e.target.files[0]} )

       

    render(){
       
        return (
            <div className="wrapper">
                <h1 style={{color: 'white'}}>Signup right now!</h1>
                <p id="error">{this.state.error}</p>
                <form onSubmit={this.submitForm} className="form">

                    <label>image</label><br></br>
                    <input 
                        name="username"
                        type="file"
                        value={this.state.image}
                        onChange={this.selectFile}
                    ></input><br></br>

                    <label>birthday</label><br></br>
                    <input 
                        name="username"
                        type="text"
                        value={this.state.birthday}
                        onChange={this.inputHandler}
                    ></input><br></br>

                    <label>gender</label><br></br>
                    <input 
                        name="username"
                        type="text"
                        value={this.state.gender}
                        onChange={this.inputHandler}
                    ></input><br></br>


                    <label>Username</label><br></br>
                    <input 
                        name="username"
                        type="text"
                        value={this.state.username}
                        onChange={this.inputHandler}
                    ></input><br></br>

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

                    <button type="submit">SignUp</button>
                </form> <br></br>
                <Link to="/signin"><button>sign In</button></Link>
            </div>
        );
    }
}



export default Signup;