import { useEffect, useState } from 'react'

type ScrambleTextProps = {
  text: string
  speed?: number
  startDelay?: number
  cycleInterval?: number
  className?: string
}

const SCRAMBLE_CHARS = '!<>-_\\/[]{}—=+*^?#$%&@'
const REVEAL_DELAY_PER_CHAR = 2

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
}

export default function ScrambleText({
  text,
  speed = 40,
  startDelay = 300,
  cycleInterval = 3000,
  className,
}: ScrambleTextProps) {
  const [display, setDisplay] = useState(() => text.replace(/\S/g, ' '))

  useEffect(() => {
    let scrambleInterval: ReturnType<typeof setInterval>
    let cycleTimeout: ReturnType<typeof setTimeout>

    const startScramble = () => {
      let tick = 0
      const totalTicks = text.length * REVEAL_DELAY_PER_CHAR

      scrambleInterval = setInterval(() => {
        tick++
        setDisplay(
          text
            .split('')
            .map((char, index) =>
              char === ' ' || tick >= index * REVEAL_DELAY_PER_CHAR
                ? char
                : randomChar(),
            )
            .join(''),
        )
        if (tick >= totalTicks) {
          clearInterval(scrambleInterval)
          cycleTimeout = setTimeout(startScramble, cycleInterval)
        }
      }, speed)
    }

    const startTimeout = setTimeout(startScramble, startDelay)

    return () => {
      clearTimeout(startTimeout)
      clearInterval(scrambleInterval)
      clearTimeout(cycleTimeout)
    }
  }, [text, speed, startDelay, cycleInterval])

  return <span className={className}>{display}</span>
}
