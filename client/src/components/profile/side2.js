import { React, Component} from 'react'
import './profile.css'
import {FaAlignCenter, FaUserFriends} from 'react-icons/fa'
import Infos from './side2/infos'
import Friends from './side2/friends'

class Side2 extends Component{
    state = {
        infos: true
    }

    infos = () => { this.setState(() => ({infos: true})) }
    friends = () => { this.setState(() => ({infos: false})) }

    render() {
        return (
            <div className="side2">
                <div className="side2menu">
                    <li onClick={this.infos} className={this.state.infos? "active": null}><FaAlignCenter /><p>Infos</p></li>
                    <li onClick={this.friends} className={this.state.infos? null: "active"}><FaUserFriends /><p>Friends</p></li>
                </div>
                {this.state.infos ? <Infos /> :  <Friends />}
            </div>
        )
    }
}

export default Side2