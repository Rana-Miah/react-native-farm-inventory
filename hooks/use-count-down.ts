import { useEffect, useRef, useState } from "react"

export const useCountDown = (initialSeconds: number = 5) => {
    const [seconds, setSeconds] = useState<number>(0)
    const [isTimerFinish, setIsTimerFinish] = useState<boolean>(true)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const startTimer = () => {
        if (intervalRef.current) return
        setIsTimerFinish(false)

        setSeconds(initialSeconds)


        intervalRef.current = setInterval(
            () => {
                setSeconds(prev => {
                    if (prev <= 1) {
                        clearInterval(intervalRef.current!)
                        intervalRef.current = null
                        setIsTimerFinish(true)
                        return 0
                    }
                    return prev - 1
                })
            },
            1000
        );
    }

    const clearCallback = () => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }
    useEffect(clearCallback, [])

    return {
        startTimer,
        seconds,
        isTimerFinish
    }
}