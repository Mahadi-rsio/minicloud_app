"use client"

import { useEffect, useState } from 'react'
import { getSession, signIn, signOut, revokeSessions, getAccessToken } from './../lib/authClient'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { listRepos, type GitHubRepository } from '@/lib/github_type'

export function Login() {
    const [userId, setUserId] = useState<string | null | undefined>(null)
    const [userName, setUserName] = useState('')
    const [accessToken, setAccessToken] = useState<string>('')
    const [repos, setRepos] = useState<GitHubRepository[]>([])
    const [loading, setLoading] = useState(false)

    // Sign out function
    const handleSignOut = async () => {
        try {
            await signOut()
            await revokeSessions()
            setUserId(null)
            setUserName('')
            setAccessToken('')
            setRepos([])
            toast.success("Logged out successfully")
        } catch (err) {
            console.error(err)
            toast.error("Failed to log out")
        }
    }

    // Sign in function
    const handleLogin = async () => {
        const { data, error } = await signIn.social({ provider: 'github' })
        if (!data || error) {
            toast.error('Login failed')
        }
    }

    // Get session info
    async function fetchSession() {
        const { data, error } = await getSession()
        if (data) {
            setUserId(data.user.id)
            setUserName(data.user.name)
        }
        if (error) toast.error("You are not logged in")
    }

    // Get access token
    async function fetchAccessToken() {
        const { data, error } = await getAccessToken({ providerId: "github" })
        if (!error && data) {
            setAccessToken(data.accessToken)
        } else if (error) {
            toast.error(error.message)
        }
    }

    // Fetch all repos when access token is ready
    useEffect(() => {
        if (!accessToken) return

        const fetchRepos = async () => {
            setLoading(true)
            try {
                const data = await listRepos(accessToken)
                setRepos(data)
            } catch (err) {
                console.error(err)
                toast.error("Failed to fetch repositories")
            } finally {
                setLoading(false)
            }
        }

        fetchRepos()
    }, [accessToken])

    // Initialize session and token on mount
    useEffect(() => {
        fetchSession()
        fetchAccessToken()
    }, [])

    return (
        <div className="p-4 max-w-6xl mx-auto">
            {!userId ? (
                <div className="text-center space-y-4">
                    <p className="text-lg font-medium">Log in with GitHub to continue</p>
                    <Button onClick={handleLogin}>Login</Button>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-lg font-medium">Logged in as <strong>{userName}</strong></p>
                    <div className="flex gap-2">
                        <Button onClick={handleSignOut}>Log Out</Button>
                    </div>

                    <h2 className="text-xl font-semibold mt-4">Your GitHub Repositories</h2>
                    {loading && <p>Loading repositories...</p>}
                    {!loading && repos.length === 0 && <p>No repositories found.</p>}

                    <ScrollArea className="h-[500px] mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {repos.map((repo) => (
                                <Card key={repo.id} className="border">
                                    <CardHeader>
                                        <CardTitle>
                                            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                                                {repo.full_name}
                                            </a>
                                        </CardTitle>
                                        <CardDescription>{repo.description || "No description"}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <p>Language: {repo.language || "N/A"}</p>
                                        <p>Stars: {repo.stargazers_count}</p>
                                        <p>Forks: {repo.forks_count}</p>
                                        <p>Open Issues: {repo.open_issues_count}</p>
                                        <p>Visibility: {repo.visibility}</p>
                                        <p>Default Branch: {repo.default_branch}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            )}
        </div>
    )
}
