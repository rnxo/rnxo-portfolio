import { useEffect, useState } from 'react'
import { motion } from 'motion/react'

type TypingTextProps = {
  text: string
  speed?: number
  startDelay?: number
  cycleInterval?: number
  className?: string
}

export default function TypingText({
  text,
  speed = 80,
  startDelay = 300,
  cycleInterval = 5000,
  className,
}: TypingTextProps) {
  const [charCount, setCharCount] = useState(0)

  useEffect(() => {
    let typingInterval: ReturnType<typeof setInterval>
    let cycleTimeout: ReturnType<typeof setTimeout>

    const startTyping = () => {
      let index = 0
      setCharCount(0)
      typingInterval = setInterval(() => {
        index++
        setCharCount(index)
        if (index >= text.length) {
          clearInterval(typingInterval)
          cycleTimeout = setTimeout(startTyping, cycleInterval)
        }
      }, speed)
    }

    const startTimeout = setTimeout(startTyping, startDelay)

    return () => {
      clearTimeout(startTimeout)
      clearInterval(typingInterval)
      clearTimeout(cycleTimeout)
    }
  }, [text, speed, startDelay, cycleInterval])

  return (
    <span className={className}>
      {text.slice(0, charCount)}
      <motion.span
        aria-hidden
        className="ml-0.5 inline-block w-[2px] bg-current align-middle"
        style={{ height: '0.9em' }}
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{
          duration: 1,
          times: [0, 0.5, 0.5, 1],
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </span>
  )
}