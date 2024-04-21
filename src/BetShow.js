import React, { useEffect, useState } from 'react'
import { BetDummyData } from './BetDummyData'
import { userId } from './config'

export default function BetShow(props) {
    const [showBet, setShowBet] = useState("allBet")
    const [allBetData, setAllBetData] = useState([])
    const [totalBet, setTotalBet] = useState(0)
    const [allMyData, setMyBetData] = useState([])
    const { time, socket, userData } = props

    useEffect(() => {
        socket &&
            socket.on("getAllBet", (getAllBet) => {
                console.log("getAllBet", getAllBet)
                setAllBetData(getAllBet)
            });
        socket &&
            socket.on("getMyBet", (getMyBet) => {
                console.log("getMyBet  ", getMyBet)
                setMyBetData(getMyBet)
            });
    }, [socket])

    useEffect(() => {
        if (showBet === "myBet") {
            socket &&
                socket.emit("getMyBet", {
                    userId: userId
                });
        }
    }, [showBet, userId])

    useEffect(() => {
        const totalBet = allBetData?.reduce((sum, item) => sum + item?.Bet, 0);
        setTotalBet(totalBet)
    }, [allBetData])

    const dateFormet = (date) => {
        if (date) {
            var date = new Date(date);


            var hours = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();
            var formattedTime = hours.toString().padStart(2, '0') + ":" + minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');

            return formattedTime
        }
    }

    return (
        <div className='betBoxShow'>
            <div className='betTableShow'>
                <div className='betTopButton'>
                    <button onClick={() => setShowBet("allBet")} className={`${showBet === "allBet" ? "activeBet" : ""}`}>All Bets</button>
                    <button onClick={() => setShowBet("myBet")} className={`${showBet === "myBet" ? "activeBet" : ""}`}>My Bets</button>
                </div>
                {
                    showBet === "myBet" ?
                        <div className='betBodyShow'>
                            <div className='showTable'>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Bet Dimond</th>
                                            <th>X</th>
                                            <th>Cash out Dimond</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allMyData?.map((item) => {
                                                return (
                                                    <tr className={`${item?.history === true ? "cashoutUsd" : ""}`}>
                                                        <td><span>{dateFormet(item?.date)}</span></td>
                                                        <td><span>{item?.Bet}</span></td>
                                                        <td> {item?.history === true && <span className='betxShow' style={{ color: `${item?.xPercent < 2.0 ? "rgb(52, 180, 255)" : item?.xPercent < 10.0 ? "rgb(145, 62, 248)" : item?.xPercent > 10.0 ? "rgb(192, 23, 180)" : ""}` }}>{item?.xPercent + "x"}</span>}</td>
                                                        <td>{item?.history === true && <span>{item?.win}</span>}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div> : <div className='betBodyShow'>
                            <div className='allBetDetails' style={{ position: "relative" }}>
                                <h6>All Bets</h6>
                                <h5>{totalBet}</h5>
                                <span style={{ color: "white", right: "10%", top: "4px", position: "absolute" }}>{time}</span>
                            </div>
                            <div className='showTable'>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>User</th>
                                            <th>Dimond</th>
                                            <th>X</th>
                                            <th>Cash out Dimond</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allBetData?.map((item) => {
                                                return (
                                                    <tr className={`${item?.history === true ? "cashoutUsd" : ""}`}>
                                                        <td><div className='userBet'><img src={item?.image} /><h6>{item?.name}</h6></div></td>
                                                        <td><span>{item?.Bet}</span></td>
                                                        <td> {item?.history === true && <span className='betxShow' style={{ color: `${item?.xPercent < 2.0 ? "rgb(52, 180, 255)" : item?.xPercent < 10.0 ? "rgb(145, 62, 248)" : item?.xPercent > 10.0 ? "rgb(192, 23, 180)" : ""}` }}>{item?.xPercent + "x"}</span>}</td>
                                                        <td>{item?.history === true && <span>{item?.win}</span>}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                }
            </div>
        </div>
    )
}
