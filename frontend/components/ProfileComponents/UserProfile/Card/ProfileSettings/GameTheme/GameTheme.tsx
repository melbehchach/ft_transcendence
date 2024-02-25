import React from 'react'
import DarkTheme from './DarkTheme'
import LightTheme from './LightTheme'
import GrayTheme from './GrayTheme'

type props = {
  theme: string;
  setTheme: any;
}

function GameTheme({them, setTheme}) {
  function handleClick(newTheme: string) {
    setTheme(newTheme);
  }

  return (
    <div className="flex flex-col justify-center gap-[0.5rem] text-xl font-light">
    <h1>Game theme: </h1>
    <div className="flex flex-row gap-[1.2rem]">
      <button className={them === "Retro" ? "border-4 border-orange-300" : ""} onClick={() => handleClick("Retro")}>
        <DarkTheme />
      </button>
      <button className={them === "Blue" ? "border-4 border-orange-300" : ""} onClick={() => handleClick("Blue")}>
        <LightTheme />
      </button>
      <button className={them === "Gray" ? "border-4 border-orange-300" : ""} onClick={() => handleClick("Gray")}>
        <GrayTheme />
      </button>
    </div>
  </div>
  )
}

export default GameTheme