import React, { Component } from 'react'

class Nav extends Component {
    render(){
        return (
            <div className="nav">
                <ul>
                    <li>home</li>
                    <li>notification</li>
                    <li>profile</li>
                    <li>about</li>
                </ul>
            </div>
        )
    }
}

export default Nav