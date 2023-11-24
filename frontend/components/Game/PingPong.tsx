// 'use client'
// import { useEffect, useRef, useState, useCallback} from "react";
// import { Socket, io } from "socket.io-client";
// import cookie from 'js-cookie';
// import Countdown from './countdown';
// import { Player, Net } from '../../types';

// const canvasWidth = 1080;
// const canvasHeight = 720;


// let net: Net = {
// 	x: canvasWidth / 2 - 2 / 2,
// 	y: 0,
// 	width: 7,
// 	height: 10,
// 	color: 'white'
// }

// export default function PingPong(props: any) {
// 	const ball = { x: canvasWidth / 2, y: canvasHeight / 2, };
// 	const Player = {  x: 10, y: props.playerY, width: 20, height: 100, color: 'white', score: 0 };
// 	const Opponent= { x: canvasWidth - 30, y: props.openentY, width: 20, height: 100, color: 'white', score: 0 };
// 	const canvasRef = useRef<HTMLCanvasElement>(null);
// 	const [ballMoving, setBall] = useState(false);
// 	// useEffect(() => {
// 	// 	const socketIo: Socket = io('localhost:3000', {
// 	// 		auth: {
// 	// 			token: cookie.get('USER_ID'),
// 	// 		}
// 	// 	});
// 	// 	setSocket(socketIo);
// 	// 	function cleanup() {
// 	// 		socketIo.disconnect();
// 	// 	}
// 	// 	return cleanup;
// 	// }, []);
	
// 	// useEffect(() => {
// 	// 	if (!socket)  return;
// 	// 	function cleanup() {
// 	// 		socket?.disconnect();
// 	// 	}
// 	// 	return cleanup;
// 	// }, [socket]);
	
// 	// const render = useCallback(() => {
// 	// 	const canvas = canvasRef.current;
// 	// 	let context = canvas?.getContext('2d');
// 	// 	drawTable(context, canvas, canvasHeight, canvasWidth, 'black');
// 	// 	drawBall(context, ball.x, ball.y, 'white');
// 	// 	drawRect(context, Player.x, props.playerY, Player.width, Player.height, Player.color);
// 	// 	drawRect(context, Opponent.x, props.openentY, Opponent.width, Opponent.height, Opponent.color);
// 	// 	drawNet(context, canvas, net.x, net.y, net.width, net.height, net.color);
// 	// 	requestAnimationFrame(render);
// 	// 	console.log(props.playerY, props.openentY, ":playerY, openentY");
// 	// }, [Player, Opponent, net, ball]);
	
// 	const onCountdownEnd = useCallback(() => {
// 		setBall(true);
// 	}, []);

// 	useEffect(() => {
// 		// if (socket) {
// 			const gameLoop = () => {
// 				// render();
// 				// requestAnimationFrame(gameLoop);
// 			}
// 			gameLoop();
// 		// }
// 		return () => {
// 		};
// 	}, [ballMoving]);
	

// 	// useEffect(() => {
// 	// 	if (socket) {
// 	// 		// window?.addEventListener('keydown', keyPress);
// 	// 		socket?.on('RandomMatch', (data: any) => {
// 	// 			console.log(cookie.get('USER_ID'));
// 	// 			// if (data.id === cookie.get('USER_ID')) {
// 	// 			// 	Player.y = data.player
// 	// 			// 	Opponent.y = data.opponent;
// 	// 			// 	Player.id = data.player
// 	// 			// 	Opponent.id = data.opponent;
// 	// 			// } else {
// 	// 			// 	Player.y = data.opponent;
// 	// 			// 	Opponent.y = data.player;
// 	// 			// 	Player.id = data.opponent;
// 	// 			// 	Opponent.id = data.player;
// 	// 			// }
// 	// 		});
// 	// 		// socket?.on('UpdatePlayerMove', (data: any) => {
// 	// 		// 	const playerId = cookie.get('USER_ID');
// 	// 		// 	if (playerId === data.id) {
// 	// 		// 		Player1.y = data.y;
// 	// 		// 		// Player2.y = data.y1;

// 	// 		// 	} else {
// 	// 		// 		Player1.y = data.y;
// 	// 		// 		// Player1.y = data.y1;
// 	// 		// 	}
// 	// 		// });
// 	// 		// socket?.on('ball', (data: any) => {
// 	// 		// 	if (ballMoving) {
// 	// 		// 		ball.x = data.x
// 	// 		// 		ball.y = data.y
// 	// 		// 	}
// 	// 		// });
// 	// 	}
// 	// }, [socket, Player, Opponent, ball, ballMoving]);

// 	return (
// 		<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
// 			{ballMoving ? null : <Countdown onCountdownEnd={onCountdownEnd} />}
// 			<canvas className="w-full" ref={canvasRef} width={1080} height={720} />
// 		</div>
// 	)
// }
