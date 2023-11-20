'use client'
import { useEffect, useRef, useState, useCallback, use } from "react";
import { Socket, io } from "socket.io-client";
import cookie from 'js-cookie';
import Countdown from './countdown';
import { Player, Net } from '../../types';

const canvasWidth = 1080;
const canvasHeight = 720;

// draw the game table
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
	context.fillStyle = color;
	context.fillRect(x, y, width, height);
}

// draw the net
const drawNet = (context: any, canvas: any, x: number, y: number, width: number, height: number, color: string) => {
	for (let i = 0; i <= canvasHeight; i += 25) {
		drawRect(context, x, y + i, width, height, color);
	}
}

let ball  = {
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    color: 'white',
}

let Player1: Player = {
	id: '',
	x: 10,
	y: canvasHeight / 2 - 100 / 2,
	width: 20,
	height: 150,
	color: 'white',
	score: 0,
}

let Player2: Player = {
	id: '',
	x: canvasWidth - 30,
	y: canvasHeight / 2 - 100 / 2,
	width: 20,
	height: 150,
	color: 'white',
	score: 0,
}

let net: Net = {
	x: canvasWidth / 2 - 2 / 2,
	y: 0,
	width: 7,
	height: 10,
	color: 'white'
}

export default function PingPong() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [socket, setSocket] = useState<Socket>();
	const [ballMoving, setBall] = useState(false);
	
	useEffect(() => {
		const socketIo: any = io('localhost:3000', {
			auth: {
				token: cookie.get('USER_ID'),
			}
		});
		setSocket(socketIo);
		// if (socketIo)
		// 	socketIo?.emit('ballData', { x: ball.x, y: ball.y })
		function cleanup() {
			socketIo.disconnect();
		}
		return cleanup;
	}, []);
	
	useEffect(() => {
		if (!socket)  return;
		function cleanup() {
			socket?.disconnect();
		}
		return cleanup;
	}, [socket]);
	
	const render = useCallback(() => {
		const canvas = canvasRef.current;
		let context = canvas?.getContext('2d');
		drawTable(context, canvas, canvasHeight, canvasWidth, 'black');
		drawBall(context, ball.x, ball.y, 'white');
		drawRect(context, Player1.x, Player1.y, Player1.width, Player1.height, Player1.color);
		drawRect(context, Player2.x, Player2.y, Player2.width, Player2.height, Player2.color);
		drawNet(context, canvas, net.x, net.y, net.width, net.height, net.color);
	}, [Player1, Player2, net, ball]);
	
	const onCountdownEnd = useCallback(() => {
		setBall(true);
	}, []);

	useEffect(() => {
		if (socket) {
			const gameLoop = () => {
				render();
				requestAnimationFrame(gameLoop);
			}
			gameLoop();
		}
		return () => {
			window?.removeEventListener('keydown', keyPress);
		};
	}, [socket, render, ballMoving]);
	
	const keyPress = (event: any) => {
		const playerId = cookie.get('USER_ID');
		if (event.key === 'ArrowUp' && Player1.y > 0 && Player2.y > 0) {
			socket?.emit('playerMove', { key: event.key, id: playerId });
		}
		else if (event.key === 'ArrowDown' && Player1.y < canvasHeight - Player1.height && Player2.y < canvasHeight - Player2.height) {
			socket?.emit('playerMove', { key: event.key, id: playerId });
		}
	}
	
	useEffect(() => {
		if (socket) {
			window?.addEventListener('keydown', keyPress);
			socket?.on('players', (data: any) => {
				if (data.id1 === cookie.get('USER_ID')) {
					Player1.y = data.y1;
					Player2.y = data.y2;
					Player1.id = data.id;
					Player2.id = data.id2;
				}else{
					Player1.y = data.y2;
					Player2.y = data.y1;
					Player1.id = data.id2;
					Player2.id = data.id;
				}
			});
			socket?.on('UpdatePlayerMove', (data: any) => {
				if (data.id === Player1.id) {
					Player1.y = data.y;
				} else {
					Player2.y = data.y;
				}
			});
			socket?.on('ball', (data: any) => {
				ball.x = data.x
				ball.y = data.y
			});
		}
	}, [socket, Player1, Player2, ball, ballMoving]);

	return (
		<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
			{ballMoving ? null : <Countdown onCountdownEnd={onCountdownEnd} />}
			<canvas className="w-full" ref={canvasRef} width={1080} height={720} />
		</div>
	)
}
