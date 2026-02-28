import { useEffect, useState } from "react"

export interface GitHubBranch {
    name: string
    protected: boolean
    commit: {
        sha: string
        url: string
    }
}


interface UseGithubBranchesOptions {
    owner: string
    repo: string
    token?: string
    enabled?: boolean
}

export function useGithubBranches({
    owner,
    repo,
    token,
    enabled = true,
}: UseGithubBranchesOptions) {
    const [branches, setBranches] = useState<GitHubBranch[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!enabled) return

        const controller = new AbortController()

        async function fetchBranches() {
            setLoading(true)
            setError(null)

            try {
                const res = await fetch(
                    `https://api.github.com/repos/${owner}/${repo}/branches`,
                    {
                        signal: controller.signal,
                        headers: {
                            Accept: "application/vnd.github+json",
                            ...(token && { Authorization: `Bearer ${token}` }),
                        },
                    }
                )

                if (!res.ok) {
                    throw new Error(`Failed to fetch branches (${res.status})`)
                }

                const data: GitHubBranch[] = await res.json()
                setBranches(data)
            } catch (err) {
                if (err instanceof DOMException && err.name === "AbortError") return
                setError((err as Error).message)
            } finally {
                setLoading(false)
            }
        }

        fetchBranches()

        return () => controller.abort()
    }, [owner, repo, token, enabled])

    return {
        branches,
        loading,
        error,
    }
}
