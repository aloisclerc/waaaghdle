"use client"

import { motion, useAnimationControls } from "framer-motion"
import { useEffect } from "react"

export function FlipCell({
  value,
  colorClass,
  rowNum,
  order,
  trigger,
}: {
  value: string
  colorClass: string
  rowNum: number
  order: number
  trigger: number
}) {
  const controls = useAnimationControls()

useEffect(() => {
  if (rowNum !== 0) return

  const run = async () => {
    await controls.set({ rotateX: 0 })
    await new Promise((r) => setTimeout(r, order * 150))
    await controls.start({
      rotateX: 180,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    })
  }

  run()
}, [trigger, rowNum])

  return (
    <td className="w-24 h-12 perspective">
      <motion.div
        animate={rowNum === 0
      ? controls
      : { rotateX: 180 }}
        initial={false}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full h-full"
      >
        <div className="absolute inset-0 flex items-center justify-center border border-neutral-700 bg-neutral-800 backface-hidden rounded-lg m-1" />

        <div
          className={`absolute inset-0 flex items-center justify-center border border-neutral-700 rounded-lg m-1 ${colorClass} backface-hidden`}
          style={{ transform: "rotateX(180deg)" }}
        >
          {value}
        </div>
      </motion.div>
    </td>
  )
}