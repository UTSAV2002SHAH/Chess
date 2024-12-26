import { BrowserRouter, Route, Routes } from "react-router-dom"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Suspense } from 'react';
import { useState } from "react";
import { Loader } from "./components/Loader";
import { useRecoilValue } from 'recoil'; // Import RecoilRoot
import { userAtom } from '../../packages/src/atoms/userAtom'
import { Landing } from './screens/Landing';
import { Game } from './screens/Game';
import { Login } from './screens/Login';




// Experimental Imports
// import { Sidebar } from "./components/Sidebar";
// import { Landing } from "./screens/Landing";


export const url = "http://localhost:4000"

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [user, setUser] = useRecoilState(userAtom);
  // /console.log(user);

  const user = useRecoilValue(userAtom); // Get the user from Recoil state

  if (user === null) {
    // Show the loader while userAtom is being resolved
    return (
      <div className='h-screen flex justify-center items-center bg-slate-900'>
        <Loader />
      </div>
    );
  }

  // //Experimental version
  // return (
  //   <div className='h-screen bg-slate-900'>
  //    <div className='h-[100%] flex'>
  //      <Sidebar />
  //      <Landing isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
  //    </div>
  //   </div>
  // )




  return (
    <div className='min-h-screen bg-[#81B64C]'>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Suspense fallback={<Loader />}>
        <BrowserRouter>
          <div className="flex min-h-screen">
            {/* <Sidebar /> */}
            <div className="w-[100%]">
              <Routes>
                <Route path="/" element={<Landing isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/game" element={<Game />} />
                <Route path="/game/:gameId" element={<Game />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
      </Suspense>
    </div>
  )
}

export default App