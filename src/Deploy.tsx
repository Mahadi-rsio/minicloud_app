import { useEffect, useState } from "react"
import {
    AnimatedSpan,
    Terminal,
    TypingAnimation,
} from "@/components/ui/terminal"

interface LogLine {
    text: string
    type: "info" | "error" | "command"
}

export function LiveDeployTerminal({ repo, branch }: { repo: string; branch: string }) {
    const [logs, setLogs] = useState<LogLine[]>([])

    useEffect(() => {
        const query = new URLSearchParams({ repo, branch }).toString()
        const evtSource = new EventSource(`http://localhost:3000/deploy?${query}`)

        evtSource.onmessage = (e) => {
            const line = e.data
            let type: LogLine["type"] = "info"
            if (line.includes("[ERROR]")) type = "error"
            if (line.startsWith(">")) type = "command" // optional for commands

            setLogs((prev) => [...prev, { text: line, type }])
        }

        evtSource.onerror = () => {
            evtSource.close()
        }

        return () => evtSource.close()
    }, [repo, branch])

    return (
        <Terminal>
            {logs.map((log, idx) => {
                if (log.type === "command") {
                    return (
                        <TypingAnimation key={idx} className="text-muted-foreground">
                            {log.text}
                        </TypingAnimation>
                    )
                } else if (log.type === "error") {
                    return (
                        <AnimatedSpan key={idx} className="text-red-500">
                            {log.text}
                        </AnimatedSpan>
                    )
                } else {
                    return (
                        <AnimatedSpan key={idx} className="text-green-500">
                            {log.text}
                        </AnimatedSpan>
                    )
                }
            })}
        </Terminal>
    )
}
