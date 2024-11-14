import React, { useEffect, useState } from "react";
import axios from 'axios';
import { url } from '../App'
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


export const Login = () => {

    const navigate = useNavigate();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = async (e: React.FormEvent) => {

        e.preventDefault()
        try {
            const endpoint = isLoginMode ? '/login' : '/register';
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);
            if (!isLoginMode) {
                formData.append('name', name);
            }
            // const response = await axios.post(`${url}/login`, formData);
            const response = await axios.post(`${url}/user${endpoint}`, formData, {
                headers: {
                    "Content-Type": "application/json",
                }
            });
            console.log(response);
            if (response.data.success) {
                setName('');
                setEmail('');
                setPassword('');
                if (isLoginMode) { setIsLoggedIn(true) };
                isLoginMode ? navigate('/') : navigate("/login");
            }
            else {
                toast.error("something went wrong");
            }
        } catch (error) {
            console.log(error);
            toast.error("error occured");
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/'); // Redirecting to home screen after successful login
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-white w-96 h-auto border-2  border-white p-8">
                <form onSubmit={onSubmitHandler} className="flex flex-col space-y-4 p-5">

                    {!isLoginMode && (
                        <>
                            <label htmlFor="name" className="mb-2">Name</label>
                            <input className="text-black p-2 border-2 border-white rounded-md mb-4"
                                id="name"
                                type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                        </>
                    )}

                    <label htmlFor="email">Email</label>
                    <input className="text-black p-2 border-2 border-white rounded-md mb-4"
                        id="email"
                        type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />

                    <label htmlFor="">Password</label>
                    <input className="text-black p-2 border-2 border-white rounded-md mb-4"
                        id="password"
                        type="text"
                        value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />

                    <button
                        type="submit"
                        className="text-white border-2 border-white rounded-md p-2  hover:bg-white hover:text-black transition duration-300">{isLoginMode ? "Login" : "Register"}</button>
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