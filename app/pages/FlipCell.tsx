"use client"

import { useEffect, useState } from "react"

export function FlipCell({
  value,
  colorClass,
  delay,
  trigger,
  rowNum
}: {
  value: string
  colorClass: string
  delay: number
  trigger: number
  rowNum: number
}) {
  const [phase, setPhase] = useState<"hidden" | "flipping" | "revealed">("hidden")

  useEffect(() => {
    if(rowNum === 0){

        const t1 = setTimeout(() => setPhase("flipping"), delay)
        const t2 = setTimeout(() => setPhase("revealed"), delay + 400)

        return () => {
        clearTimeout(t1)
        clearTimeout(t2)
        }

    } else {
        setPhase("revealed")
    }
    
  }, [trigger, delay])

  const isHidden = phase === "hidden"
  const isFlipping = phase === "flipping"

  return (
    <td
      className={`
        w-24 h-12 border border-neutral-700
        text-white font-medium text-center rounded-lg m-3
        ${phase === "revealed" ? colorClass : "bg-neutral-800"}
        ${isFlipping ? "flip" : ""}
      `}
    >
      {isHidden ? "" : value}
    </td>
  )
}