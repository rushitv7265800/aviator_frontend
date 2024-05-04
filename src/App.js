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
import GamePage from './GamePage';
import { Route, Routes } from 'react-router-dom';
import DepositFundPage from './Game/DepositFundPage';
import Admin from './Admin';

function App() {
  return (
    <>
       <Admin/>
      <ToastContainer />
    </>
  );
}

export default App;
