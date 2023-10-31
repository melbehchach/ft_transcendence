'use client';
import React, { Component } from 'react';
import * as Phaser from 'phaser';
import io from 'socket.io-client';

class MainScene extends Phaser.Scene {
	countdownText: any | null = null;
	countdownValue: number = 3;
	Upkey: any | null = null;
	Downkey: any | null = null;
	leftPaddle: any | null = null;
	rightPaddle: any | null = null;
	ball: any | null = null;
	socket: any | null = null;

	constructor() {
		super({ key: 'PingPong' });
	}

	startCountdown() {
		const countdownEvent = this.time.addEvent({
			delay: 1000,
			repeat: this.countdownValue - 1,
			callback: () => {
				this.countdownText.setText(this.countdownValue.toString());
				this.countdownValue--;
				if (this.countdownValue === 0) {
					this.countdownText.setVisible(false);
					countdownEvent.remove();
					this.ball.setVelocity(400, 200);
					this.ball.setBounce(1, 1);
				}
			},
		});
	}

	preload() {
		this.load.image('ball', 'assets/ball.png');
		this.load.image('rightpaddle', 'assets/rightpaddle.png');
		this.load.image('leftpaddle', 'assets/leftpaddle.png');
		this.load.image('centerline', 'assets/centerline.png');
	}

	increaseBallSpeed() {
		this.ball.setVelocityX(this.ball.body.velocity.x * 1.1);
		this.ball.setVelocityY(this.ball.body.velocity.y * 1.1);
	}

	create() {
		this.ball = this.physics.add.sprite(500, 275, 'ball');
		this.ball.setCollideWorldBounds(true);
		let centerline = this.add.image(500, 275, 'centerline');
		this.countdownText = this.add.text(440, 150, '', {
			fontFamily: 'Roboto',
			fontSize: '256px',
			color: '#D9923B',
		});
		this.startCountdown();

		if (this.input && this.input.keyboard) {
			this.Upkey = this.input.keyboard.addKey('Up');
			this.Downkey = this.input.keyboard.addKey('Down');
		}

		this.socket = io('http://localhost:3000');
		this.socket.emit('JoinGame', { id: this.socket.id });
		this.socket.on('playerConnected', (data: any) => {
			if (data.id === this.socket.id) {
				console.log('You are player 1', data.id);
				this.leftPaddle = this.physics.add.sprite(950, 275, 'leftpaddle');
				this.leftPaddle.setImmovable(true);
				this.leftPaddle.setCollideWorldBounds(true);
				this.physics.add.collider(this.ball, this.leftPaddle);
			} else {
				console.log('You are player 2', data.id);
				this.rightPaddle = this.physics.add.sprite(50, 275, 'rightpaddle');
				this.rightPaddle.setImmovable(true);
				this.rightPaddle.setCollideWorldBounds(true);
				this.physics.add.collider(this.ball, this.rightPaddle);
			}
		});
		this.socket.on('joinedGame', (data : any) => {
			const roomName = data.roomName;
			console.log(`Joined room: ${roomName}`);
		});
	}

	movePaddle(paddle: any, speed: number) {
		if (paddle) {
			if (this.Upkey.isDown) {
				paddle = -speed;
			} else if (this.Downkey.isDown) {
				paddle = speed;
			}
		}
	}


	checkScoring() {
		if (this.ball.x < 30) {
			this.resetBallPosition();
		} else if (this.ball.x > 970) {
			this.resetBallPosition();
		}
	}

	resetBallPosition() {
		this.ball.setPosition(500, 275);
		const velocityScale = 400;
		const randomVelocityX = Math.random() < 0.5 ? -1 : 1;
		const randomVelocityY = Math.random() < 0.5 ? -1 : 1;
		this.ball.setVelocity(randomVelocityX * velocityScale, randomVelocityY * velocityScale);
		this.ball.setBounce(1, 1);
		this.increaseBallSpeed();
	}

	update() {
		this.movePaddle(this.leftPaddle, 400);
		this.movePaddle(this.rightPaddle, 400);
		this.checkScoring();
	}
}

class PongGame extends Component {
	private game?: Phaser.Game;

	componentDidMount() {
		// Create a Phaser game instance and add the MainScene to it
		const config: Phaser.Types.Core.GameConfig = {
			type: Phaser.CANVAS,
			parent: 'game-container',
			width: 1000,
			height: 550,
			backgroundColor: '#000000',
			scene: [MainScene],
			physics: {
				default: 'arcade',
				arcade: {
					// Add any physics configuration if needed
				},
			},
			audio: {
				noAudio: true,
				disableWebAudio: true,
			},
		};

		this.game = new Phaser.Game(config);
	}

	componentWillUnmount() {
		// Destroy the Phaser game instance when the component unmounts
		if (this.game) {
			this.game.destroy(true);
		}
	}

	render() {
		return (
			<div id="game-container" className="flex justify-center items-center w-screen h-screen bg-background">
				<div>
					{/* Add your game content here */}
				</div>
			</div>
		);
	}
}

export default PongGame;
