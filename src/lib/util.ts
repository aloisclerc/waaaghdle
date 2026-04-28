import { GuessResult } from "@/app/pages/GuessTable"
import units from '@/src/data/units.json'

export type Unit = {
  name: string
  faction: string
  role: string
  points: number
}

export function getDailyUnit() {
    const start = new Date("2024-01-01")
    const today = new Date()
  
    const diff = Math.floor(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    )
    return units[diff % units.length]
  }

export function getUnitByName(name: string): Unit{ 
  return units.find(e => e.name === name) || {name: '', faction: '', role: '', points: 0}
}

  export function evaluateGuess(guess: Unit, answer: Unit): GuessResult {
  return {
    nameValue: guess.name,
    factionValue: guess.faction,
    roleValue: guess.role,
    pointsValue: guess.points,
    name: guess.name === answer.name ? "correct" : "wrong",
    faction: guess.faction === answer.faction ? "correct" : "wrong",
    role: guess.role === answer.role ? "correct" : "wrong",
    points:
      guess.points === answer.points
        ? "correct"
        : guess.points < answer.points
        ? "higher"
        : "lower",
  }
}