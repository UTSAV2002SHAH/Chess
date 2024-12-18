import { useNavigate } from "react-router-dom"
import { Button } from "../components/Button";
import axios from "axios";
import { url } from "../App";
import { toast } from "react-toastify";

interface LoginProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (loggedIn: boolean) => void; // Setter function passed as a prop
}

export const Landing: React.FC<LoginProps> = ({ isLoggedIn, setIsLoggedIn }) => {

    const navigate = useNavigate();

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

    return <div className="flex justify-center">
        <div className="pt-8 max-w-screen-lg">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex justify-center">
                    <img className="max-w-96" src={"/chess-board.png"} alt="Chess Board Image" />
                </div>
                <div className="pt-16">
                    <div className="flex justify-center">
                        <h1 className="text-4xl text-white font-bold">Play Chess on #1 chess Platform</h1>
                    </div>
                    <div className="mt-8 flex justify-center gap-2">
                        <Button onClick={() => { navigate("/game") }}>
                            Play Online
                        </Button>

                        {!isLoggedIn && (
                            <Button onClick={() => { navigate("/login") }}> Login </Button>
                        )}

                        {isLoggedIn && (
                            <Button onClick={onClickHandler}>LogOut</Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
}