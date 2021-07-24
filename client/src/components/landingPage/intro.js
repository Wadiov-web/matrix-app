import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './intro.css'

class Intro extends Component {
    
    render(){
        return (
     
            <div className="container">
                <div id="content">
                    <h1>Welcome to Meet Up App where you</h1>
                    <h1>can meet new people from</h1>
                    <h1>all over the world</h1>
                    <div id="flex"> 
                        <div id="btn1">
                            <Link to="/signup"><button>Get Started!</button></Link>    
                        </div> 
                        <div id="btn2">
                            <Link to="/signin"><button>Signin</button></Link>
                        </div> 
                    </div>
                </div>

                <div id="about">
                    <h1>About Us</h1>
                    <p>Hello from the out side Instead, it will copy all the configuration files and
                        the transitive dependencies (webpack, Babel, ESLint, etc) right into your
                        project so you have full control over them. All of the commands except
                        will still work, but they will point to the copied scripts so you can
                        tweak them. At this point you’re on your own project 
                        so you have full control over them. All of the commands except
                        will still work, but they will point to the copied.</p>
                        <div id="btn3">
                            <button>Learn More</button>
                        </div>
                        
                </div>
            </div>
        )
    }
}

export default Intro;