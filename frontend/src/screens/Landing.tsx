import { useNavigate } from "react-router-dom"
import { Button } from "../components/Button";
import axios from "axios";
import { url } from "../App";
import { toast } from "react-toastify";
import { useUser } from "../../../packages/src/hooks/useUser";

// Icons import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessBishop } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';


// Images
import chess_puzzel from "../../../Chess-puzzel.jpg"
import chess_lessons from "../../../chess-lessons.jpg"

//Experimental
import { Sidebar } from "../components/Sidebar";

interface LoginProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (loggedIn: boolean) => void; // Setter function passed as a prop
}

export const Landing: React.FC<LoginProps> = ({ isLoggedIn, setIsLoggedIn }) => {

    const navigate = useNavigate();
    const user = useUser();
    const onClickHandler = async () => {
        try {
            const endpoint = '/logout'; // Adjust this if needed based on your backend routing
            const response = await axios.post(`${url}/user${endpoint}`, {
                withCredentials: true,
            })

            if (response.status === 200) {
                toast.success("Logged out Successfully");
                setIsLoggedIn(false); // Update the logged-in state
                navigate("/"); // Redirect landing page
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during logout.");
        }
    };

    // lg:w-[100%] lg:ml-0 w-[100%]

    // return <div className="flex w-full min-h-screen gap-2 rounded bg-[#403B3B] text-white ">
    //     <Sidebar />
    //     <div className="flex-col justify-center items-center w-[............................................................................90%] gap-4 rounded bg-[#403B3B] text-white">
    //         <div className="pt-8 max-w-screen-lg">
    //             <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
    //                 <div className="flex justify-center">
    //                     <img className="max-w-96" src={"/chess-board.png"} alt="Chess Board Image" />
    //                 </div>
    //                 <div className="pt-16">
    //                     <div className="flex justify-center">
    //                         <h1 className="text-4xl text-white font-bold">Play Chess on #1 chess Platform</h1>
    //                     </div>
    //                     <div className="mt-8 flex justify-center gap-2">
    //                         <Button onClick={() => { navigate("/game") }}>
    //                             Play Online
    //                         </Button>

    //                         {!isLoggedIn && (
    //                             <Button onClick={() => { navigate("/login") }}> Login </Button>
    //                         )}

    //                         {isLoggedIn && (
    //                             <Button onClick={onClickHandler}>LogOut</Button>
    //                         )}
    //                     </div>
    //                 </div>
    //             </div>
    //         </div>

    //         <div className="w-[70%] h-[60%]">
    //             <img className="p-7" src={chess_puzzel} alt="Example Image"></img>
    //         </div>

    //         <div className="w-[70%] h-[60%]">
    //             <img className="p-7" src={chess_lessons} alt="Example Image"></img>
    //         </div>
    //     </div>
    // </div>

    return (
        <div className="flex w-full min-h-screen bg-[#403B3B] text-white">
            <Sidebar />
            {/* Content Area */}
            <div className="ml-[10%] flex flex-col w-[90%] overflow-y-auto p-8">
                <div className="pt-8 max-w-screen-lg">
                    <div>
                        {user?.isGuest && <>
                            <h1 className="text-4xl ml-[55px] mb-5">Welcome {user.name} 😎</h1>
                        </>}
                    </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex justify-center">
                            <img
                                className="max-w-96"
                                src={"/chess-board.png"}
                                alt="Chess Board Image"
                            />
                        </div>
                        <div className="pt-16">
                            <div className="flex justify-center">
                                <h1 className="text-4xl text-white font-bold">
                                    Play Chess on #1 Chess Platform
                                </h1>
                            </div>
                            <div className="mt-8 flex justify-center gap-2">
                                <Button onClick={() => navigate("/game")}>
                                    <FontAwesomeIcon icon={faChessBishop} style={{ color: "#fbfaff", position: "relative", top: "1px", fontSize: "30px" }} />
                                    <p>Play Online</p>
                                </Button>

                                {!isLoggedIn && (
                                    <Button onClick={() => navigate("/login")}>
                                        <FontAwesomeIcon icon={faUser} style={{ color: "#fbfaff", position: "relative", top: "1px", fontSize: "30px" }} />
                                        <p>Login</p>
                                    </Button>
                                )}

                                {isLoggedIn && (
                                    <Button onClick={onClickHandler}>
                                        <FontAwesomeIcon icon={faUser} style={{ color: "#fbfaff", position: "relative", top: "1px", fontSize: "30px" }} />
                                        <p>LogOut</p>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Content */}
                <div className="w-full h-auto">
                    <img className="p-7" src={chess_puzzel} alt="Chess Puzzle" />
                </div>

                <div className="w-full h-auto">
                    <img className="p-7" src={chess_lessons} alt="Chess Lessons" />
                </div>
            </div>
        </div>
    );
}