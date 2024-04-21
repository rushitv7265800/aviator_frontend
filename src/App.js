import logo from './logo.svg';
import './assets/scss/styles.scss'
import './App.css';
import './assets/scss/responsive.scss';
import GameChart from './GameChart';
import Navbar from './Navbar';
import BetShow from './BetShow';
import BetButtonShow from './BetButtonShow';
import BetHistory from './BetHistory';
import { baseURL, userId } from './config';
import { useEffect, useRef, useState } from 'react';
import io from "socket.io-client";
import AviationChart from './AviationChart';

function App() {
  const socketRef = useRef(null);
  const [userData, setUserData] = useState()
  const [time, setTime] = useState()

  useEffect(() => {
    if (userId) {
      const socket = io.connect(baseURL, {
        transports: ["websocket", "polling", "flashsocket"],
        query: { globalRoom: userId },
      });
      socketRef.current = socket;
      socketRef.current.on("connect", () => {
        if (socket.connected === true) {
          setTimeout(() => {
            socket.emit("startGame", {});
            socket.on("start", (data) => {
              console.log("data", data);
              setUserData(data);
            });
            socket.on("time", (time) => {
              setTime(time)
            });
          }, 1000);
        }
      });
      return () => {
        socketRef.current.disconnect();
      };
    }
  }, [userId]);

  return (
    <>
      <div className="gameShow">
        <Navbar userData={userData} />
        <div className='row'>
          <div className='col-0 col-md-4  betShow deskView'>
            <BetShow time={time} socket={socketRef.current} />
          </div>
          <div className='col-12 col-md-8 gameBox'>
            <div className='game'>
              <BetHistory socket={socketRef.current} userData={userData} />
              <GameChart socket={socketRef.current} userData={userData} />
            </div>
          </div>
          <div className='col-12 betShow mobiView'>
            <BetShow time={time} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
