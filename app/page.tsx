"use client"

import { useEffect, useState } from "react"
import units from "../src/data/units.json"
import {GuessTable, GuessResult} from "./table"
import { Unit } from "@/src/lib/util"

export default function Home() {
  const [query, setQuery] = useState("")
  const [filtered, setFiltered] = useState<Unit[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [guesses, setGuesses] = useState<GuessResult[]>([])

  useEffect(() => {
    if (!query) {
      setFiltered([])
      return
    }

    const results = units.filter((u) =>
      u.name.toLowerCase().includes(query.toLowerCase())
    )

    setFiltered(results.slice(0, 5))
  }, [query])

  const handleSelect = (name: string) => {
    setQuery(name)
    setShowDropdown(false)
    enterGuess(name)
  }

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      console.log('Enter key pressed!');
      enterGuess(query);
      
    }
  };

  const enterGuess = (name: string) => {
    const newGuess:GuessResult = {name: "correct", faction: "correct", role: "correct", points: "correct", nameValue: name, factionValue: "Space Marines", roleValue: "Battleline", pointsValue: 85};
      setGuesses(prevGuesses => [newGuess, ...prevGuesses]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-900 text-white px-4">
      {/* Header */}
      <h1 className="text-4xl font-bold mb-8 tracking-wide">
        Waaaghdle
      </h1>

      {/* Input + dropdown container */}
      <div className="w-full max-w-md relative">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowDropdown(true)
          }}
          onFocus={() => setShowDropdown(true)}
          onKeyUp={handleEnter}
          placeholder="Guess a unit..."
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-lg outline-none focus:border-white"
        />

        {/* Dropdown */}
        {showDropdown && filtered.length > 0 && (
          <ul className="absolute z-10 mt-2 w-full rounded-lg border border-neutral-700 bg-neutral-800 shadow-lg">
            {filtered.map((unit, i) => (
              <li
                key={i}
                onClick={() => handleSelect(unit.name)}
                className="cursor-pointer px-4 py-2 hover:bg-neutral-700"
              >
                {unit.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {guesses.length > 0 && <GuessTable guesses={guesses}></GuessTable>}
      
    </main>
  )
}

