import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import GamePage from "./GamePage";
import './assets/scss/styles.scss'
import './assets/scss/responsive.scss';
import "react-toastify/dist/ReactToastify.css";
import io from "socket.io-client";
import DepositFundPage from "./Game/DepositFundPage";
import { baseURL, userId } from "./config";

export default function Admin() {
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        if (location.pathName === "/admin") {
            navigate("/game/crashGame");
        }
    }, []);
    const socketRef = useRef(null);
    const [userData, setUserData] = useState()
    const [showMenu, setShowMenu] = useState(false)
    const [runningY, setRunningY] = useState(0)
    const [soundOnSwicth, setSoundOnSwicth] = useState(true)

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

                <Navbar userData={userData} socket={socketRef.current} setShowMenu={setShowMenu} showMenu={showMenu} runningY={runningY} soundOnSwicth={soundOnSwicth} setSoundOnSwicth={setSoundOnSwicth} />
                <GamePage socket={socketRef.current} userData={userData} setShowMenu={setShowMenu} setRunningY={setRunningY} showMenu={showMenu} runningY={runningY} soundOnSwicth={soundOnSwicth} setSoundOnSwicth={setSoundOnSwicth} />
                {/* <Routes>
                    <Route path='/' element={<GamePage socket={socketRef.current} userData={userData} setShowMenu={setShowMenu} setRunningY={setRunningY} showMenu={showMenu} runningY={runningY} soundOnSwicth={soundOnSwicth} setSoundOnSwicth={setSoundOnSwicth} />} />
                    <Route path='/crashGame' element={<GamePage socket={socketRef.current} userData={userData} setShowMenu={setShowMenu} setRunningY={setRunningY} showMenu={showMenu} runningY={runningY} soundOnSwicth={soundOnSwicth} setSoundOnSwicth={setSoundOnSwicth} />} />
                    <Route path='/deposit' element={<DepositFundPage socket={socketRef.current} />} />
                </Routes> */}
            </div>
        </>
    )
}