import React, { Component } from 'react'
import './profile.css'
import {FaEllipsisV, FaUserCog, FaSignOutAlt } from 'react-icons/fa'
import axios from 'axios'

import Side1 from './side1'
import Side2 from './side2'
import MyAccount from './myAccount/myAccount'

class Profile extends Component {

    state = {
        more: false,
        myAccount: false,
        username: '',
        image: '',
        menu: false,
        viewImage: false,
        updateImage: false,
        error: '',
        imageInput: ''
    }

    componentDidMount() {
        axios.get('/api/get-profile-bar')
        .then(res => {
            this.setState({username: res.data.username, image: res.data.imageName})
        }).catch(err => console.log(err))
    }

    more = () => { this.setState(() => ({more: !this.state.more})) }

    myAccount = () => { this.setState(() => ({myAccount: true, more: false})) }
    goBack = () => { this.setState(() => ({myAccount: false})) }
   
    logout = () => {
        axios.post('/logout')
        .then(res => {
            if (res.status == 200) {
                localStorage.setItem('SignedInStatus', false)
                this.props.myprop.history.push('/signin')
            } else {
                console.log(`Server could'nt log user out`)
            }
        }).catch(err => console.log(err))
    }

    openMenu = () => { this.setState(() => ( {menu: true} ))}
    closeMenu = () => { this.setState(() => ( {menu: false} ))}
    viewImage = () => { this.setState(() => ( {viewImage: true} ))}
    updateImage = () => { this.setState(() => ( {updateImage: true} ))}
    closeVI = () => { this.setState(() => ( {viewImage: false} ))}
    closeUI = () => { this.setState(() => ( {updateImage: false} ))}

    selectFile = (e) => { this.setState( {imageInput: e.target.files[0]} )}

    submitImage = (e) => { 
        e.preventDefault()
        let fd = new FormData()
        fd.append('image', this.state.imageInput)

        axios.post('/api/update-image', fd)
        .then(res => {
            
            this.setState({error: res.data.msg})
            setTimeout(() => this.setState({error: ''}), 3000)
        }).catch(err => console.log(err))
    }


    render() {
        return (
            <div className="profileDiv">
                <div className="tab0">
                    <img src={`/uploads/${this.state.image}`} onClick={this.openMenu} />
                    {this.state.menu ?
                    <div id="imageMenu">
                        <div onClick={this.viewImage}><p>view image</p></div>
                        <div onClick={this.updateImage}><p>update image</p></div>
                        <div onClick={this.closeMenu}><p>close</p></div>
                    </div> : null}
                    
                    <h1>{this.state.username}</h1>
                    <div className="status0">
                        <button className="statusInfo0" onClick={this.more}>
                            <p>more</p>
                            <FaEllipsisV className="icon"/>
                        </button>
                    </div>
                    {this.state.more ?
                    <div className="menu">
                        <li onClick={this.myAccount}><FaUserCog className="icon" /><p>My account</p></li>        
                        <li onClick={this.logout}><FaSignOutAlt /><p>Log out</p></li>
                    </div> : null}
                </div>

                <div className="sidesContainer">
                    {this.state.myAccount ? <MyAccount goBack={this.goBack} /> :
                    <React.Fragment>
                        <Side1 />
                        <Side2 />
                    </React.Fragment>
                    }
                </div>

                {this.state.viewImage ?
                <div className="viewModal">
                    <div onClick={this.closeVI}>X</div>
                    <h1>view Image</h1>
                    <img src={`/uploads/${this.state.image}`} />
                </div> : null}
                {this.state.updateImage ?
                <div className="updateModal">
                    <div onClick={this.closeUI}>X</div>
                    

                    <div className="updateDiv">
                        <h1>update Image</h1>
                        <p>{this.state.error}</p>
                        <form onSubmit={this.submitImage}>
                            <label>get new image</label>
                            <input type="file" onChange={this.selectFile} />
                            <button type="submit">submit</button>
                        </form>
                    </div>
                </div> : null}

            </div>
        )
    }
}

export default Profile