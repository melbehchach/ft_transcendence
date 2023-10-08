'use client';
import React, { Component } from 'react';
import * as Phaser from 'phaser';

let countdownValue: number = 3; 
class MainScene extends Phaser.Scene {
	countdownText: any;
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
			repeat: countdownValue - 1,
			callback: () => {
				this.countdownText.setText(countdownValue.toString());
				countdownValue--;
				if (countdownValue == 0) {
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
		this.load.image('paddle', 'assets/leftpaddle.png');
		this.load.image('paddle', 'assets/rightpaddle.png');
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
			this.Upkey = this.input.keyboard.addKey('W');
			this.Downkey = this.input.keyboard.addKey('S');
		}
		this.ball = this.physics.add.sprite(500, 275, 'ball');
		this.increaseBallSpeed();
		this.leftpaddle = this.physics.add.sprite(20, 275, 'paddle');
		this.leftpaddle.scaleY = 0.5;
		// this.leftpaddle.setName('leftpaddle');
		this.leftpaddle.body.setImmovable(true);
		this.rightpaddle = this.physics.add.sprite(980, 275, 'paddle');
		this.rightpaddle.scaleY = 0.5;
		// this.rightpaddle.setName('rightpaddle');
		this.rightpaddle.body.setImmovable(true);
		this.ball.setCollideWorldBounds(true);
		this.physics.add.collider(this.ball, this.leftpaddle);
		this.physics.add.collider(this.ball, this.rightpaddle);

		this.leftpaddle.setCollideWorldBounds(true);
		this.rightpaddle.setCollideWorldBounds(true);

		this.leftpaddle = this.leftpaddle;
		this.rightpaddle = this.rightpaddle;
	}


	movePeddle(paddle: any, speed: number) {
		if (this.Upkey.isDown) {
			paddle.setVelocityY(-speed);
		} else if (this.Downkey.isDown) {
			paddle.setVelocityY(speed);
		} else {
			paddle.setVelocityY(0);
		}
	}

	update() {
		this.movePeddle(this.leftpaddle, 400);
		this.movePeddle(this.rightpaddle, 400);
	}
	
}

class PongGame extends Component {
	private game?: Phaser.Game;

	componentDidMount() {
		// Create a Phaser game instance and add the MainScene to it
		const config = {
			type: Phaser.AUTO,
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
