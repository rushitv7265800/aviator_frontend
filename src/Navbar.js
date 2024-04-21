import React from 'react'
import Logo from './assets/Image/logoAvitor.svg'
import Avtar from './assets/Image/Avtar.png'

export default function Navbar(props) {
    return (
        <div className='navbar'>
            <div className='row w-100'>
                <div className='col-6 col-md-4 logoShow'>
                    <img src={Logo} />
                    <div className='howToPlay'>
                        <i class="fa-regular fa-circle-question"></i>
                        <h6>How To Play?</h6>
                    </div>
                </div>
                <div className='col-6 col-md-8 showProfile'>
                    <div className='showProfileBalance'>
                        <div className='balance'>
                            <h6>{props.userData?.diamond ? props.userData?.diamond : "0"} <span>DIMOND</span></h6>
                        </div>                                                      
                        <div className='profileShow'>
                            <div className='imgShow'>
                                <img src={props.userData?.image ? props.userData?.image : Avtar} />
                                <h6>{props.userData?.name ? props.userData?.name : "Player56"}</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
