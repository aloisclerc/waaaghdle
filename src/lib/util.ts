import { GuessResult } from "@/app/table"

export type Unit = {
  name: string
  faction: string
  role: string
  points: number
}

export function getDailyUnit(units: any[]) {
    const start = new Date("2024-01-01")
    const today = new Date()
  
    const diff = Math.floor(
      (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    )
  
    return units[diff % units.length]
  }

  export function evaluateGuess(guess: Guess, answer): GuessResult {
  return {
    nameValue: guess.name
    faction: guess.faction === answer.faction,
    role: guess.role === answer.role,
    points:
      guess.points === answer.points
        ? "correct"
        : guess.points < answer.points
        ? "higher"
        : "lower",
  }
}