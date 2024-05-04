import logo from './logo.svg';
import './assets/scss/styles.scss'
import './App.css';
import './assets/scss/responsive.scss';
import GameChart from './GameChart';
import Navbar from './Navbar';
import BetShow from './BetShow';
import BetButtonShow from './BetButtonShow';
import "react-toastify/dist/ReactToastify.css";
import BetHistory from './BetHistory';
import { baseURL, userId } from './config';
import { useEffect, useRef, useState } from 'react';
import io from "socket.io-client";
import AviationChart from './AviationChart';
import { ToastContainer } from 'react-toastify';

function GamePage(props) {
  const{
    userData,
    setSoundOnSwicth,
    soundOnSwicth,
    socket,
    runningY,
    setRunningY,
    time,
    setShowMenu,
    showMenu,
  }=props

  return (
    <>
        {/* <Navbar userData={userData} socket={socket} setShowMenu={setShowMenu} showMenu={showMenu} runningY={runningY} soundOnSwicth={soundOnSwicth} setSoundOnSwicth={setSoundOnSwicth}/> */}
        <div className='row'>
          <div className='col-0 col-md-4  betShow deskView'>
            <BetShow time={time} socket={socket}  runningY={runningY} />
          </div>
          <div className='col-12 col-md-8 gameBox'>
            <div className='game'>
              <BetHistory socket={socket} userData={userData}/>
              <GameChart socket={socket} userData={userData} setRunningY={setRunningY} soundOnSwicth={soundOnSwicth} />
            </div>
          </div>
          {/* <div className='col-12 betShow mobiView'>
            <BetShow time={time} />
          </div> */}
        </div>
    </>
  );
}

export default GamePage;
