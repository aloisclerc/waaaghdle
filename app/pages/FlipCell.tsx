"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export function FlipCell({
  value,
  colorClass,
  delay,
  rowNum,
  trigger,
}: {
  value: string
  colorClass: string
  delay: number
  rowNum: number
  trigger: number
}) {
  const isActive = rowNum === 0

  const [revealed, setRevealed] = useState(true)

  useEffect(() => {
    console.log(value)
  if (!isActive) return

  console.log(value)

  let raf: number
  let t: NodeJS.Timeout


  setRevealed(false)

  raf = requestAnimationFrame(() => {
    t = setTimeout(() => {
      setRevealed(true)
    }, delay)
  })

  return () => {
    cancelAnimationFrame(raf)
    clearTimeout(t)
  }
}, [trigger, isActive, delay])

  return (
    <td className="w-24 h-12 perspective">
      <motion.div
        initial={false}
        animate={isActive ? { rotateX: revealed ? 180 : 0 } : { rotateX: 180 }}
        transition={{
          duration: 0.5,
          ease: "easeInOut",
        }}
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front (hidden) */}
        <div className="absolute inset-0 flex items-center justify-center border border-neutral-700 bg-neutral-800 backface-hidden m-1 rounded-lg" />

        {/* Back (revealed) */}
        <div
          className={`absolute inset-0 flex items-center justify-center border border-neutral-700 ${colorClass} backface-hidden m-1 rounded-lg`}
          style={{ transform: "rotateX(180deg)" }}
        >
          {value}
        </div>
      </motion.div>
    </td>
  )
}