'use client'
import PingPong from "./PingPong";
import { useEffect, useRef, useState, useCallback, use } from "react";
import { Socket, io } from "socket.io-client";
import cookie from 'js-cookie';
import Countdown from './countdown';
import { Player, Net } from '../../types';

const canvasWidth = 1080;
const canvasHeight = 720;
const drawTable = (context: any, canvas: any, x: number, y: number, color: string) => {
	context.fillStyle = 'black';
	context.fillRect(0, 0, canvasWidth, canvasHeight);
}

// draw the ball
const drawBall = (context: any, x: number, y: number, color: string) => {
	context.fillStyle = color;
	context.beginPath();
	context.arc(x, y, 20, 0, 2 * Math.PI, false);
	context.closePath();
	context.fill();
}

// draw the rectangle aka the paddle
const drawRect = (context: any, x: number, y: number, width: number, height: number, color: string) => {
	context.beginPath();
	context.rect(x, y, width, height);
	context.fillStyle = color;
	context.fill();
	context.closePath();
}

// draw the net
const drawNet = (context: any, canvas: any, x: number, y: number, width: number, height: number, color: string) => {
	for (let i = 0; i <= canvasHeight; i += 25) {
		drawRect(context, x, y + i, width, height, color);
	}
}

let net: Net = {
	x: canvasWidth / 2 - 2 / 2,
	y: 0,
	width: 7,
	height: 10,
	color: 'white'
}

export default function RandomMatch() {
    const [socket, setSocket] = useState<Socket>();
    const [playerY, setPlayerY] = useState( canvasHeight / 2 - 50 );
    const [openentY, setOpenentY] = useState(  canvasHeight / 2 - 50 );
    let room = '';
    const ball = { x: canvasWidth / 2, y: canvasHeight / 2, };
	const Player = {  x: 10, y: canvasHeight / 2 - 50, width: 20, height: 150, color: 'white', score: 0 };
	const Opponent= { x: canvasWidth - 30, y: canvasHeight / 2 - 50, width: 20, height: 150, color: 'white', score: 0 };
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [ballMoving, setBall] = useState(false);

    const render = () =>  {
		const canvas = canvasRef.current;
		let context = canvas?.getContext('2d');
		drawTable(context, canvas, canvasHeight, canvasWidth, 'black');
		drawBall(context, ball.x, ball.y, 'white');
		drawRect(context, Player.x, playerY, Player.width, Player.height, Player.color);
		drawRect(context, Opponent.x, openentY, Opponent.width, Opponent.height, Opponent.color);
		drawNet(context, canvas, net.x, net.y, net.width, net.height, net.color);
        console.log(openentY, playerY)
	};
	
	const onCountdownEnd = () => {
		setBall(true);
	};

	useEffect(() => {
			const gameLoop = () => {
				render();
				// requestAnimationFrame(gameLoop);
			}
			gameLoop();
	}, [playerY, openentY]);
	

    const keyPress = (e: any) => {
        if (e.keyCode === 38 ) {
            console.log(socket);
            socket?.emit('move', { player: cookie.get('USER_ID'), direction: 'up', room: room });
        }
        else if (e.keyCode === 40 ) {
            socket?.emit('move', { player: cookie.get('USER_ID'), direction: 'down', room: room });
        }
    };

    useEffect(() => {
        const socketIo: Socket = io('http://localhost:3000/game', {
            auth: {
                token: cookie.get('USER_ID'),
            }
        });
        setSocket(socketIo);
        function cleanup() {
            window?.removeEventListener('keydown', keyPress);
            socketIo.disconnect();
        }
        return cleanup;
    }, []);

    useEffect(() => {
        if (!socket) return;
        window?.addEventListener('keydown', keyPress);
        socket.emit('RandomMatch', { data: 'hello' });
        function cleanup() {
            socket?.disconnect();
        }
        return cleanup;
    }, [socket]);

    useEffect(() => {
        if (socket) {
 /// TODO: fix this
            socket.on('RandomMatch', (data: any) => {
                if (data.player === cookie.get('USER_ID')) {
                    setPlayerY( data.playerY );
                    setOpenentY(data.opponentY );
                    room = data.room;
                }
                else {
                    setPlayerY(data.opponentY );
                    setOpenentY(data.playerY );
                    room = data.room;
                }
            });
            socket.on('PlayerMoved', (data: any) => {
                if (data.player === cookie.get('USER_ID')) {
                    setPlayerY(data.y);
                }
                else {
                    setOpenentY(data.y);
                }
            });
        }
        return () => {
        };
    }, [socket, playerY, openentY]);
    return (
		<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
			{ballMoving ? null : <Countdown onCountdownEnd={onCountdownEnd} />}
			<canvas className="w-full" ref={canvasRef} width={1080} height={720} />
		</div>
	)
}