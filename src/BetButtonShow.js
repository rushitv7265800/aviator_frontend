import React, { useEffect, useState } from 'react'
import { userId } from './config'
import { ToastConent } from './ToastConent'

export default function BetButtonShow(props) {
    const getAutoButton = JSON.parse(localStorage.getItem("autoButton"))
    const { time, socket, yData, showGameStep, userData, newStartGame, crashRocket, setAutoBetCashOutDimond, autoBetCashOutDimond } = props
    const [autoButton, setAutoButton] = useState(getAutoButton ? getAutoButton : "bet")
    const [betCoin, setBetCoin] = useState(10)
    const [autoBetSwitch, setAutoBetSwitch] = useState(false)
    const [autoBetCashOut, setAutoBetCashOut] = useState(false)
    const [showWinnerTost, setShowWinnerTost] = useState(false)
    const [checkBalance, setCheckBalance] = useState(true)
    const [winner, setWinner] = useState(false)
    const [betCashOut, setBetCashOut] = useState(10)
    const [betCashOutCrash, setBetCashOutCrash] = useState(1.0)
    const [betButton, setBetButton] = useState({
        cancel: false,
        cashOut: false,
        betClick: true
    })

    useEffect(() => {
        socket &&
            socket.on("aviatorUser", (aviatorUser) => {
                setAutoBetSwitch(aviatorUser?.AutoCollect)
                setAutoBetSwitch(aviatorUser?.AutoBet)
                setAutoBetCashOut(aviatorUser?.AutoCashOut)
                setAutoBetCashOutDimond(aviatorUser?.AutoCashOutCoin)
            });
        socket &&
            socket.on("refreshAddBet", (refreshAddBet) => {
                const refreshAddBetCheck = refreshAddBet?.map((item) => {
                    setBetCoin(item?.Bet)
                    setBetCashOut(item?.Bet)
                    if (item?.history === false) {
                        if (newStartGame === true) {
                            console.log("betButton=====", betButton)
                            setBetButton({
                                ...betButton,
                                cancel: false,
                                cashOut: true,
                                betClick: false,
                            })
                        }
                        console.log("betButton=====", betButton)
                    } else {
                        console.log("betButton=====", betButton)
                        setBetButton({
                            ...betButton,
                            cancel: true,
                            cashOut: false,
                            betClick: false,
                        })
                    }
                    console.log("betButton=====", betButton)

                })
            });
        socket &&
            socket.on("coinLess", (coinLess) => {
                if (coinLess) {
                    setCheckBalance(false)
                    setBetButton({
                        ...betButton,
                        cancel: false,
                        cashOut: false,
                        betClick: true,
                    })
                    setAutoBetCashOut(false)
                    setAutoBetSwitch(false)
                }
            });
    }, [socket, newStartGame])

    useEffect(() => {
        if (userData?.diamond <= 10) {
            setAutoBetCashOut(false)
            setCheckBalance(false)
            setAutoBetSwitch(false)
            setBetButton({
                ...betButton,
                cancel: false,
                cashOut: false,
                betClick: true,
            })
        } else {
            setCheckBalance(true)
        }
    }, [userData])

    useEffect(() => {
        localStorage.setItem("autoButton", JSON.stringify(autoButton))
    }, [autoButton])
    useEffect(() => {
        if (time === -10) {
            setWinner((false))
        }
    }, [time])


    useEffect(() => {
        if (autoBetSwitch === true && time < 0) {
            setBetButton({
                ...betButton,
                cancel: true,
                cashOut: false,
                betClick: false,
            })
        }
    }, [autoBetSwitch, time])

    useEffect(() => {
        if (newStartGame === true && betButton?.cancel === true && checkBalance && (autoBetCashOut ? winner === false ? true : false : time === 0)) {
            setBetButton({
                ...betButton,
                cancel: false,
                cashOut: true,
                betClick: false,
            })
        }
    }, [newStartGame, betButton, autoBetCashOut, winner, checkBalance])

    useEffect(() => {
        if (Number(yData) === autoBetCashOutDimond && autoBetCashOut === true && checkBalance === true) {

            setShowWinnerTost(true)
            setBetCashOut(betCoin)
            setBetCashOutCrash(yData)
            setWinner(true)
            socket &&
                socket.emit("cashOut", {
                    collectPercent: Number(yData),
                    diamond: betCoin,
                    userId: userId
                });
            setBetButton({
                ...betButton,
                cancel: true,
                cashOut: false,
                betClick: false,
            })

        }
    }, [yData, autoBetCashOutDimond, autoBetCashOut, betCoin, userId, checkBalance])

    useEffect(() => {
        if (crashRocket === true && betButton?.cashOut === true && autoBetCashOut === false) {
            setBetButton({
                ...betButton,
                cancel: false,
                cashOut: false,
                betClick: true,
            })
        }
    }, [crashRocket, betButton, autoBetSwitch, autoBetCashOut])


    useEffect(() => {
        if (showGameStep?.showLoader === true && betButton?.cancel === true) {
            socket &&
                socket.emit("addBet", {
                    diamond: betCoin,
                    userId: userId
                });
        }
    }, [showGameStep?.showLoader, betButton, userId, checkBalance])


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

    const betIncrement = (type) => {
        if (betButton.betClick === true) {
            if (type === "minus") {
                if (betCoin >= 11) {
                    const decrementValue = parseFloat((betCoin - 10).toFixed(2));
                    setBetCoin(decrementValue)
                }
            } else {
                if (betCoin <= 7999) {
                    const incrementValue = parseFloat((betCoin + 10).toFixed(2));
                    setBetCoin(incrementValue)
                }
            }
        }
    }

    const handleOnBet = () => {
        if (time >= -4 && time <= -1) {

        } else {
            if (betButton?.betClick === true) {
                setBetButton({
                    ...betButton,
                    cancel: true,
                    cashOut: false,
                    betClick: false,
                })
            }

            if (betButton?.cancel === true && time > -9 && time < 0) {
                socket.emit("cancelBet", {
                    diamond: betCoin,
                    userId: userId
                });
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

    }

    const hadnleOnAutoBet = () => {
        if (time >= 1 || time <= -4) {
            if (autoBetSwitch === true) {
                setAutoBetSwitch(false)
                socket &&
                    socket.emit("autoCashOut", {
                        AutoCashOut: autoBetCashOut,
                        AutoBet: false,
                        AutoCashOutCoin: autoBetCashOutDimond,
                        userId: userId
                    });
            } else {
                setAutoBetSwitch(true)
                socket &&
                    socket.emit("autoCashOut", {
                        AutoCashOut: autoBetCashOut,
                        AutoBet: true,
                        AutoCashOutCoin: autoBetCashOutDimond,
                        userId: userId
                    });
            }
            if (betButton?.cashOut === false) {
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
    }
    const handleAutoCashOut = (e) => {
        socket &&
            socket.emit("autoCashOut", {
                AutoBet: autoBetSwitch,
                AutoCashOut: autoBetCashOut,
                AutoCashOutCoin: e.target.value,
                userId: userId
            });
        setAutoBetCashOutDimond(e.target.value)
    }

    const handleBetIncrement = (coin) => {
        if (betButton?.betClick === true) {
            if (betCoin >= 10 && betCoin <= 7999) {
                let value = parseFloat((betCoin + coin).toFixed(2))
                value = value < 10 ? 10 : value > 8000 ? 8000 : value;
                setBetCoin(value)
            }
        }
    }

    const handleAutoCashOutSwitch = () => {
        if (time >= 1 || time <= -4) {
            if (autoBetCashOut === true) {
                setAutoBetCashOut(false)
                socket &&
                    socket.emit("autoCashOut", {
                        AutoCashOut: false,
                        AutoBet: autoBetSwitch,
                        AutoCashOutCoin: autoBetCashOutDimond,
                        userId: userId
                    });
            } else {
                setAutoBetCashOut(true)
                socket &&
                    socket.emit("autoCashOut", {
                        AutoCashOut: true,
                        AutoBet: autoBetSwitch,
                        AutoCashOutCoin: autoBetCashOutDimond,
                        userId: userId
                    });
            }
        } else {

        }
    }

    const hadnleBetButton = (type) => {
        if (type === "bet") {
            setAutoButton("bet")
        } else {
            setAutoButton("auto")
        }
        if (autoBetCashOut || autoBetSwitch && type === "bet") {
            setAutoButton("auto")
            ToastConent("Switch Off !")
        }
    }

    return (
        <>
            <div className='betButtonShow'>
                <div className='showButton' style={{ opacity: `${time >= -4 && time <= -1 ? "0.6" : "1"}`, border: `${betButton?.cancel === true ? "1px solid #cb011a" : betButton?.cashOut === true ? "1px solid #d07206" : ""}`, padding: `${autoButton === "auto" ? "10px 14px 0px 10px" : "20px 14px"}` }}>
                    <div className='showBetButtonBet'>
                        <div className='betTopButton'>
                            <button onClick={() => hadnleBetButton("bet")} className={`${autoButton === "bet" ? "activeBet" : ""}`}>Bet</button>
                            <button onClick={() => hadnleBetButton("auto")} className={`${autoButton === "auto" ? "activeBet" : ""}`}>Auto</button>
                        </div>
                    </div>
                    <div className='buttonAutoNumber row'>
                        <div className='col-6 p-0 autoBetDetails'>
                            <div className='autoButton' style={{ opacity: `${betButton.betClick === true ? "1" : "0.6"}` }}>
                                <i class="fa-solid fa-circle-minus" onClick={() => betIncrement("minus")}></i>
                                <span>{parseFloat(betCoin)}</span>
                                <i class="fa-solid fa-circle-plus" onClick={() => betIncrement("plus")}></i>
                            </div>
                            <div className='showNumber'>
                                <span onClick={(() => handleBetIncrement(50))} style={{ opacity: `${betButton.betClick === true ? "1" : "0.6"}` }}>50</span>
                                <span onClick={(() => handleBetIncrement(100))} style={{ opacity: `${betButton.betClick === true ? "1" : "0.6"}` }}>100</span>
                                <span onClick={(() => handleBetIncrement(500))} style={{ opacity: `${betButton.betClick === true ? "1" : "0.6"}` }}>500</span>
                                <span onClick={(() => handleBetIncrement(1000))} style={{ opacity: `${betButton.betClick === true ? "1" : "0.6"}` }}>1000</span>
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
                                            <h5 > {(yData * betCashOut)?.toFixed(2)} INR </h5>
                                        </div>
                                        : <div className={`betMainButton ${betButton?.cancel === true ? "waitBet" : betButton?.cashOut === true ? "showBet" : ""}`} onClick={() => handleOnBet()} >
                                            <h6>BET</h6>
                                            <h5>{parseFloat(betCoin)} INR </h5>
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
                                    <div class="ng-untouched ng-pristine ng-valid ng-star-inserted" onClick={() => handleAutoCashOutSwitch()}>
                                        <div class={`input-switch off switch ${autoBetCashOut === false ? "offSwitch" : "onSwitch"}`} >
                                            <span class="oval"></span>
                                        </div>
                                    </div>
                                    <div className='inputAutoCashOut'>
                                        <input value={autoBetCashOutDimond} type='text' onChange={(e) => handleAutoCashOut(e)} disabled={autoBetCashOut === true ? false : true} style={{ color: `${autoBetCashOut === true ? "#9ea0a3" : "white"}` }} />
                                        < i class="fa-solid fa-xmark" onClick={() => setAutoBetCashOutDimond(1.1)}></i>
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
                                <h6>Win INR</h6>
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
