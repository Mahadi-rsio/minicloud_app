"use client"

import { useEffect, useMemo, useState } from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Github,
    Link,
    FolderGit2,
    GitBranch,
    Loader2,
    Check,
    Globe,
    Lock,
    GitCommitIcon,
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

import { listRepos, type GitHubRepository } from "@/lib/github_type"
import { getAccessToken } from "@/lib/authClient"
import { useGithubCommits } from "@/lib/github_commit"

/* =========================
   Types
========================= */
type RepositorySectionProps = {
    gitUrl: string
    setGitUrl: (url: string) => void
    selectedRepo?: string
    setSelectedRepo: (repo?: string) => void
}

type GitHubBranch = {
    name: string
    protected: boolean
}

/* =========================
   Helpers
========================= */
const formatRepoName = (name: string) =>
    name.length > 20 ? `${name.slice(0, 20)}...` : name

async function fetchBranches(
    owner: string,
    repo: string,
    token: string
): Promise<GitHubBranch[]> {
    const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/branches`,
        {
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer ${token}`,
            },
        }
    )

    if (!res.ok) throw new Error("Failed to fetch branches")
    return res.json()
}

/* =========================
   Branch Select
========================= */
function BranchSelect({
    branchList,
    value,
    onChange,
}: {
    branchList: string[]
    value: string
    onChange: (v: string) => void
}) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger>
                <SelectValue placeholder="Select branch" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {branchList.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                            {branch}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

/* =========================
   Main Component
========================= */
export default function RepositorySection({
    gitUrl,
    setGitUrl,
    selectedRepo,
    setSelectedRepo,
}: RepositorySectionProps) {
    const navigate = useNavigate()

    const [accessToken, setAccessToken] = useState("")
    const [repositories, setRepositories] = useState<GitHubRepository[]>([])
    const [branch, setBranch] = useState("")
    const [branchList, setBranchList] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [branchLoading, setBranchLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    console.log(error);


    /* =========================
       Auth token
    ========================= */
    useEffect(() => {
        async function loadToken() {
            const { data, error } = await getAccessToken({
                providerId: "github",
            })

            if (error || !data?.accessToken) {
                toast.error("GitHub login required")
                navigate("/")
                return
            }

            setAccessToken(data.accessToken)
        }

        loadToken()
    }, [navigate])

    /* =========================
       Fetch repos
    ========================= */
    useEffect(() => {
        if (!accessToken) return

        async function loadRepos() {
            setLoading(true)
            try {
                const repos = await listRepos(accessToken)
                setRepositories(repos)
            } catch {
                setError("Failed to load repositories")
            } finally {
                setLoading(false)
            }
        }

        loadRepos()
    }, [accessToken])

    /* =========================
       Selected repo data
    ========================= */
    const selectedRepoData = useMemo(
        () => repositories.find((r) => r.full_name === selectedRepo),
        [repositories, selectedRepo]
    )

    const owner = selectedRepoData?.full_name.split("/")[0] ?? ""
    const repo = selectedRepoData?.full_name.split("/")[1] ?? ""

    /* =========================
       Fetch branches
    ========================= */
    useEffect(() => {
        if (!owner || !repo || !accessToken) return

        async function loadBranches() {
            setBranchLoading(true)
            try {
                const branches = await fetchBranches(owner, repo, accessToken)
                const names = branches.map((b) => b.name)

                setBranchList(names)
                setBranch(
                    names.includes(selectedRepoData!.default_branch)
                        ? selectedRepoData!.default_branch
                        : names[0]
                )
            } catch {
                toast.error("Failed to load branches")
            } finally {
                setBranchLoading(false)
            }
        }

        loadBranches()
    }, [owner, repo, accessToken, selectedRepoData])

    /* =========================
       Commits Hook (CORRECT)
    ========================= */
    const {
        commits,
        loading: commitsLoading,
        error: commitsError,
    } = useGithubCommits({
        owner,
        repo,
        branch,
        perPage: 2,
        token: accessToken,
    })

    /* =========================
       URL Import
    ========================= */
    const extractRepoName = (url: string) => {
        const match = url.match(/github\.com\/([^\/]+\/[^\/]+)(\.git)?/)
        return match ? match[1] : null
    }

    const handleImportFromUrl = () => {
        const repoName = extractRepoName(gitUrl)
        if (!repoName) {
            setError("Invalid GitHub repository URL")
            return
        }
        setSelectedRepo(repoName)
    }
    /* =========================
       Render
    ========================= */
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FolderGit2 className="w-5 h-5" />
                    Repository
                </CardTitle>
                <CardDescription>
                    Import a GitHub repository or select from your account
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Import URL */}
                <div>
                    <Label className="flex items-center gap-2">
                        <Link className="w-4 h-4" />
                        Import from Git URL
                    </Label>
                    <div className="flex gap-2 mt-2">
                        <Input
                            placeholder="https://github.com/user/repo"
                            value={gitUrl}
                            onChange={(e) => setGitUrl(e.target.value)}
                        />
                        <Button onClick={handleImportFromUrl}>
                            <Github className="w-4 h-4 mr-2" />
                            Import
                        </Button>
                    </div>
                </div>

                {/* Repo List */}
                <div>
                    <Label>Your repositories</Label>
                    {loading && (
                        <div className="flex gap-2 mt-2 text-sm">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading repositories...
                        </div>
                    )}

                    <div className="mt-3 space-y-2 max-h-[300px] overflow-auto">
                        {repositories.map((repo) => {
                            const isSelected = selectedRepo === repo.full_name
                            return (
                                <div
                                    key={repo.id}
                                    className={`flex justify-between p-3 border rounded-lg ${isSelected && "border-primary bg-primary/5"
                                        }`}
                                >
                                    <div>
                                        <p className="text-xs font-medium">
                                            {formatRepoName(repo.full_name)}
                                        </p>
                                        <Badge variant="outline" className="text-[10px] mt-1">
                                            {repo.private ? <Lock /> : <Globe />}
                                            {repo.private ? "Private" : "Public"}
                                        </Badge>
                                    </div>
                                    <Button
                                        size="sm"
                                        variant={isSelected ? "default" : "outline"}
                                        onClick={() => setSelectedRepo(repo.full_name)}
                                    >
                                        {isSelected ? <Check /> : "Import"}
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Branch */}
                {selectedRepo && (
                    <div className="flex gap-4">
                        <Label className="flex items-center gap-2">
                            <GitBranch className="w-4 h-4" />
                            Branch
                        </Label>
                        {branchLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin mt-2" />
                        ) : (
                            <BranchSelect

                                branchList={branchList}
                                value={branch}
                                onChange={setBranch}
                            />
                        )}
                    </div>
                )}

                {/* Preview */}
                <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex justify-between">
                        <span>{selectedRepo ?? "No repository selected"}</span>
                    </div>

                    {commitsLoading && (
                        <p className="text-xs mt-2">Loading commits…</p>
                    )}

                    {commitsError && (
                        <p className="text-xs text-destructive mt-2">
                            Failed to load commits
                        </p>
                    )}

                    {commits?.length > 0 && (
                        <div className="flex gap-1">
                            <p className="text-xs mt-2 font-mono leading-relaxed text-slate-800 dark:text-slate-200">

                                <GitCommitIcon className="h-3 w-3" />
                                latest commit: {commits[0].commit.message}
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card >
    )
}
