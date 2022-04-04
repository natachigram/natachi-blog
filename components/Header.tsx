import React from 'react'
import Link from 'next/link'

const Header = () => {
  return (
    <div className="flex-column h-full w-full items-center   md:flex md:items-center md:justify-between ">
      <div className=" hidden md:flex md:basis-3/4 md:justify-center">
        <img
          className="  h-full w-4/5 object-center"
          src="https://cdn3d.iconscout.com/3d/premium/thumb/developer-coffee-cup-4437221-3684943.png"
          alt=""
        />
      </div>

      <div className="basis-3/4  py-10 ">
        <h1 className="text-center text-4xl font-bold text-zinc-900 md:text-left md:text-7xl ">
          The Great Noise Made By Frontend Devs.
        </h1>
        <p className="mt-4 text-center font-semibold text-zinc-900 md:max-w-lg md:text-left md:text-lg">
          An infinite loop of modules filled with gibberish made by keyboard
          obessed freaks called...
        </p>
      </div>
    </div>
  )
}

export default Header
