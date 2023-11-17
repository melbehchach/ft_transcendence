'use client'
import { useEffect, useRef, useState, useCallback } from "react";
import { Socket, io } from "socket.io-client";
import cookie from 'js-cookie';
import Countdown from './countdown';
import { Player, Ball, Net } from '../../types';


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

const resetBallPosition = () => {
	ball.x = canvasWidth / 2;
	ball.y = canvasHeight / 2;
	ball.velocityX = -ball.velocityX;
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

let ball: Ball = {
	x: canvasWidth / 2,
	y: canvasHeight / 2,
	radius: 10,
	velocityX: 5,
	velocityY: 5,
	speed: 7,
	color: 'white'
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
		
		function cleanup() {
			socketIo.disconnect();
		}
		return cleanup;
	}, []);
	
	const update = useCallback(() => {
		if (!ballMoving) return;
		ball.x += ball.velocityX;
		ball.y += ball.velocityY;
		if (ball.y + ball.radius > canvasHeight || ball.y - ball.radius < 0) {
			ball.velocityY = -ball.velocityY;
		}
		const detectedCollision = (player: Player | null) => {
			if (!player) {
				return false;
			}
			const playerTop = player.y;
			const playerBottom = player.y + player.height;
			const playerLeft = player.x;
			const playerRight = player.x + player.width;
			
			const ballTop = ball.y - ball.radius;
			const ballBottom = ball.y + ball.radius;
			const ballLeft = ball.x - ball.radius;
			const ballRight = ball.x + ball.radius;
			
			return playerLeft < ballRight && playerTop < ballBottom && playerRight > ballLeft && playerBottom > ballTop;
		};
		
		let detectedPlayer = (ball.x + ball.radius < canvasWidth / 2) ? Player1 : Player2;
		if (detectedCollision(detectedPlayer)) {
			let collidePoint = ball.y - (detectedPlayer.y + detectedPlayer.height / 2);
			collidePoint = collidePoint / (detectedPlayer.height / 2);
			let angleRad = collidePoint * Math.PI / 4;
			let direction = (ball.x + ball.radius < canvasWidth / 2) ? 1 : -1;
			ball.velocityX = direction * ball.speed * Math.cos(angleRad);
			ball.velocityY = ball.speed * Math.sin(angleRad);
			ball.speed += 0.9;
		}
		if (ball.x - ball.radius < 0) {
			Player2.score++;
			resetBallPosition();
		}
		if (ball.x + ball.radius > canvasWidth) {
			Player1.score++;
			resetBallPosition();
		}
	}, [Player1, Player2, ball, net, ballMoving]);
	
	
	const render = useCallback(() => {
		const canvas = canvasRef.current;
		let context = canvas?.getContext('2d');
		drawTable(context, canvas, canvasHeight, canvasWidth, 'black');
		drawBall(context, ball.x, ball.y, ball.color);
		drawRect(context, Player1.x, Player1.y, Player1.width, Player1.height, Player1.color);
		drawRect(context, Player2.x, Player2.y, Player2.width, Player2.height, Player2.color);
		drawNet(context, canvas, net.x, net.y, net.width, net.height, net.color);
	}, [Player1, Player2, ball, net]);
	
	const onCountdownEnd = useCallback(() => {
		setBall(true);
	}, []);
	
	useEffect(() => {
		if (socket) {
			const gameLoop = () => {
				update();
				render();
				requestAnimationFrame(gameLoop);
			}
			gameLoop();
		}
		
		return () => {
			window?.removeEventListener('keydown', keyPress);
		};
	}, [socket, update, render, ballMoving]);
	
	const keyPress = (event: any) => {
		const playerId = cookie.get('USER_ID');
		if (event.key === 'ArrowUp' && Player1.y > 0) {
			socket?.emit('playerMoveUp', { key: event.key, id: playerId });
		}
		else if (event.key === 'ArrowDown' && Player1.y < canvasHeight - Player1.height ) {
			socket?.emit('playerMoveUp', { key: event.key, id: playerId });
		}
		else if (event.key === ' ') {
			socket?.emit('playerMoveUp', { key: event.key, x: ball.x, y: ball.y, velocityX: ball.velocityX, velocityY: ball.velocityY });
		}
	}
	
	useEffect(() => {
		if (socket) {
			window?.addEventListener('keydown', keyPress);
			socket?.on('playerReady', (data: any) => {
				if (data.playerId1 === cookie.get('USER_ID')) {
					Player1.y = data.player1Pos;
					Player2.y = data.player2Pos;
					Player1.id = data.playerId1;
					Player2.id = data.playerId2;
				} else {
					Player1.y = data.player2Pos;
					Player2.y = data.player1Pos;
					Player1.id = data.playerId2;
					Player2.id = data.playerId1;
				}
			});
			socket?.on('balldata', (data: any) => {
				ball.x = data.x;
				ball.y = data.y;
			});
			socket?.on('Up', (data: any) => {
				if (data.id === Player1.id) {
					Player1.y = data.player1Pos;
					ball.x = data.ballX;
					ball.y = data.ballY;
					ball.velocityX = data.ballVelocityX;
					ball.velocityY = data.ballVelocityY;
					ball.speed = data.ballSpeed;
					console.log(data);

				} else {
					Player2.y = data.player1Pos;
					ball.x = data.ballX;
					ball.y = data.ballY;
					ball.velocityX = data.ballVelocityX;
					ball.velocityY = data.ballVelocityY;
					ball.speed = data.ballSpeed;
				}
			});
		}
	}, [socket, Player1, Player2, ballMoving]);

	return (
		<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
			{ballMoving ? null : <Countdown onCountdownEnd={onCountdownEnd} />}
			<canvas tabIndex={0} ref={canvasRef} width={1080} height={720} />
		</div>
	)
}

