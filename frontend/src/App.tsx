import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot } from 'recoil'; // Import RecoilRoot
import { useState } from "react";
import { Suspense } from 'react';

import { Landing } from './screens/Landing';
import { Game } from './screens/Game';
import { Login } from './screens/Login';
import { Loader } from "./components/Loader";

export const url = "http://localhost:4000"

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className='h-screen bg-slate-900'>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <RecoilRoot>
        <Suspense fallback={<Loader />}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/game" element={<Game />} />
              <Route path="/game/:gameId" element={<Game />} />
            </Routes>
          </BrowserRouter>
        </Suspense>
      </RecoilRoot>
    </div>
  )
}

export default App