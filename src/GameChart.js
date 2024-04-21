import React, { useEffect, useRef, useState } from "react";
import airplaneImage1 from "./assets/Image/plane-0.svg";
import airplaneImage2 from "./assets/Image/plane-1.svg";
import airplaneImage3 from "./assets/Image/plane-2.svg";
import airplaneImage4 from "./assets/Image/plane-3.svg";
import GameLoader from './assets/Image/LoaderGame.svg'
import GameBg from './assets/Image/bg-rotate-old.svg'
import VideoBg from "./assets/Image/chartBg.mp4";
import $ from "jquery";
import { gameChartData, repeatUpDown } from "./gameChartData";
import BetButtonShow from "./BetButtonShow";

const airplaneImages = [
  airplaneImage1,
  airplaneImage1,
  airplaneImage1,
  airplaneImage1,
  airplaneImage1,
  airplaneImage1,
  airplaneImage1,
  airplaneImage1,
  airplaneImage2,
  airplaneImage2,
  airplaneImage2,
  airplaneImage2,
  airplaneImage2,
  airplaneImage2,
  airplaneImage2,
  airplaneImage2,
  airplaneImage3,
  airplaneImage3,
  airplaneImage3,
  airplaneImage3,
  airplaneImage3,
  airplaneImage3,
  airplaneImage3,
  airplaneImage3,
  airplaneImage4,
  airplaneImage4,
  airplaneImage4,
  airplaneImage4,
  airplaneImage4,
  airplaneImage4,
  airplaneImage4,
  airplaneImage4,
];

