'use client';
import React, { Component } from 'react';
import * as Phaser from 'phaser';
import { exit } from 'process';

class MainScene extends Phaser.Scene {
	countdownText: any | null = null;
	countdownValue: number = 3;
	W_key: any | null = null;
	S_key: any | null = null;
	Upkey: any | null = null;
	Downkey: any | null = null;
	leftpaddle: any | null = null;
	rightpaddle: any | null = null;
	ball: any | null = null;

	constructor() {
		super('PingPong');
	}

	startCountdown() {
		const countdownEvent = this.time.addEvent({
			delay: 1000, 
			repeat: this.countdownValue - 1,
			callback: () => {
				this.countdownText.setText(this.countdownValue.toString());
				this.countdownValue--;
				if (this.countdownValue == 0) {
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
		this.load.image('leftpaddle', 'assets/leftpaddle.png');
		this.load.image('rightpaddle', 'assets/rightpaddle.png');
		this.load.image('centerline', 'assets/centerline.png')
	}

	increaseBallSpeed() {
		this.ball.setVelocityX(this.ball.body.velocity.x * 1.1);
		this.ball.setVelocityY(this.ball.body.velocity.y * 1.1);
	}

	create() {
		let centerline = this.physics.add.sprite(500, 275, 'centerline');
		this.countdownText = this.add.text(440, 150, '', { fontFamily: 'Roboto', fontSize: '256px', color: '#D9923B' });
		this.startCountdown();
		if (this.input && this.input.keyboard){
			this.W_key = this.input.keyboard.addKey('W');
			this.S_key = this.input.keyboard.addKey('S');
			this.Upkey = this.input.keyboard.addKey('Up');
			this.Downkey = this.input.keyboard.addKey('Down');
		}
		this.ball = this.physics.add.sprite(500, 275, 'ball');
		this.increaseBallSpeed();
		this.leftpaddle = this.physics.add.sprite(20, 275, 'leftpaddle');
		this.leftpaddle.scaleY = 0.5;
		this.leftpaddle.body.setImmovable(true);
		this.rightpaddle = this.physics.add.sprite(980, 275, 'rightpaddle');
		this.rightpaddle.scaleY = 0.5;
		this.rightpaddle.body.setImmovable(true);
		this.ball.setCollideWorldBounds(true);
		this.physics.add.collider(this.ball, this.leftpaddle);
		this.physics.add.collider(this.ball, this.rightpaddle);

		this.leftpaddle.setCollideWorldBounds(true);
		this.rightpaddle.setCollideWorldBounds(true);

		this.leftpaddle = this.leftpaddle;
		this.rightpaddle = this.rightpaddle;
	}

	moveLeftPeddle(paddle: any, speed: number) {
		if (this.Upkey.isDown) {
			paddle.setVelocityY(-speed);
		} else if (this.Downkey.isDown) {
			paddle.setVelocityY(speed);
		} else {
			paddle.setVelocityY(0);
		}
	}

	moveRightPeddle(paddle: any, speed: number) {
		if (this.W_key.isDown) {
			paddle.setVelocityY(-speed);
		} else if (this.S_key.isDown) {
			paddle.setVelocityY(speed);
		} else {
			paddle.setVelocityY(0);
		}
	}

	CheckScoring(){
		if (this.ball.x < 30) {
			this.resetBallPosition();
		}
		else if (this.ball.x > 970) {
		 	this.resetBallPosition();
		}
	}

	resetBallPosition() {
		this.ball.x = 500;
		this.ball.y = 275;
		const velocityScale = 400;
		const randomVelocityX = Math.random() < 0.5 ? -1 : 1; 
		const randomVelocityY = Math.random() < 0.5 ? -1 : 1; 
		this.ball.setVelocity(randomVelocityX * velocityScale, randomVelocityY * velocityScale);
		this.ball.setBounce(1, 1);
		this.increaseBallSpeed();
	}


	update() {
		this.moveLeftPeddle(this.leftpaddle, 400);
		this.moveLeftPeddle(this.rightpaddle, 400);
		// this.moveRightPeddle(this.rightpaddle, 400);
		this.CheckScoring();
	}
	
}

class PongGame extends Component {
	private game?: Phaser.Game;

	componentDidMount() {
		// Create a Phaser game instance and add the MainScene to it
		const config = {
			type: Phaser.CANVAS,
			parent: 'game-container',
			width: 1000,
			height: 550,
			backgroundColor: '#000000',
			scene: [MainScene], // Use MainScene as the scene

			physics: {
				default: 'arcade',
				arcade: {
					// Add any physics configuration if needed
				},
			},
			audio: {
				noAudio: true,
				disableWebAudio: true,
			}
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
