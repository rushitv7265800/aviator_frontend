import React, { useEffect, useState } from 'react'
import { userId } from './config'

export default function BetButtonShow(props) {
    const { time, socket, yData, showGameStep, userData, newStartGame, crashRocket } = props
    const [autoButton, setSutoButton] = useState("bet")
    const [betCoin, setBetCoin] = useState(10)
    const [autoBetSwitch, setAutoBetSwitch] = useState(false)
    const [autoBetCashOut, setAutoBetCashOut] = useState(false)
    const [showWinnerTost, setShowWinnerTost] = useState(false)
    const [betCashOut, setBetCashOut] = useState(10)
    const [betCashOutCrash, setBetCashOutCrash] = useState(1.0)
    const [autoBetCashOutDimond, setAutoBetCashOutDimond] = useState(1.10)
    const [betButton, setBetButton] = useState({
        cancel: false,
        cashOut: false,
        betClick: true
    })


    useEffect(() => {
        if (newStartGame === true && betButton?.cancel === true && time === 0) {
            setBetButton({
                ...betButton,
                cancel: false,
                cashOut: true,
                betClick: false,
            })

        }
    }, [newStartGame, betButton, time])


    useEffect(() => {
        if (crashRocket === true && betButton?.cashOut === true) {
            setBetButton({
                ...betButton,
                cancel: false,
                cashOut: false,
                betClick: true,
            })
        }
    }, [crashRocket, betButton, autoBetSwitch])

    const betIncrement = (type) => {
        if (type === "minus") {
            const decrementValue = parseFloat((betCoin - 10).toFixed(2));
            setBetCoin(decrementValue)
        } else {
            const incrementValue = parseFloat((betCoin + 10).toFixed(2));
            setBetCoin(incrementValue)
        }
    }

    const handleOnBet = () => {
        if (betButton?.betClick === true) {
            setBetButton({
                ...betButton,
                cancel: true,
                cashOut: false,
                betClick: false,
            })
        }
        if (autoBetSwitch === true) {
            if (betButton?.cashOut === true) {
                setBetButton({
                    ...betButton,
                    cancel: true,
                    cashOut: false,
                    betClick: false,
                })
                if (showWinnerTost === false) {
                    setShowWinnerTost(true)
                    setBetCashOut(betCoin)
                    setBetCashOutCrash(yData)
                }
            }
            if (betButton?.cancel === true) {
                setBetButton({
                    ...betButton,
                    cancel: false,
                    cashOut: false,
                    betClick: true,
                })
                setAutoBetSwitch(false)
            }
        } else {
            if (betButton?.cancel === true || betButton?.cashOut === true) {
                setBetButton({
                    ...betButton,
                    cancel: false,
                    cashOut: false,
                    betClick: true,
                })
            }

            if (betButton?.cashOut === true) {
                if (showWinnerTost === false) {
                    setShowWinnerTost(true)
                    setBetCashOut(betCoin)
                    setBetCashOutCrash(yData)
                }
            }
        }

        if (betButton?.cashOut === true) {
            socket &&
                socket.emit("cashOut", {
                    collectPercent: Number(yData),
                    diamond: betCoin,
                    userId: userId
                });
        }

    }
    useEffect(() => {
        if (showGameStep?.showLoader === true && betButton?.cancel === true ) {
            socket &&
                socket.emit("addBet", {
                    diamond: betCoin,
                    userId: userId
                });

        }
    }, [showGameStep?.showLoader, betButton, userId])


    useEffect(() => {
        if (showWinnerTost === true) {
            setTimeout(() => {
                setShowWinnerTost(false)
            }, 2000);
        }
    }, [showWinnerTost])


    useEffect(() => {
        if (autoBetSwitch === true) {
            if (betButton?.betClick === true) {
                setBetButton({
                    ...betButton,
                    cancel: true,
                    cashOut: false,
                    betClick: false,
                })
            }
        }

    }, [autoBetSwitch])

    const hadnleOnAutoBet = () => {
        if (betButton?.cashOut === false) {
            setAutoBetSwitch(!autoBetSwitch)
            if (autoBetSwitch === true) {
                setBetButton({
                    ...betButton,
                    cancel: false,
                    cashOut: false,
                    betClick: true,
                })
            }
        }
    }
    const handleBetIncrement = (coin) => {
        setBetCoin(parseFloat((betCoin + coin).toFixed(2)))
    }

    return (
        <>
            <div className='betButtonShow'>
                <div className='showButton' style={{ border: `${betButton?.cancel === true ? "1px solid #cb011a" : betButton?.cashOut === true ? "1px solid #d07206" : ""}`, padding: `${autoButton === "auto" ? "26px 14px 0px 26px" : "26px 14px"}` }}>
                    <div className='showBetButtonBet'>
                        <div className='betTopButton'>
                            <button onClick={() => setSutoButton("bet")} className={`${autoButton === "bet" ? "activeBet" : ""}`}>Bet</button>
                            <button onClick={() => setSutoButton("auto")} className={`${autoButton === "auto" ? "activeBet" : ""}`}>Auto</button>
                        </div>
                    </div>
                    <div className='buttonAutoNumber row'>
                        <div className='col-6 p-0 autoBetDetails'>
                            <div className='autoButton'>
                                <i class="fa-solid fa-circle-minus" onClick={() => betIncrement("minus")}></i>
                                <span>{parseFloat(betCoin)}</span>
                                <i class="fa-solid fa-circle-plus" onClick={() => betIncrement("plus")}></i>
                            </div>
                            <div className='showNumber'>
                                <span onClick={(() => handleBetIncrement(50))}>50</span>
                                <span onClick={(() => handleBetIncrement(100))}>100</span>
                                <span onClick={(() => handleBetIncrement(500))}>500</span>
                                <span onClick={(() => handleBetIncrement(1000))}>1000</span>
                            </div>
                        </div>
                        <div className='col-6 p-0 betButton'>
                            {
                                betButton?.cancel === true ?
                                    <>
                                        <div style={{ display: "flex", flexDirection: `${time > -9 && time < 0 ? "unset" : "column"}`, alignItems: "center", width: "100%" }}>
                                            <span style={{ marginBottom: "6px", display: `${time > -9 && time < 0 ? "none" : "block"}` }}> Waiting for next round </span>
                                            <div className={`betMainButton ${betButton?.cancel === true ? "waitBet" : betButton?.cashOut === true ? "showBet" : ""}`} onClick={() => handleOnBet()}>
                                                <h5 style={{ margin: `${time > -9 && time < 0 ? "17px 0px" : "10px 0px"}` }}>CANCEL</h5>
                                            </div>
                                        </div>
                                    </>
                                    : betButton?.cashOut === true ?
                                        <div className={`betMainButton ${betButton?.cancel === true ? "waitBet" : betButton?.cashOut === true ? "showBet" : ""}`} onClick={() => handleOnBet()}>
                                            <h6 style={{ marginBottom: " 10px 0px" }}>CASH OUT</h6>
                                            <h5 > {(yData * betCashOut)?.toFixed(2)} Dimond </h5>
                                        </div>
                                        : <div className={`betMainButton ${betButton?.cancel === true ? "waitBet" : betButton?.cashOut === true ? "showBet" : ""}`} onClick={() => handleOnBet()}>
                                            <h6>BET</h6>
                                            <h5>{parseFloat(betCoin)} Dimond </h5>
                                        </div>
                            }
                        </div>
                    </div>

                    {
                        autoButton === "auto" &&
                        <div className='autoBetContent'>
                            <div className='autoSwitch'>
                                <div class="auto-betSwitch" style={{ opacity: `${betButton?.cashOut === true ? "0.6" : "1"}` }}>
                                    <label translate="" class="ng-star-inserted">Auto Bet</label>
                                    <div class="ng-untouched ng-pristine ng-valid ng-star-inserted" onClick={() => hadnleOnAutoBet()}>
                                        <div class={`input-switch off switch ${autoBetSwitch == false ? "offSwitch" : "onSwitch"}`} >
                                            <span class="oval"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='showAutoCashOut'>
                                <div class="auto-betSwitch">
                                    <label translate="" class="ng-star-inserted">Auto Cash Out</label>
                                    <div class="ng-untouched ng-pristine ng-valid ng-star-inserted" onClick={() => setAutoBetCashOut(!autoBetCashOut)}>
                                        <div class={`input-switch off switch ${autoBetCashOut === false ? "offSwitch" : "onSwitch"}`} >
                                            <span class="oval"></span>
                                        </div>
                                    </div>
                                    <div className='inputAutoCashOut'>
                                        <input value={autoBetCashOutDimond} type='text' onChange={(e) => setAutoBetCashOutDimond(e.target.value)} disabled={autoBetCashOut === true ? false : true} style={{ color: `${autoBetCashOut === true ? "#9ea0a3" : "white"}` }} />
                                        < i class="fa-solid fa-xmark"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>

            </div >
            {
                showWinnerTost && (
                    <div className='showWinnerTost'>
                        <div className='showLeftContent'>
                            <h6>You have crashed out!</h6>
                            <h5>{betCashOutCrash}</h5>
                        </div>
                        <div className='showRightContent '>
                            <div className='showImg'>
                                <h6>Win Dimond</h6>
                                <h5>{(betCashOutCrash * betCashOut)?.toFixed(2)}</h5>
                            </div>
                        </div>
                        < i class="fa-solid fa-xmark" onClick={() => setShowWinnerTost(false)}></i>
                    </div>
                )
            }
        </>
    )
}
