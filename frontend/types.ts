export interface User {
  email: string;
  username: string;
  avatar: string;
}

export interface Player {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;
	score: number;
}

export interface Ball {
	x: number;
	y: number;
	radius: number;
	velocityX: number;
	velocityY: number;
	speed: number;
	color: string;
}

export interface Net {
	x: number;
	y: number;
	width: number;
	height: number;
	color: string;
}
