import React, { useEffect, useState } from "react";
import axios from 'axios';
// import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from 'recoil';
import { userAtom } from '../../../packages/src/atoms/userAtom';

import { url } from '../App'
import { toast } from 'react-toastify';

// Icons import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChess } from '@fortawesome/free-solid-svg-icons';

interface LoginProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (loggedIn: boolean) => void; // Setter function passed as a prop
}

// JWT in Cookies
// If your backend issued the JWT during login and stored it as a cookie (using res.cookie()), 
// the browser automatically sends that cookie along with the request when credentials: 'include' is used.

export const Login: React.FC<LoginProps> = ({ isLoggedIn, setIsLoggedIn }) => {

    const navigate = useNavigate();
    const [isLoginMode, setIsLoginMode] = useState(true);
    //const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);


    // console.log("current User", user);
    const [user, setUser] = useRecoilState(userAtom);  // uses  consept to maintain state at app level any change in state will reflect to every component

    const onSubmitHandler = async (e: React.FormEvent) => {

        e.preventDefault()
        setLoading(true);
        try {
            const endpoint = isLoginMode ? '/login' : '/register';
            const data = {
                name: "",
                email: email,
                password: password
            };
            if (!isLoginMode) {
                data.name = name;
            }
            const response = await axios.post(`${url}/user${endpoint}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            console.log(response);
            const { success, message, user } = await response.data;
            if (success) {
                setName('');
                setEmail('');
                setPassword('');
                if (isLoginMode) {
                    setIsLoggedIn(true);
                    toast.success(message || "Login successful!");
                    console.log('User:', user);
                    setUser(user); //create a User for frontend
                    navigate('/');
                }
                else {
                    navigate('/login');
                    alert("Now Try login");
                }
            }
            else {
                toast.error(message || "something went wrong");
            }
        } catch (error) {
            console.log(error);
            toast.error("error occured");
        }
        setLoading(false);
    }

    useEffect(() => {
        if (user?.isGuest) {
            console.log(user);
            setIsLoggedIn(true);
            // alert("You are already logged in");
            // navigate('/'); // Redirecting to home screen after successful login
        }
    }, [user]);

    useEffect(() => {
        if (isLoggedIn) {
            alert("You are already logged in");
            navigate('/'); // Redirecting to home screen after successful login
        }
    }, [isLoggedIn, navigate]);

    // return (
    //     <div className="App flex flex-col items-center justify-center w-screen h-screen gap-4">
    //         <h3 className="w-30 items-center justify-center text-white">Hello {user?.name}</h3>
    //         <div className="border border-white w-20 h-10 flex items-center justify-center bg-white">
    //             <header className="App-header">
    //                 {isAuthenticated ? (
    //                     <button onClick={(e) => logout()}>Logout</button>
    //                 ) : (
    //                     <button onClick={(e) => loginWithRedirect()}>
    //                         Login with Redirect
    //                     </button>)}
    //             </header>
    //         </div>
    //     </div>
    // )

    return loading ? (
        <div className='flex flex-col justify-center items-center  bg-transparent min-h-screen w-[100%]'>
            <div className=" text-white">
                <FontAwesomeIcon icon={faChess} bounce style={{ color: "#ffffff", fontSize: "80px" }} />
                <p className="text-2xl text-white font-bold">Wait a Sec...</p>
            </div>
        </div>
    ) : (
        <div className="flex flex-col justify-center items-center w-[100%] h-screen bg-[#81B64C] gap-4">
            <div className=" p-2">
                <h1 className="text-white text-4xl font-bold">Create Your Chess Account...😎</h1>
            </div>
            <div className="text-white bg-[#312E2b] w-96 h-auto p-8 border-2 border-[#312E2b] rounded-lg">
                <form onSubmit={onSubmitHandler} className="flex flex-col space-y-4 p-5">

                    {!isLoginMode && (
                        <>
                            <label htmlFor="name" className="mb-2">Name</label>
                            <input className="text-black p-2 border-2 border-white rounded-md mb-4"
                                id="name"
                                type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Username" required />
                        </>
                    )}

                    <label htmlFor="email">Email</label>
                    <input className="text-black  p-2 border-2 border-white rounded-md mb-4"                    //  class="bg-blue-100 p-2 rounded-md border-2 border-gray-300"
                        id="email"
                        type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />

                    <label htmlFor="">Password</label>
                    <input className="text-black p-2 border-2 border-white rounded-md mb-4"
                        id="password"
                        type="password"
                        value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />

                    <button
                        type="submit"
                        className="text-black border-2 border-white rounded-md p-2 bg-white hover:bg-[#81B64C] hover:text-white transition duration-300">{isLoginMode ? "Login" : "Register"}</button>
                </form>

                <p className="my-4 text-center">
                    {isLoginMode ? (
                        <>
                            Don't have an account? <button onClick={() => setIsLoginMode(false)} className="text-white hover:underline">Register here</button>
                        </>
                    ) : (
                        <>
                            Already have an account? <button onClick={() => setIsLoginMode(true)} className="text-white hover:underline">Login here</button>
                        </>
                    )}
                </p>
            </div>
        </div>
    );
}