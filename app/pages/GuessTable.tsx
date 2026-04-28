import { FlipCell } from "./FlipCell"


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
      <table className="w-full border-collapse text-center">
        <thead>
          <tr className="text-sm text-neutral-400">
            <th className="pb-2">Unit</th>
            <th className="pb-2">Faction</th>
            <th className="pb-2">Role</th>
            <th className="pb-2">Points</th>
          </tr>
        </thead>

        <tbody>
          {guesses.map((g, i) => (
            <tr key={i} className="h-18">
              <FlipCell
                value={g.nameValue}
                delay={100}
                colorClass={getCellStyle(g.name)}
                trigger={i===0 ? turn : 0}
                rowNum={i}
              />

              <FlipCell
                value={g.factionValue}
                delay={300}
                colorClass={getCellStyle(g.faction)}
                trigger={i===0 ? turn : 0}
                rowNum={i}
              />

              <FlipCell
                value={g.roleValue}
                delay={600}
                colorClass={getCellStyle(g.role)}
                trigger={i===0 ? turn : 0}
                rowNum={i}
              />

              <FlipCell
                value={g.pointsValue + " " + (g.points === "correct"
                  ? "✓"
                  : g.points === "higher"
                  ? "↑"
                  : "↓")}
                delay={900}
                colorClass={getCellStyle(g.points)}
                trigger={i===0 ? turn : 0}
                rowNum={i}
              />
            </tr>
          ))}
        </tbody>

        {/* <tbody>
          {guesses.map((g, i) => (
            <tr key={i} className="h-12">
              <td className={`border border-neutral-700 ${getCellStyle(g.name)}`}>
                {g.nameValue}
              </td>

              <td className={`border border-neutral-700 ${getCellStyle(g.faction)}`}>
                {g.factionValue}
              </td>

              <td className={`border border-neutral-700 ${getCellStyle(g.role)}`}>
                {g.roleValue}
              </td>

              <td className={`border border-neutral-700 ${getCellStyle(g.points)}`}>
                {g.pointsValue + " " + (g.points === "correct"
                  ? "✓"
                  : g.points === "higher"
                  ? "↑"
                  : "↓")}
              </td>
            </tr>
          ))}
        </tbody> */}
      </table>
    </div>
  )
}