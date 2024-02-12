import React from 'react'
import DarkTheme from './DarkTheme'
import LightTheme from './LightTheme'
import GrayTheme from './GrayTheme'

function GameTheme() {
  return (
    <div className="flex flex-col justify-center gap-[0.5rem] text-xl font-light">
    <h1>Game theme: </h1>
    <div className="flex flex-row gap-[1.2rem]">
      <button>
        <DarkTheme />
      </button>
      <button>
        <LightTheme />
      </button>
      <button>
        <GrayTheme />
      </button>
    </div>
  </div>
  )
}

export default GameTheme