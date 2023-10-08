'use client';
import React, { Component } from 'react';
import * as Phaser from 'phaser';

// Define a Phaser scene class
class MainScene extends Phaser.Scene {
	constructor() {
		super('PingPong');
	}

	preload() {
		this.load.image('leftpaddle', '/Game/assets/leftpaddle.png');
		this.load.image('rightpaddle', '/Game/assets/rightpaddle.png');
		this.load.image('ball', '/Game/assets/ball.png');
		this.load.image('centerline', '/Game/assets/centerline.png');
	}

	create() {
	

		let leftPaddle = this.physics.add.image(50, 275, 'leftpaddle');
		let rightPaddle = this.physics.add.image(950, 275, 'rightpaddle');
		this.add.image(500, 275, 'centerline');
		let ball = this.physics.add.image(500, 275, 'ball');
		ball.setVelocity(300, 300);
		ball.setBounce(1, 1);
		ball.setCollideWorldBounds(true);
		leftPaddle.setCollideWorldBounds(true);
		rightPaddle.setCollideWorldBounds(true);
		leftPaddle.setImmovable();
		rightPaddle.setImmovable();

		this.add.text(400, 50, 'Pong', { fontSize: '50px', color: '#ffffff' });
		this.scene.start('PingPong');
		
	}

	update() {
		// Add your game logic here

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
