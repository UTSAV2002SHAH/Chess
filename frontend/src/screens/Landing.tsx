import { useNavigate } from "react-router-dom"
import { Button } from "../components/Button";

export const Landing = () => {

    const navigate = useNavigate();

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
                        <Button onClick={() => { navigate("/login") }}>
                            Login
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}