import { FlipCell } from "./FlipCell"
import { GuessRow } from "./GuessRow"


export type GuessResult = {
  name: "correct" | "wrong"
  faction: "correct" | "wrong"
  role: "correct" | "wrong"
  points: "correct" | "higher" | "lower"
  nameValue: string
  factionValue: string
  roleValue: string
  pointsValue: number
}

const getCellStyle = (value: string) => {
  switch (value) {
    case "correct":
      return "bg-green-600 text-white"
    case "wrong":
      return "bg-red-700 text-white"
    case "higher":
      return "bg-yellow-600 text-white"
    case "lower":
      return "bg-yellow-600 text-white"
    default:
      return "bg-neutral-800 text-white"
  }
}

export function GuessTable({ guesses, turn }: { guesses: GuessResult[], turn: number }) {
  return (
    <div className="w-full max-w-2xl mt-10">
      <table className="w-full text-center">
        <tbody>
          <tr>
            <th>Unit Name</th>
            <th>Faction</th>
            <th>Role</th>
            <th>Points</th>
          </tr>
          {guesses.map((g, i) => (
            <GuessRow key={i} rowNum={i} guess={g} getCellStyle={getCellStyle} trigger={turn} />
          ))}
        </tbody>
      </table>
    </div>
  )
}