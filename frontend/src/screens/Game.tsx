import { useEffect, useState } from "react";
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { Chess } from 'chess.js'
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../../packages/src/hooks/useUser";

// to do moves together, there's code
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const NOT_YOUR_PIECE = 'not_your_piece';
export const NOT_YOUR_TURN = 'not_your_turn';
export const GAME_ADDED = 'game_added';
export const JOIN_GAME = 'join_game';

// icon Import
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { faFlag } from '@fortawesome/free-solid-svg-icons';


export interface Player {
    id: string;
    name: string;
    isGuest: boolean;
}

export interface Metadata {
    blackPlayer: Player;
    whitePlayer: Player;
}


export const Game = () => {

    const socket = useSocket();
    const { gameId } = useParams();
    const user = useUser();  // i have just created and not used in rest of the file for comperison

    const navigate = useNavigate();


    const [gameID, setGameID] = useState("");
    const [chess, _setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [_added, setAdded] = useState(false);  // dont know why
    const [started, setStarted] = useState(false);
    const [gameMetadata, setGameMetadata] = useState<Metadata | null>(null);
    const [playerColour, setPlayerColour] = useState("");

    const [result, setResult] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user]);

    useEffect(() => {
        if (started) {
            if (user?.id === gameMetadata?.blackPlayer?.id) {
                setPlayerColour('Black')
            } else {
                setPlayerColour('white')
            } //? 'b' : 'w'
        }
    }, [started]);

    useEffect(() => {
        if (!socket) { // Ensure socket and gameId both exist
            return;
        }
        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            let currentBoard = chess.board();

            switch (message.type) {

                case GAME_ADDED:
                    setAdded(true);
                    setGameID((_p) => message.gameId); // new thing i learn in this line of code whenever you use a veriable which will not be used in code start with underScoroll _
                    console.log(gameID);
                    break;
                case INIT_GAME:
                    setBoard(chess.board());
                    setStarted(true);
                    console.log(message.payload.gameId);

                    setGameMetadata({
                        whitePlayer: message.payload.whitePlayer,
                        blackPlayer: message.payload.blackPlayer,
                    });

                    if (user?.id === gameMetadata?.blackPlayer.id) {
                        setPlayerColour("Black");
                    } else {
                        setPlayerColour("White");
                    }

                    navigate(`/game/${message.payload.gameId}`);
                    console.log("Game Initialized");
                    break;
                case MOVE:
                    const move = message.payload;
                    // const currentBoard = chess.board();
                    console.log(message.valid);
                    if (message.valid) {
                        chess.move(move);
                        setBoard(chess.board());
                        //currentBoard = chess.board();
                        console.log("Move made");
                    }
                    else {
                        chess.undo(); // Undo the last invalid move
                        //  setBoard(currentBoard); // set the to the last correct statecd frontend
                        console.log("invalid Move");
                    }
                    break;
                case NOT_YOUR_TURN:
                    chess.undo();
                    setBoard(currentBoard);
                    break;
                case NOT_YOUR_PIECE:
                    alert(message.payload); // You can also update the UI to highlight the error
                    break;
                case GAME_OVER:
                    const lastmove = message.payload.move;
                    chess.move(lastmove);
                    setBoard(chess.board());
                    console.log("Game Over");
                    setResult(true);
                    break;
            }
        };
    }, [socket, chess]);


    // useEffect(() => {
    //     if (!started) {
    //         setChess(new Chess());
    //     }
    // }, [started]);
    if (!socket) return <div>Connecting...</div>;

    return <div className="flex justify-center">
        <div className="pt-8 max-w-screen-lg w-full">
            <div className="grid grid-cols-6 gap-4 w-full">
                <div className="col-span-4 w-full flex justify-center">
                    <ChessBoard
                        chess={chess}
                        setBoard={setBoard}
                        socket={socket}
                        board={board}
                        gameId={gameId ?? ''}
                        myColor={user?.id === gameMetadata?.blackPlayer?.id ? 'b' : 'w'}
                    />
                </div>
                <div className="col-span-2 bg-slate-800 flex flex-col w-fit h-fit min-h-[640px] min-w-[430px] justify-center items-center gap-2">
                    <div className="pt-8 gap-4 flex">
                        {!started && <Button onClick={() => {
                            socket.send(JSON.stringify({
                                type: INIT_GAME
                            }));
                        }}>
                            Play
                        </Button>}

                        {!started && <Button onClick={() => {
                            socket.send(JSON.stringify({
                                type: JOIN_GAME
                            }));
                        }}>
                            Join Game
                        </Button>}
                    </div>

                    <div className="pt-8">
                        {started && (
                            <div className="w-[100%] h-20 bg-white font-weight-200 flex flex-col justify-center items-center bg-[#ffffff]">
                                <p>You Are : {playerColour}</p>
                                <p>Turn : {chess.turn() === 'w' ? 'White\'s turn' : 'Black\'s turn'}</p>
                            </div>
                        )}

                        {result && (
                            <div className="w-[100%] h-20 bg-white font-weight-200 flex flex-col justify-center items-center bg-[#ffffff]">
                                <p>{chess.turn() === 'w' ? 'Black Wins By check mate' : 'White Wins By check mate'}</p>
                            </div>
                        )}
                    </div>

                    {started && (
                        <>
                            <div className="h-[400px] w-[400px] bg-gray-200 rounded-[10px]">
                                <p>Moves</p>
                            </div>

                            <div className="flex gap-4">
                                <Button onClick={() => navigate('/')}>
                                    <FontAwesomeIcon icon={faAngleLeft} />
                                </Button>

                                <Button onClick={() => navigate('/')}>
                                    <FontAwesomeIcon icon={faAngleRight} />
                                </Button>

                                <Button onClick={() => navigate('/')}>
                                    <p className="text-white">Resign</p>
                                    <FontAwesomeIcon icon={faFlag} />
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    </div>;
}