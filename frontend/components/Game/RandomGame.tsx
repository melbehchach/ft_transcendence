"use client";
import { useEffect, useRef, useState} from "react";
import { Socket, io } from "socket.io-client";
import cookie from "js-cookie";
import { Player, Net } from "../../types";
import axios from "axios";
import { useAuth } from "../../app/context/AuthContext";

const canvasWidth = 1080;
const canvasHeight = 720;

const drawTable = (
  context: any,
  canvas: any,
  x: number,
  y: number,
  color: string
) => {
  context.fillStyle = color;
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


export default function RandomMatch({
  setOpponentScore,
  setPlayerScore,
  setPlayerAvatar,
  setOpponnetAvatr,
  setLoading,
  setrules,
  setIssue,
  issue,
}: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [socket, setSocket] = useState<Socket>();
  const [playerY, setPlayerY] = useState(canvasHeight / 2 - 50);
  const [openentY, setOpenentY] = useState(canvasHeight / 2 - 50);
  const {state:{user}} = useAuth();

  const upadateTotalWinsAndLoses = async (
    winnerId: string,
    loserId: string
  ) => {
    await axios
      .post(
        `http://localhost:3000/game/endGame`,
        {
          winnerId: winnerId,
          loserId: loserId,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        console.log("res", res);
      })
      .catch((error) => {
        console.log("ending game error");
      });
  };

  const Player: Player = {
    x: 10,
    y: canvasHeight / 2 - 50,
    width: 20,
    height: 150,
    color: "white",
  };
  const Opponent: Player = {
    x: canvasWidth - 30,
    y: canvasHeight / 2 - 50,
    width: 20,
    height: 150,
    color: "white",
  };
  const [ballY, setBallY] = useState(canvasHeight / 2);
  const [ballX, setBallX] = useState(canvasWidth / 2);
  let room = "";

  const render = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (user.gameTheme === "Retro") {
      drawTable(context, canvas, canvasHeight, canvasWidth, "#000");
      drawRect(
        context,
        Player.x,
        playerY,
        Player.width,
        Player.height,
        Player.color
      );
      drawRect(
        context,
        Opponent.x,
        openentY,
        Opponent.width,
        Opponent.height,
        Opponent.color
      );
      drawNet(context, canvas, net.x, net.y, net.width, net.height, net.color);
      drawBall(context, ballX, ballY, "white");
    } else if (user.gameTheme === "Blue") {
      drawTable(context, canvas, canvasHeight, canvasWidth, "#056CF2");
      drawRect(
        context,
        Player.x,
        playerY,
        Player.width,
        Player.height,
        Player.color
      );
      drawRect(
        context,
        Opponent.x,
        openentY,
        Opponent.width,
        Opponent.height,
        Opponent.color
      );
      drawNet(context, canvas, net.x, net.y, net.width, net.height, net.color);
      drawBall(context, ballX, ballY, "white");
    } else if (user.gameTheme === "Gray") {
      drawTable(context, canvas, canvasHeight, canvasWidth, "#4D5960");
      drawRect(
        context,
        Player.x,
        playerY,
        Player.width,
        Player.height,
        Player.color
      );
      drawRect(
        context,
        Opponent.x,
        openentY,
        Opponent.width,
        Opponent.height,
        Opponent.color
      );
      drawBall(context, ballX, ballY, "white");
    }
  };

  useEffect(() => {
    const gameLoop = () => {
      setPlayerY((preV) => preV + (playerY - preV) * 0.6);
      setOpenentY((preV) => preV + (openentY - preV) * 0.6);
      render();
    };
    gameLoop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerY, openentY, ballX, ballY]);

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
            setPlayerAvatar(data.playerAvatr);
            setOpponnetAvatr(data.opponentAvatar);
            setPlayerY(data.playerY);
            setOpenentY(data.opponentY);
            room = data.room;
          } else {
            setPlayerAvatar(data.opponentAvatar);
            setOpponnetAvatr(data.playerAvatr);
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
      socket.on("CheckingWinner", (data: any) => {
        if (data.player === cookie.get("USER_ID") && data.playerScore === 3) {
          console.log("Winner");
          upadateTotalWinsAndLoses(data.player, data.opponent);
        } else if (
          data.opponent === cookie.get("USER_ID") &&
          data.opponentScore === 3
        ) {
          console.log("Winner");
          upadateTotalWinsAndLoses(data.opponent, data.player);
        }
      });
      socket.on("gameStart", () => {
        setLoading(false);
        setrules(true);
        setTimeout(() => {
            socket.on("BallMoved", (data: any) => {
              if (data.player === cookie.get("USER_ID")) {
                setBallX(data.x);
              } else {
                setBallX(canvasWidth - data.x);
              }
              setBallY(data.y);
            });
            socket.on("updateScore", (data: any) => {
              console.log("player", data.playerScore, "opponent", data.opponentScore);
              if (data.player === cookie.get("USER_ID")) {
                setPlayerScore(data.playerScore);
                setOpponentScore(data.opponentScore);
              } else {
                setPlayerScore(data.opponentScore);
                setOpponentScore(data.playerScore);
              }
            });
        }, 5000);         
      });
      socket.on("PlayerDisconnected", (data: any) => {
        setIssue(true);
        socket.off("BallMoved");
        socket.off("updateScore");
      });
      socket.on("OpponentDisconnected", (data: any) => {
        setIssue(true);
        socket.off("BallMoved");
        socket.off("updateScore");
      });
      socket.on("SubmiteScore", (data: any) => {
        socket.emit("GameIsOver", { data });
      });
    }
  }, [socket]);

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <canvas
        className="w-full h-full"
        ref={canvasRef}
        width={1080}
        height={720}
      />
    </div>
  );
}
