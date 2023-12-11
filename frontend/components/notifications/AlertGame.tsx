"use client";
import { useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";
import cookie from "js-cookie";

export default function AlertGame() {
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        const socketIo = io("http://localhost:3000/notifications", {
            auth: {
                token: cookie.get("USER_ID"),
            },
        });
        setSocket(socketIo);
        return () => {
            socketIo.disconnect();
        };
    }, []);

    return(
        <>
        </>
    )
}