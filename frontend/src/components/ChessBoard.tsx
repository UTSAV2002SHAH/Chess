import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game.tsx";


export const ChessBoard = ({ chess, board, socket, setBoard, gameId }: {
    chess: any;
    setBoard: any;
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;
    gameId: string;
}) => {
    const [from, setFrom] = useState<null | Square>(null);
    const [legalMoves, setLegalMoves] = useState<string[]>([]);
    return (
        <div className="text-white-200">
            {board.map((row, i) => (
                <div key={i} className="flex">
                    {row.map((square, j) => {
                        const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;
                        return (
                            <div
                                onClick={() => {
                                    // Get current square piece details
                                    const clickedPiece = board[i][j];
                                    console.log(clickedPiece);
                                    // CASE 1: If no "from" square is selected, allow selecting the first square
                                    if (!from) {
                                        // RED: Ensure player selects their own piece
                                        if (clickedPiece && clickedPiece.color === chess.turn()) {
                                            setFrom(squareRepresentation);

                                            const moves = chess.moves({ square: squareRepresentation, verbose: true });   // Get all legal moves for the selected square

                                            const moveSquares = moves.map((move: { to: string }) => move.to);             // Extract 'to' squares and store as legal moves
                                            setLegalMoves(moveSquares);
                                        }
                                    }
                                    // CASE 2: If "from" is already selected
                                    else {
                                        const to = squareRepresentation;

                                        // RED: Allow reselecting the player's own piece
                                        if (clickedPiece && clickedPiece.color === chess.turn()) {
                                            setFrom(squareRepresentation);

                                            // Get all legal moves for the newly selected square
                                            const moves = chess.moves({ square: squareRepresentation, verbose: true });
                                            const moveSquares = moves.map((move: { to: string }) => move.to);
                                            setLegalMoves(moveSquares);
                                        }
                                        // CASE 3: Trying to move to a valid 'to' square (including capturing)
                                        // RED: Check if it's a valid move, including capturing
                                        else if (legalMoves.includes(to)) {
                                            // Validate the move using chess.js before sending to the backend
                                            const move = chess.move({
                                                from,
                                                to,
                                                promotion: 'q', // Promote to queen for simplicity
                                            });

                                            if (move) {
                                                // RED: If move is valid, update UI and send to backend
                                                socket.send(
                                                    JSON.stringify({
                                                        type: MOVE,
                                                        gameId: gameId,
                                                        payload: {
                                                            move: {
                                                                from,
                                                                to,
                                                            },
                                                        },
                                                    })
                                                );
                                                setFrom(null);
                                                setBoard(chess.board()); // Update board state
                                                setLegalMoves([]); // Clear legal moves after move is done
                                                console.log({ from, to });
                                            } else {
                                                // RED: Invalid move, reset the 'from' square
                                                console.log(`Invalid move from ${from} to ${to}`);
                                                setFrom(null);
                                                setLegalMoves([]);
                                            }
                                        } else {
                                            // If it's not a legal move or the player clicked on something else
                                            console.log(`Illegal move or wrong selection.`);
                                            setFrom(null); // Reset the selection
                                            setLegalMoves([]); // Clear legal moves
                                        }
                                    }
                                }}
                                key={j}
                                className={`w-16 h-16 ${(i + j) % 2 === 0 ? 'bg-green-500' : 'bg-black'
                                    }`}
                            >
                                <div className="w-full h-full justify-center flex">
                                    <div className="h-full justify-center flex flex-col">
                                        {square ? (
                                            <img
                                                className="w-4"
                                                src={`/${square?.color === 'b' ? square?.type : `${square?.type?.toUpperCase()} copy`}.png`}
                                            />
                                        ) : null}
                                    </div>
                                    {/* Show the dark dot if this square is a legal move */}
                                    {legalMoves.includes(squareRepresentation) && (
                                        <div className="absolute w-4 h-4 mt-6 bg-white rounded-full opacity-75" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );

}















// onClick={() => {
//     if (!from) {
//         // Select the starting square
//         setFrom(squareRepresentation);

//         // Get all legal moves for the selected square
//         const moves = chess.moves({ square: squareRepresentation, verbose: true });

//         // Extract the 'to' square from each move and store it
//         const moveSquares = moves.map((move: { to: any; }) => move.to);
//         setLegalMoves(moveSquares); // Set legal moves in state
//     } else {
//         const to = squareRepresentation;

//         // Validate the move using chess.js before sending to backend
//         const move = chess.move({
//             from,
//             to,
//             promotion: 'q', // Always promote to a queen for simplicity
//         });

//         if (move) {
//             // If the move is valid, update the UI and send to the backend
//             socket.send(
//                 JSON.stringify({
//                     type: MOVE,
//                     payload: {
//                         move: {
//                             from,
//                             to,
//                         },
//                     },
//                 })
//             );
//             setFrom(null);
//             setBoard(chess.board()); // Update the board locally
//             setLegalMoves([]); // Clear Legal moves after piece is moved
//             console.log({ from, to });
//         } else {
//             // Invalid move, reset the 'from' square
//             console.log(`Invalid move from ${from} to ${to}`);
//             setFrom(null);
//             setLegalMoves([]); // clear legal move if move is invalid
//         }
//     }
// }}
