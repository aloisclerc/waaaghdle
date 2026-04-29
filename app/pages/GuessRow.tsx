"use client"

import { useEffect, useState } from "react"
import { FlipCell } from "./FlipCell"

export function GuessRow({ guess, rowNum, getCellStyle, trigger }) {
  return (
    <tr className="h-18">
      <FlipCell value={guess.nameValue} colorClass={getCellStyle(guess.name)} rowNum={rowNum===0 ? 0 : 1} order={0} trigger={trigger} />
      <FlipCell value={guess.factionValue} colorClass={getCellStyle(guess.faction)} rowNum={rowNum===0 ? 0 : 1} order={1} trigger={trigger} />
      <FlipCell value={guess.roleValue} colorClass={getCellStyle(guess.role)} rowNum={rowNum===0 ? 0 : 1} order={2} trigger={trigger} />
      <FlipCell value={guess.pointsValue} colorClass={getCellStyle(guess.points)} rowNum={rowNum===0 ? 0 : 1} order={3} trigger={trigger} />
    </tr>
  )
}