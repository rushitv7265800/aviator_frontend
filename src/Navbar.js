import React, { useEffect, useState } from 'react'
import Logo from './assets/Image/logoAvitor.svg'
import Avtar from './assets/Image/dummyImg/av-1.png'
import AllBetModel from './Model/AllBetModel';
import MyBetModel from './Model/MyBetModel';
import { userId } from './config';
import GameLimitModel from './Model/GameLimitModel';

export default function Navbar(props) {
    const { socket,runningY } = props;
    const [allBetModel, setAllBetModel] = useState(false)
    const [myBetModel, setMyBetModel] = useState(false)
    const [gameLimitModel, setGameLimitModel] = useState(false)


    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (props.showMenu && !event.target.closest(".navbar")) {
                props.setShowMenu(false);
            }
        };
        if (props.showMenu) {
            document.addEventListener("click", handleOutsideClick);
        }
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [props.showMenu, props.setShowMenu]);

    const handleModelOpen = (type) => {
        console.log("type", type)
        if (type === "allBet") {
            setAllBetModel(true)
        } else if (type === "myBet") {
            socket &&
                socket.emit("getMyBet", {
                    userId: userId
                });
            setMyBetModel(true)
        } else if (type === "gameLimit") {
            setGameLimitModel(true)
        }
    }

    return (
        <>
            <div className='navbar'>
                <div className='row w-100'>
                    <div className='col-6  p-0 col-md-4 logoShow'>
                        <img src={Logo} />
                        <div className='howToPlay'>
                            <i class="fa-regular fa-circle-question"></i>
                            <h6>How To Play?</h6>
                        </div>
                    </div>
                    <div className='col-6 p-0 col-md-8 showProfile'>
                        <div className='showProfileBalance'>
                            <div className='balance'>
                                <h6>{props.userData?.diamond ? props.userData?.diamond : "0"} <span>USD</span></h6>
                            </div>
                            {/* <div className='profileShow'>
                            <div className='imgShow'>
                                <img src={props.userData?.image ? props.userData?.image : Avtar} />
                                <h6>{props.userData?.name ? props.userData?.name : "Player56"}</h6>
                            </div>
                        </div> */}
                            <button className="showMenu" onClick={() => props.setShowMenu(!props.showMenu)} ><i class="fa-solid fa-bars"></i></button>
                        </div>
                    </div>
                </div>
                {
                    props.showMenu && (
                        <div className="showMenuContent">
                            <div className="showMenuBody">
                                <div className='profileContent'>
                                    <div className='imgShow'>
                                        <img src={props.userData?.image ? props.userData?.image : Avtar} />
                                        <h6>{props.userData?.name ? props.userData?.name : "Mark User"}</h6>
                                    </div>
                                </div>
                                <div className='showMenuButton'>
                                    <div className='showMenuBox'>
                                        <div className='showIcon'>
                                            <i class="fa-solid fa-volume-high"></i>
                                            <h5>Sound</h5>
                                        </div>
                                        <div class="ng-untouched ng-pristine ng-valid ng-star-inserted" onClick={() => props.setSoundOnSwicth(!props.soundOnSwicth)}>
                                            <div class={`input-switch off switch ${props.soundOnSwicth === false ? "offSwitch" : "onSwitch"}`} >
                                                <span class="oval"></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='showMenuBox' onClick={() => handleModelOpen("allBet")}>
                                        <div className='showIcon'>
                                            <i class="fa-solid fa-scroll"></i>
                                            <h5>All Bets</h5>
                                        </div>
                                    </div>
                                    <div className='showMenuBox' onClick={() => handleModelOpen("myBet")}>
                                        <div className='showIcon'>
                                            <i class="fa-solid fa-clock-rotate-left"></i>   
                                            <h5>My Bets</h5>
                                        </div>
                                    </div>
                                    <div className='showMenuBox' onClick={() => handleModelOpen("gameRule")}>
                                        <div className='showIcon'>
                                            <i class="fa-solid fa-gamepad"></i>
                                            <h5>Game Rules</h5>
                                        </div>
                                    </div>
                                    <div className='showMenuBox' onClick={() => handleModelOpen("gameLimit")}>
                                        <div className='showIcon'>
                                            <i class="fa-solid fa-money-bill"></i>
                                            <h5>Game Limit</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
            <AllBetModel open={allBetModel} setOpen={setAllBetModel} socket={socket} runningY={runningY}/>
            <MyBetModel open={myBetModel} setOpen={setMyBetModel} socket={socket} />
            <GameLimitModel open={gameLimitModel} setOpen={setGameLimitModel} socket={socket} />
        </>
    )
}
