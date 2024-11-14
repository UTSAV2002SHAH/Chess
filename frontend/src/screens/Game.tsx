import { useEffect, useState } from "react";
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { Chess, Move } from 'chess.js'
import { useNavigate, useParams } from "react-router-dom";

// to do moves together, there's code
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
export const NOT_YOUR_PIECE = 'not_your_piece';
export const NOT_YOUR_TURN = 'not_your_turn';
export const GAME_ADDED = 'game_added';
export const JOIN_GAME = 'join_game';

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
    const navigate = useNavigate();


    const [gameID, setGameID] = useState("");
    const [chess, _setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [_added, setAdded] = useState(false);  // dont know why
    const [started, setStarted] = useState(false);
    const [gameMetadata, setGameMetadata] = useState<Metadata | null>(null);

    const [playerColour, setPlayerColour] = useState(false);

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
                        blackPlayer: message.payload.blackPlayer,
                        whitePlayer: message.payload.blackPlayer,
                    });

                    setPlayerColour(message.payload.whitePlayer.id);

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
                        // setBoard(currentBoard); // set the to the last correct state
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
                    console.log("Game Over");
                    break;
            }
        };
    }, [socket]);

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
                    <ChessBoard chess={chess} setBoard={setBoard} socket={socket} board={board} gameId={gameId ?? ''} />
                </div>
                <div className="col-span-2 bg-slate-800 w-full flex justify-center gap-2">
                    <div className="pt-8">
                        {!started && <Button onClick={() => {
                            socket.send(JSON.stringify({
                                type: INIT_GAME
                            }));
                        }}>
                            Play
                        </Button>}

                        {started && (
                            <div className="w-200 h-20 bg-white font-weighgt-200 flex justify-center items-center">
                                <p>You Are : {playerColour}</p>
                                <p>Turn : {chess.turn() === 'w' ? 'White\'s turn' : 'Black\'s turn'}</p>
                            </div>
                        )}
                    </div>
                    <div className="pt-8">
                        {!started && <Button onClick={() => {
                            socket.send(JSON.stringify({
                                type: JOIN_GAME
                            }));
                        }}>
                            Join Game
                        </Button>}
                    </div>
                </div>
            </div>
        </div>
    </div>;
}