import { useEffect, useState } from "react"


export interface GitHubCommitAuthor {
    name: string
    email: string
    date: string
}

export interface GitHubCommit {
    sha: string
    html_url: string
    commit: {
        message: string
        author: GitHubCommitAuthor
        committer: GitHubCommitAuthor
    }
    author: {
        login: string
        avatar_url: string
        html_url: string
    } | null
}


interface UseGithubCommitsOptions {
    owner: string
    repo: string
    branch?: string
    perPage?: number
    token?: string // optional (for private repos or higher rate limits)
}

export function useGithubCommits({
    owner,
    repo,
    branch = "master",
    perPage = 5,
    token,
}: UseGithubCommitsOptions) {
    const [commits, setCommits] = useState<GitHubCommit[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!owner || !repo) return

        const controller = new AbortController()

        async function fetchCommits() {
            try {
                setLoading(true)
                setError(null)

                const res = await fetch(
                    `https://api.github.com/repos/${owner}/${repo}/commits?sha=${branch}&per_page=${perPage}`,
                    {
                        headers: {
                            Accept: "application/vnd.github+json",
                            ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        },
                        signal: controller.signal,
                    }
                )

                if (!res.ok) {
                    throw new Error(`GitHub API error: ${res.status}`)
                }

                const data: GitHubCommit[] = await res.json()
                setCommits(data)
            } catch (err: any) {
                if (err.name !== "AbortError") {
                    setError(err.message || "Failed to fetch commits")
                }
            } finally {
                setLoading(false)
            }
        }

        fetchCommits()

        return () => controller.abort()
    }, [owner, repo, branch, perPage, token])

    return {
        commits,
        loading,
        error,
    }
}
