"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Socket, io } from "socket.io-client";
import cookie from "js-cookie";
import Countdown from "./countdown";
import { Player, Net } from "../../types";

const canvasWidth = 1080;
const canvasHeight = 720;

const drawTable = (
  context: any,
  canvas: any,
  x: number,
  y: number,
  color: string
) => {
  context.fillStyle = "black";
  context.fillRect(0, 0, canvasWidth, canvasHeight);
};

// draw the ball
const drawBall = (context: any, x: number, y: number, color: string) => {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, 20, 0, 2 * Math.PI, false);
  context.closePath();
  context.fill();
};

// draw the rectangle aka the paddle
const drawRect = (
  context: any,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
) => {
  context.beginPath();
  context.roundRect(x, y, width, height, 10);
  context.fillStyle = color;
  context.fill();
  context.closePath();
};

// draw the net
const drawNet = (
  context: any,
  canvas: any,
  x: number,
  y: number,
  width: number,
  height: number,
  color: string
) => {
  for (let i = 0; i <= canvasHeight; i += 20) {
    drawRect(context, x, y + i, width, height, color);
  }
};

let net: Net = {
  x: canvasWidth / 2 - 2 / 2,
  y: 0,
  width: 5,
  height: 10,
  color: "white",
};

export default function RandomMatch({ setOpponentScore, setPlayerScore, setLoading }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [socket, setSocket] = useState<Socket>();
  const [playerY, setPlayerY] = useState(canvasHeight / 2 - 50);
  const [openentY, setOpenentY] = useState(canvasHeight / 2 - 50);
  const Player : Player = {
    x: 10,
    y: canvasHeight / 2 - 50,
    width: 20,
    height: 150,
    color: "white",
    // score: 0,
  };
  const Opponent : Player = {
    x: canvasWidth - 30,
    y: canvasHeight / 2 - 50,
    width: 20,
    height: 150,
    color: "white",
  };
  const [countdown, setCountdown] = useState(true);
  const [ballY, setBallY] = useState(canvasHeight / 2);
  const [ballX, setBallX] = useState(canvasWidth / 2);

  let room = "";

  const render = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    drawTable(context, canvas, canvasHeight, canvasWidth, "black");
    drawBall(context, ballX, ballY, "white");
    drawRect(
      context,
      Player.x,
      playerY,
      Player.width,
      Player.height,
      Player.color
    ); // player
    drawRect(
      context,
      Opponent.x,
      openentY,
      Opponent.width,
      Opponent.height,
      Opponent.color
    ); // opponent
    drawNet(context, canvas, net.x, net.y, net.width, net.height, net.color);
  };

  const onCountdownEnd = useCallback(() => {
    setCountdown(false);
  }, []);


  useEffect(() => {
    const gameLoop = () => {
        setPlayerY((preV) => preV + (playerY - preV) * 0.6);
        setOpenentY((preV) => preV + (openentY - preV) * 0.6);
        render();
    };
    gameLoop();
  }, [countdown, playerY, openentY, ballX, ballY]);

  const keyPress = (e: any) => {
    if (e.keyCode === 38) {
      socket?.emit("move", {
        player: cookie.get("USER_ID"),
        direction: "up",
        room: room,
      });
    } else if (e.keyCode === 40) {
      socket?.emit("move", {
        player: cookie.get("USER_ID"),
        direction: "down",
        room: room,
      });
    }
  };

  useEffect(() => {
    const socketIo: Socket = io("http://localhost:3000/game", {
      auth: {
        token: cookie.get("USER_ID"),
      },
    });
    setSocket(socketIo);
    return () => {
      window?.removeEventListener("keydown", keyPress);
      socketIo.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    window?.addEventListener("keydown", keyPress);
    socket.emit("RandomMatch", { player: cookie.get("USER_ID"), room: room });
    return () => {
      socket?.disconnect();
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      socket.on("RandomMatch", (data: any) => {
        if (data.player === cookie.get("USER_ID")) {
          setPlayerY(data.playerY);
          setOpenentY(data.opponentY);
          room = data.room;
        } else {
          setPlayerY(data.opponentY);
          setOpenentY(data.playerY);
          room = data.room;
        }
      });
      socket.on("PlayerMoved", (data: any) => {
        if (data.player === cookie.get("USER_ID")) {
          setPlayerY(data.playerY);
          setOpenentY(data.opponentY);
        } else {
          setOpenentY(data.playerY);
          setPlayerY(data.opponentY);
        }
      });
      socket.on("BallMoved", (data: any) => {
        if (data.player === cookie.get("USER_ID")) {
          setBallX(data.x);
        } else {
          setBallX(canvasWidth - data.x);
        }
        setBallY(data.y);
      });
      socket.on("updateScore", (data: any) => {
        if (data.player === cookie.get("USER_ID")) {
          setPlayerScore(data.playerScore);
          setOpponentScore(data.opponentScore);
        } else {
          setPlayerScore(data.opponentScore);
          setOpponentScore(data.playerScore);
        }
      });
      socket.on("gameOver", (data: any) => {
        if (data.player === cookie.get("USER_ID")) {
          alert("You win");
        } else {
          alert("You lose");
        }
      });
      socket.on("gameStart", () => {
        setLoading(false);
      });
      socket.on("UnexpectedWinner", (data: any) => {
        if (data.winner === cookie.get("USER_ID")) {
          setPlayerScore(data.score)
          console.log("You win");
          // push the player to deashboard game to start a new game
        } 
      });
    }
  }, [socket]);

 

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      {countdown ? <Countdown onCountdownEnd={onCountdownEnd} /> : false}
      <canvas
        className="w-full h-full"
        ref={canvasRef}
        width={1080}
        height={720}
      />
    </div>
  );
}
