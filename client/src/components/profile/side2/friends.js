import { React, Component} from 'react'
import '../profile.css'
import {FaUserAltSlash} from 'react-icons/fa'


class Friends extends Component{

    state = {
        friends: ['Tommy Storan', 'Martin Garrix', 'Damon Salvatore']
    }

  
    unfollow = (user) => {
        // unfollow user
        console.log('from unfollow')
        console.log(user)
        if(window.confirm(`Are you sure you want to unfollow ${user}`)){
            console.log('user deleted')
        }
    }

    render() {
       
        return (
            <div className="friends">

                <h1 className="frTitle">My friends</h1>
                <div className="fiendWrap">

                    {this.state.friends.length > 0 ? 
                    this.state.friends.map(user => {
                        return(
                            <div className="friendTab">
                                <img src=""/>
                                <p>{user}</p>
                                <FaUserAltSlash id="iconDel" onClick={() => {this.unfollow(user)}} />
                            </div>
                        )
                    })
                
                    :
                    <h3>No friends</h3>}
                </div>
                
            </div>
               
        )
    }
}

export default Friends