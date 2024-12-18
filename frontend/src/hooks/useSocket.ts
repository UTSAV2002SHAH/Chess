import { useEffect, useState } from "react";
import { useUser } from '../../../packages/src/hooks/useUser'

const WS_URL = "ws://localhost:8080";

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const user = useUser();

    useEffect(() => {
        if (!user) return;

        const ws = new WebSocket(`${WS_URL}?token=${user.token}`);
        // const ws = new WebSocket(WS_URL);
        ws.onopen = () => {
            console.log("connected");
            setSocket(ws);
        }

        ws.onclose = () => {
            console.log("disconnected");
            setSocket(null);
        }
        return () => {
            ws.close();
        };
    }, [user]);

    return socket;
}