const checkLastIndex = repeatUpDown[repeatUpDown?.length - 15]
const GameChart = (props) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const { socket, userData } = props;
  const [chartData, setChartData] = useState([]);
  const [time, setTime] = useState()
  const [crashLength, setCrashLength] = useState()
  const [crashRocket, setCrashRocket] = useState(false)
  const [showEndGame, setShowEndGame] = useState(false)
  const [betWinDetail, setBetWinDetail] = useState(false)
  const [newStartGame, setNewStartGame] = useState(false)
  const [refreshGameTime, setRefereshGameTime] = useState(false)
  const [dottStart, setDottStart] = useState(false)
  const [refreshGame, setRefereshGame] = useState(false)
  const [getCrashPoint, setGetCrashPoint] = useState()
  const [dataNew, setDataNew] = useState([])
  const [yCrash, setYCrash] = useState(false)
  const [checkDataRefersh, setCheckDataRefersh] = useState(true)
  const [crashRocketPostion, setCrashRocketPostionStart] = useState()
  const [crashDataShow, setCrashDataShow] = useState([])
  const [yData, setYData] = useState(1)
  const canvasRef = useRef(null);
  const [showGameStep, setShowGameStep] = useState({
    showWinDetails: false,
    showLoader: false,
  })
  const timeRef = useRef(time);

  useEffect(() => {
    socket &&
      socket.on("time", (time) => {
        setTime(time)
        updateTimeGame(time)
        timeRef.current = time;
      });

    socket &&
      socket.on("refresh", (refresh) => {
        if (refresh === true) {
          setRefereshGame(refresh)
          setRefereshGameTime(refresh)
        }
      });

    socket &&
      socket.on("YCrash", (yCrash) => {
        setYCrash(yCrash)
      });
  }, [socket]);

  useEffect(() => {
    if (crashRocket === false) {
      if (time >= 0 && refreshGameTime) {
        const YRefresh = 1 + time * 0.14;
        const addY = parseFloat(YRefresh);
        if (!isNaN(addY)) {
          setYData(addY.toFixed(2));
        } else {
          console.error("Invalid yData:", yData);
        }
        setRefereshGameTime(false)
      } else {
        if (time >= 0) {
          setTimeout(() => {
            const addY = parseFloat(yData) + 0.01; // Parse yData to ensure it's a number
            if (!isNaN(addY)) { // Check if addY is a valid number
              setYData(addY.toFixed(2)); // Call toFixed if addY is a number
            } else {
              console.error("Invalid yData:", yData);
            }
          }, 70);
        }
      }
    }
  }, [time, yData, refreshGameTime, crashRocket])

  useEffect(() => {
    if (refreshGame === true && time > 0) {
      setNewStartGame(true)
      console.log("refreshGame", refreshGame)
    }

    if (time >= -13 && time < -8 && crashRocket === false) {
      setCrashRocket(false)
      setNewStartGame(false)
      setShowGameStep({
        ...showGameStep,
        showWinDetails: true
      })
    }
  }, [refreshGame, time, crashRocket])

  const updateTimeGame = (time) => {

    if (time > -9 && time <= -2) {
      if (showGameStep?.showWinDetails === false) {
        setShowGameStep({
          ...showGameStep,
          showWinDetails: false,
          showLoader: true
        })
      }
    }


    if (time === -10) {
      setCrashDataShow([])
      setDataNew([])
      setDottStart(false)
      setCheckDataRefersh(true)
      setCrashRocketPostionStart()
    }

    if (time === -2) {
      setShowGameStep({
        ...showGameStep,
        showWinDetails: false,
        showLoader: false
      })
      setYData(1)
      setRefereshGame(false)
    }

    if (time === -2) {
    }

    if (time === 0) {
      setNewStartGame(true)
      setShowGameStep({
        ...showGameStep,
        showWinDetails: false
      })
      setYData(1)
      setCrashRocket(false)
    }
  }

  useEffect(() => {
    if (crashRocketPostion) {
      let getPostionDataHeight = crashRocketPostion?.height
      let getPostionDataWidth = crashRocketPostion?.width
      let dataArray = []
      for (let i = getPostionDataWidth; i <= 105; i++) {
        dataArray.push({
          width: parseInt(i),
          height: parseInt(getPostionDataHeight),
        });
        getPostionDataHeight--;
      }
      setCrashDataShow(dataArray);
    }
  }, [crashRocketPostion])


  useEffect(() => {
    if (time === -3) {
      const dataAdd = []
      dataAdd.push(...gameChartData)
      dataAdd.push(...repeatUpDown)
      setDataNew(dataAdd)
    }
  }, [time, gameChartData, repeatUpDown, refreshGame])

  useEffect(() => {
    if (refreshGame === true && checkDataRefersh === true) {
      if (yData < 1.75) {
        const dataAdd = []
        const dataGet = gameChartData?.slice(-30)
        dataAdd.push(...dataGet)
        dataAdd.push(...repeatUpDown)
        setDataNew(dataAdd)
      } else {
        setDataNew(repeatUpDown)
      }
      setCheckDataRefersh(false)
    }
  }, [refreshGame, , yData, checkDataRefersh])


  const convertWithPx = (data) => {
    const widthChart = canvasRef.current.width;
    const daataGet = (widthChart * data) / 100;
    return daataGet;
  };

  const convertHeightPx = (data) => {
    const hightChart = canvasRef.current.height;

    const daataGet = (hightChart * data) / 100;
    return daataGet;
  };

  useEffect(() => {
    if (Number(yData) === yCrash) {
      setCrashRocket(true)
      setRefereshGame(false)
    }
  }, [yData, yCrash])

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const parent = canvas.parentNode;
      canvas.width = parent.clientWidth;
      canvas.height = 400;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const renderImage = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      const airplane = new Image();
      airplane.src = airplaneImages[0];
      airplane.onload = () => {
        if (showGameStep?.showLoader === true) {
          if (windowWidth < 500) {
            context.drawImage(airplane, 0, 330, 60, 55);
          } else {
            context.drawImage(airplane, 0, 330, 100, 60);
          }
        }
      };
    };

    renderImage();

    return () => {
      // Clean up here if needed
    };
  }, [showGameStep, airplaneImages, windowWidth]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const airplane = new Image();
    airplane.src = airplaneImages[0];

    let dataIndex = 0;
    let crashDataIndex = 0;
    let imageIndex = 0
    let lastFrameTime = 0;
    let lastFrameTimeCrash = 0;
    const animationInterval = 10;
    const speedY = 2;

    airplane.onload = () => {
      if (crashRocket === true) {
        animateCrash()
      }
      if (newStartGame === true) {
        animate();
      }
    };

    let animationRequestIdCrash;
    let animationRequestId;

    const animateCrash = (timestamp) => {
      if (crashRocket === true && crashRocketPostion) {
        const elapsedTime = timestamp - lastFrameTimeCrash;
        if (elapsedTime > animationInterval) {
          lastFrameTimeCrash = timestamp - (elapsedTime % animationInterval);

          context.clearRect(0, 0, canvas.width, canvas.height);

          if (crashDataShow?.length > 0) {
            const { width, height } = crashDataShow[crashDataIndex];
            const widthGet = convertWithPx(width);
            let heightGet = convertHeightPx(height);

            heightGet += speedY;

            if (heightGet > canvas.height) {
              heightGet = -60;
            }
            const dataImgae = new Image()
            dataImgae.src = width < 103 ? airplaneImages[imageIndex] : "";

            if (windowWidth < 500) {
              context.drawImage(dataImgae, widthGet - 6, heightGet - 60, 60, 40);
            } else {
              context.drawImage(dataImgae, widthGet - 6, heightGet - 60, 100, 60);
            }

            if (width === 103) {
              if (crashRocket === true) {
                setCrashRocket(false)
                setShowGameStep({
                  ...showGameStep,
                  showWinDetails: true
                })
                setCrashDataShow([])
                context.clearRect(0, 0, canvas.width, canvas.height);
                cancelAnimationFrame(animationRequestIdCrash);
                return; // Exit the function
              }
            } else {
              imageIndex = (imageIndex + 1) % airplaneImages.length;
              crashDataIndex = (crashDataIndex + 1) % crashDataShow.length;
            }
          }
        }
        animationRequestIdCrash = requestAnimationFrame(animateCrash);
      }
    };
    const animate = (timestamp) => {
      if (newStartGame === true && dataNew?.length > 0) {
        const elapsedTime = timestamp - lastFrameTime;
        if (elapsedTime > animationInterval) {
          lastFrameTime = timestamp - (elapsedTime % animationInterval);
          const checkData = dataNew[dataIndex]

          context.clearRect(0, 0, canvas.width, canvas.height);
          if (dataNew?.length > 0) {
            if (checkData?.width === dataNew[dataNew?.length - 1]?.width && checkData?.height === dataNew[dataNew?.length - 1]?.height) {
              setDataNew(repeatUpDown)
            }
            const { width, y, height } = dataNew[dataIndex];
            setGetCrashPoint({ width, height })

            const widthGet = convertWithPx(width);
            let heightGet = convertHeightPx(height);

            heightGet += speedY;

            if (heightGet > canvas.height) {
              heightGet = -60;
            }
            context.beginPath();
            context.moveTo(0, canvas.height); // Start from the bottom-left corner

            // Adjust the control point to move downward
            context.quadraticCurveTo(
              widthGet + 6,
              heightGet + 30, // Adjusted control point to move downward
              widthGet,
              heightGet
            );

            // Draw a straight line to the bottom-right corner

            context.lineTo(widthGet, canvas.height);
            context.lineTo(0, canvas.height);

            // Close the path
            context.closePath();

            // Fill the path with color
            context.fillStyle = "rgb(239, 30, 48, 0.6)";
            context.fill();

            // Draw the stroke of the path
            context.strokeStyle = "rgb(255, 23, 43)";
            context.lineWidth = 4;
            context.stroke();
            const dataImgae = new Image()
            dataImgae.src = airplaneImages[imageIndex];
            if (windowWidth < 500) {
              context.drawImage(dataImgae, widthGet - 6, heightGet - 60, 60, 55);
            } else {
              context.drawImage(dataImgae, widthGet - 6, heightGet - 60, 100, 60);
            }
            imageIndex = (imageIndex + 1) % airplaneImages.length;
            dataIndex = (dataIndex + 1) % dataNew.length;
            // console.log("lastCrashPoint ========== ", width,height)
            if (dataNew[dataIndex]?.width == 65.66 && dataNew[dataIndex]?.height == 21.85) {
              setDottStart(true)
            }
            if (crashRocket === true) {
              setCrashRocketPostionStart(getCrashPoint)
              setNewStartGame(false)
              setBetWinDetail(dataNew[dataIndex])
              cancelAnimationFrame(animationRequestId);
              return;
            }


          } else {
            if (windowWidth < 500) {
              context.drawImage(airplane, 0, 330, 60, 55);
            } else {
              context.drawImage(airplane, 0, 330, 100, 60);
            }
          }
        }
        animationRequestId = requestAnimationFrame(animate);
      } else {
        return cancelAnimationFrame(animationRequestId);
      }
    };
    const cleanup = () => {
      cancelAnimationFrame(animationRequestIdCrash);
      cancelAnimationFrame(animationRequestId);
    };

    // Call cleanup function when component unmounts or dependencies change
    return cleanup;
    // console.log("showGameStepshowGameStepshowGameStepshowGameStepshowGameStepshowGameStepshowGameStepshowGameStep", dataNew, crashDataShow, showGameStep, newStartGame, crashRocket)
  }, [dataNew, crashDataShow, newStartGame, crashRocket]);

  // useEffect(() => {
  //   console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaa", refreshGame, newStartGame, crashRocket, showGameStep)
  // }, [newStartGame, crashRocket, showGameStep, refreshGame])


  return (
    <>
      <div className="chartShow">
        {/* <div className="background-video">
          <div className="videoShow">
            <video
              autoPlay
              loop
              muted
            >
              <source
                src={VideoBg}
                type="video/mp4"
              />
            </video>
          </div>
        </div> */}
        <div>
        </div>
        <img src={GameBg} class="rotateimage rotatebg" />
        <div className='showCanvasShow'>
          <canvas ref={canvasRef} height={400} />
          <div className="y-axis-animation">
            <>
              {
                dottStart === true ?
                  <div className="y-axis animations-y" ></div>
                  :
                  <div className="y-axis"></div>
              }
            </>
          </div>
          <div className="x-axis-animation">
            <>
              {
                dottStart === true ?
                  <div className="x-axis animations-x" ></div>
                  :
                  <div className="x-axis"></div>
              }
            </>
          </div>
          {
            showGameStep.showWinDetails && (
              <div className="winDetail">
                <h6>FLAY AWAY!</h6>
                <h5>{yCrash ? yCrash + "x" : ""}</h5>
              </div>
            )
          }
          {
            showGameStep.showLoader && (
              <div className="loaderGame">
                <img src={GameLoader} />
                <h6>WAITING FOR NEXT ROUND</h6>
                <div class="progressShow">
                  <div class="progress progress-striped">
                    <div class="progress-bar">
                    </div>
                  </div>
                </div>
              </div>
            )
          }
          {/* <div style={{ visibility: `${newStartGame === true ? "visible" : "hidden"}` }}>{yData}</div> */}
          <div className="yData" style={{ visibility: `${newStartGame === true ? "visible" : "hidden"}` }}>{yData + "x"}</div>
        </div>
      </div>
      <BetButtonShow time={time} showGameStep={showGameStep} userData={userData} socket={socket} yData={yData} crashRocket={crashRocket} newStartGame={newStartGame} />
    </>
  );
};

export default GameChart;
