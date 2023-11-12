'use client';
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import cookie from 'js-cookie';

const canvasWidth = 1080;
const canvasHeight = 720;
let canvas: any;
let Player1: any = {
	id: '',
	x: 10,
	y: canvasHeight / 2 - 100 / 2,
	width: 20,
	height: 150,
	color: 'white',
	score: 0,
}

let Player2: any = {
	id : '',
	x: canvasWidth - 30,
	y: canvasHeight / 2 - 100 / 2,
	width: 20,
	height: 150,
	color: 'white',
	score: 0,
}

let ball: any = {
	x: canvasWidth / 2,
	y: canvasHeight / 2,
	radius: 10,
	velocityX: 5,
	velocityY: 5,
	speed: 7,
	color: 'white'
}

let net: any = {
	x: canvasWidth / 2 - 2 / 2,
	y: 0,
	width: 7,
	height: 10,
	color: 'white'
}
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

// detected the collision between the ball and the paddle
const detectedCollision = (player: any) => {
	if (player) {
		player.top = player?.y;
		player.bottom = player.y + player.height;
		player.left = player.x;
		player.right = player.x + player.width;
	}

	ball.top = ball.y - ball.radius;
	ball.bottom = ball.y + ball.radius;
	ball.left = ball.x - ball.radius;
	ball.right = ball.x + ball.radius;

	return player.left < ball.right && player.top < ball.bottom && player.right > ball.left && player.bottom > ball.top;
};

// reset the ball position
const resetBallPosition = () => {
	ball.x = canvasWidth / 2;
	ball.y = canvasHeight / 2;
	ball.speed = 7;
	ball.velocityX = -ball.velocityX;
};

function useSocket(url: string) {
	const [socket, setSocket] = useState();
  
	useEffect(() => {
	  const socketIo: any = io(url, {
		auth: {
		  token: cookie.get('USER_ID'),
	  }});
	  setSocket(socketIo)
  
	  function cleanup() {
		socketIo.disconnect()
	  }
	  return cleanup

	}, [])
  
	return socket
}

/// START GAME !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
export default function PingPong() {
	let canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		canvas = canvasRef.current;
		let context = canvas?.getContext('2d');
		function update() {
			ball.x += ball.velocityX;
			ball.y += ball.velocityY;
			if (ball.y + ball.radius > canvasHeight || ball.y - ball.radius < 0)
				ball.velocityY = -ball.velocityY;
			let detectedPlayer = (ball.x + ball.radius < canvasWidth / 2) ? Player1 : Player2;
			if (detectedCollision(detectedPlayer)) {
				let collidePoint = ball.y - (detectedPlayer.y + detectedPlayer.height / 2);
				collidePoint = collidePoint / (detectedPlayer.height / 2);
				let angleRad = collidePoint * Math.PI / 4;
				let direction = (ball.x + ball.radius < canvasWidth / 2) ? 1 : -1;
				ball.velocityX = direction * ball.speed * Math.cos(angleRad);
				ball.velocityY = ball.speed * Math.sin(angleRad);
				ball.speed += 0.2;
			}
			if (ball.x - ball.radius < 0) {
				Player2.score++;
				resetBallPosition();
			}
			if (ball.x + ball.radius > canvasWidth) {
				Player1.score++;
				resetBallPosition();
			}
		}

		function render() {
			drawTable(context, canvas, canvasHeight, canvasWidth, 'black');
			drawBall(context, ball.x, ball.y, ball.color);
			drawRect(context, Player1.x, Player1.y, Player1.width, Player1.height, Player1.color);
			drawRect(context, Player2.x, Player2.y, Player2.width, Player2.height, Player2.color);
			drawNet(context, canvas, net.x, net.y, net.width, net.height, net.color);
		}

		const framePerSecond = 50;
		setInterval(() => {
			update();
			render();
		}, 1000 / framePerSecond);

	}, []);

	let socketCli: any = useSocket('localhost:3000');

	const playerId = cookie.get('USER_ID');
	socketCli?.on('playerReady', (data: any) => {
		if (data.playerId1 === playerId){
			Player1.y = data.player1Pos;
			Player2.y = data.player2Pos;
		}else {
			Player1.y = data.player2Pos;
			Player2.y = data.player1Pos;
		}
		Player1.id = data.playerId1
		Player2.id = data.playerId2
	});

	canvas?.addEventListener('keydown', (e:any) => {
		if (playerId === Player1.id) {
			if (e.key === 'ArrowUp' && Player1.y > 0) {
				socketCli?.emit('playerMoveUp', {id1: Player1.id});
			}
		} else if (playerId === Player2.id) {
			if (e.key === 'ArrowUp' && Player2.y > 0) {
				socketCli?.emit('playerMoveUp', {id2: Player2.id});
			}
		}
	});

	canvas?.addEventListener('keydown', (e:any) => {
		socketCli?.on('Up', (data: any) => {
			if (data.id1 === playerId) {
				if (Player1.y > 0 && e.key === 'ArrowUp')
					Player1.y = data.pos1;
			} else if (data.id2 === playerId) {
				if (Player1.y > 0 && e.key === 'ArrowUp')
					Player2.y = data.pos2;
			}
		})
	});


	return (
		<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
			<canvas tabIndex={0} ref={canvasRef} width={1080} height={720} />
		</div>
	)
}