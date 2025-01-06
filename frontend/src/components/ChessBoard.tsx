import { Color, PieceSymbol, Square } from "chess.js";
import { useEffect, useState } from "react";
import { MOVE } from "../screens/Game.tsx";


export const ChessBoard = ({ chess, board, socket, setBoard, gameId, myColor }: {
    chess: any;
    setBoard: any;
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][];
    socket: WebSocket;
    gameId: string;
    myColor: Color;
}) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [from, setFrom] = useState<null | Square>(null);
    const [legalMoves, setLegalMoves] = useState<string[]>([]);
    // const isMyTurn = myColor === chess.turn();

    // // Functionality I Want to add in next commit
    // const [gameOver, setGameOver] = useState(false);
    // const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);

    useEffect(() => {
        if (myColor === 'b') {
            setIsFlipped(true);
        }
    }, [myColor]);

    // return (
    //     <div className="text-white-200">
    //         {board.map((row, i) => (
    //             <div key={i} className="flex">
    //                 {row.map((square, j) => {
    //                     const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - i) as Square;
    //                     return (
    //                         <div
    //                             onClick={() => {
    //                                 // Get current square piece details
    //                                 const clickedPiece = board[i][j];
    //                                 console.log(clickedPiece);
    //                                 // CASE 1: If no "from" square is selected, allow selecting the first square
    //                                 if (!from) {
    //                                     // RED: Ensure player selects their own piece
    //                                     if (clickedPiece && clickedPiece.color === chess.turn()) {
    //                                         setFrom(squareRepresentation);

    //                                         const moves = chess.moves({ square: squareRepresentation, verbose: true });   // Get all legal moves for the selected square

    //                                         const moveSquares = moves.map((move: { to: string }) => move.to);             // Extract 'to' squares and store as legal moves
    //                                         setLegalMoves(moveSquares);
    //                                     }
    //                                 }
    //                                 // CASE 2: If "from" is already selected
    //                                 else {
    //                                     const to = squareRepresentation;

    //                                     // RED: Allow reselecting the player's own piece
    //                                     if (clickedPiece && clickedPiece.color === chess.turn()) {
    //                                         setFrom(squareRepresentation);

    //                                         // Get all legal moves for the newly selected square
    //                                         const moves = chess.moves({ square: squareRepresentation, verbose: true });
    //                                         const moveSquares = moves.map((move: { to: string }) => move.to);
    //                                         setLegalMoves(moveSquares);
    //                                     }
    //                                     // CASE 3: Trying to move to a valid 'to' square (including capturing)
    //                                     // RED: Check if it's a valid move, including capturing
    //                                     else if (legalMoves.includes(to)) {
    //                                         // Validate the move using chess.js before sending to the backend
    //                                         const move = chess.move({
    //                                             from,
    //                                             to,
    //                                             promotion: 'q', // Promote to queen for simplicity
    //                                         });

    //                                         if (move) {
    //                                             // RED: If move is valid, update UI and send to backend
    //                                             socket.send(
    //                                                 JSON.stringify({
    //                                                     type: MOVE,
    //                                                     gameId: gameId,
    //                                                     payload: {
    //                                                         move: {
    //                                                             from,
    //                                                             to,
    //                                                         },
    //                                                     },
    //                                                 })
    //                                             );
    //                                             setFrom(null);
    //                                             setBoard(chess.board()); // Update board state
    //                                             setLegalMoves([]); // Clear legal moves after move is done
    //                                             console.log({ from, to });
    //                                         } else {
    //                                             // RED: Invalid move, reset the 'from' square
    //                                             console.log(`Invalid move from ${from} to ${to}`);
    //                                             setFrom(null);
    //                                             setLegalMoves([]);
    //                                         }
    //                                     } else {
    //                                         // If it's not a legal move or the player clicked on something else
    //                                         console.log(`Illegal move or wrong selection.`);
    //                                         setFrom(null); // Reset the selection
    //                                         setLegalMoves([]); // Clear legal moves
    //                                     }
    //                                 }
    //                             }}
    //                             key={j}
    //                             className={`w-16 h-16 ${(i + j) % 2 === 0 ? 'bg-[#A7C7E7]' : 'bg-[#4A90E2]'
    //                                 }`}
    //                         >
    //                             <div className="w-full h-full justify-center flex">
    //                                 <div className="h-full justify-center flex flex-col">
    //                                     {square ? (
    //                                         <img
    //                                             className="w-8"
    //                                             src={`/${square?.color === 'b' ? square?.type : `${square?.type?.toUpperCase()} copy`}.png`}
    //                                         />
    //                                     ) : null}
    //                                 </div>
    //                                 {/* Show the white dot if this square is a legal move */}
    //                                 {legalMoves.includes(squareRepresentation) && (
    //                                     <div className="absolute w-4 h-4 mt-6 bg-white rounded-full opacity-65" />
    //                                 )}
    //                             </div>
    //                         </div>
    //                     );
    //                 })}
    //             </div>
    //         ))}
    //     </div>
    // );

    return (
        <div className="text-white-200">
            {(isFlipped ? [...board].reverse() : board).map((row, i) => (
                <div key={i} className="flex">
                    {(isFlipped ? [...row].reverse() : row).map((square, j) => {
                        const actualI = isFlipped ? 7 - i : i;
                        const actualJ = isFlipped ? 7 - j : j;
                        const squareRepresentation = String.fromCharCode(97 + (actualJ % 8)) + (8 - actualI) as Square;

                        return (
                            <div
                                onClick={() => {
                                    const clickedPiece = board[actualI][actualJ];
                                    console.log(clickedPiece);

                                    if (!from) {
                                        if (clickedPiece && clickedPiece.color === chess.turn()) {
                                            setFrom(squareRepresentation);

                                            const moves = chess.moves({ square: squareRepresentation, verbose: true });
                                            const moveSquares = moves.map((move: { to: string }) => move.to);
                                            setLegalMoves(moveSquares);
                                        }
                                    } else {
                                        const to = squareRepresentation;

                                        if (clickedPiece && clickedPiece.color === chess.turn()) {
                                            setFrom(squareRepresentation);
                                            const moves = chess.moves({ square: squareRepresentation, verbose: true });
                                            const moveSquares = moves.map((move: { to: string }) => move.to);
                                            setLegalMoves(moveSquares);
                                        } else if (legalMoves.includes(to)) {
                                            const move = chess.move({
                                                from,
                                                to,
                                                promotion: 'q',
                                            });

                                            if (move) {
                                                socket.send(
                                                    JSON.stringify({
                                                        type: MOVE,
                                                        gameId: gameId,
                                                        payload: { move: { from, to } },
                                                    })
                                                );
                                                setFrom(null);
                                                setBoard(chess.board());
                                                setLegalMoves([]);
                                                console.log({ from, to });
                                            } else {
                                                console.log(`Invalid move from ${from} to ${to}`);
                                                setFrom(null);
                                                setLegalMoves([]);
                                            }
                                        } else {
                                            console.log(`Illegal move or wrong selection.`);
                                            setFrom(null);
                                            setLegalMoves([]);
                                        }
                                    }
                                }}
                                key={j}
                                className={`w-16 h-16 ${(i + j) % 2 === 0 ? 'bg-[#A7C7E7]' : 'bg-[#4A90E2]'}`}
                            >
                                <div className="w-full h-full justify-center flex">
                                    <div className="h-full justify-center flex flex-col">
                                        {square ? (
                                            <img
                                                className="w-8"
                                                src={`/${square.color === 'b' ? square.type : `${square.type.toUpperCase()} copy`}.png`}
                                            />
                                        ) : null}
                                    </div>
                                    {legalMoves.includes(squareRepresentation) && (
                                        <div className="absolute w-4 h-4 mt-6 bg-white rounded-full opacity-65" />
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