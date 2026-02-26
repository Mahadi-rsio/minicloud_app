"use client"

import { useState, useEffect } from "react"
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
    Server,
    Loader2,
    X,
    Check,
    Globe,
    Lock,
} from "lucide-react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type RepositorySectionProps = {
    gitUrl: string
    setGitUrl: (url: string) => void
    selectedRepo?: string
    setSelectedRepo: (repo?: string) => void
}

const fakeRepos = [
    {
        id: "repo-1",
        name: "livo-mo/hello-world",
        private: false,
        branch: ["master", "main", "dev"],
    },
    {
        id: "repo-2",
        name: "livo-mo/blog-starter",
        private: true,
        branch: ["main", "deploy", "community"],
    },
    {
        id: "repo-3",
        name: "livo-mo/serverless-fn",
        private: false,
        branch: ["dev"],
    },
]

function SelectBranch({
    branchList,
    value,
    onChange,
}: {
    branchList: string[]
    value: string
    onChange: (val: string) => void
}) {
    return (
        <div className="mt-2">
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent position="popper">
                    <SelectGroup>
                        {branchList.map((branch) => (
                            <SelectItem key={branch} value={branch}>
                                {branch}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default function RepositorySection({
    gitUrl,
    setGitUrl,
    selectedRepo,
    setSelectedRepo,
}: RepositorySectionProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [branch, setBranch] = useState("")

    const extractRepoName = (url: string) => {
        const match = url.match(/github\.com\/([^\/]+\/[^\/]+)(\.git)?/)
        return match ? match[1] : null
    }

    const handleImportFromUrl = () => {
        setError(null)
        if (!gitUrl) return

        const repoName = extractRepoName(gitUrl)
        if (!repoName) {
            setError("Invalid GitHub URL")
            return
        }

        setLoading(true)

        setTimeout(() => {
            setSelectedRepo(repoName)
            setLoading(false)
        }, 800)
    }

    const clearSelection = () => {
        setSelectedRepo(undefined)
        setGitUrl("")
        setBranch("")
        setError(null)
    }

    // 🔥 Get selected repo object
    const selectedRepoData = fakeRepos.find(
        (repo) => repo.name === selectedRepo
    )

    // 🔥 Auto-select first branch when repo changes
    useEffect(() => {
        if (selectedRepoData) {
            setBranch(selectedRepoData.branch[0])
        } else {
            setBranch("")
        }
    }, [selectedRepo])

    return (
        <Card className="transition-all hover:shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FolderGit2 className="w-5 h-5" />
                    Repository
                </CardTitle>
                <CardDescription>
                    Import a GitHub repository or select from your account.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* ===================== */}
                {/* Import From Git URL  */}
                {/* ===================== */}
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
                        <Button onClick={handleImportFromUrl} disabled={loading}>
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Github className="w-4 h-4 mr-2" />
                                    Import
                                </>
                            )}
                        </Button>
                    </div>

                    {error && (
                        <div className="text-sm text-destructive mt-2">
                            {error}
                        </div>
                    )}
                </div>

                {/* ===================== */}
                {/* Repo List UI          */}
                {/* ===================== */}
                <div>
                    <Label className="flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        Your repositories
                    </Label>

                    <div className="mt-3 space-y-2">
                        {fakeRepos.map((repo) => {
                            const isSelected =
                                selectedRepo === repo.name

                            return (
                                <div
                                    key={repo.id}
                                    className={`flex items-center justify-between p-3 rounded-lg border transition-all
                                    ${isSelected
                                            ? "border-primary bg-primary/5"
                                            : "hover:bg-muted/40"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-muted rounded-md">
                                            <FolderGit2 className="w-4 h-4 text-muted-foreground" />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium">
                                                {repo.name}
                                            </span>

                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge
                                                    variant="outline"
                                                    className="text-[10px] flex items-center gap-1"
                                                >
                                                    {repo.private ? (
                                                        <Lock className="w-3 h-3" />
                                                    ) : (
                                                        <Globe className="w-3 h-3" />
                                                    )}
                                                    {repo.private
                                                        ? "Private"
                                                        : "Public"}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        size="sm"
                                        variant={
                                            isSelected
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() =>
                                            setSelectedRepo(repo.name)
                                        }
                                    >
                                        {isSelected ? (
                                            <Check className="w-4 h-4" />
                                        ) : (
                                            "Import"
                                        )}
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* ===================== */}
                {/* Branch Selector       */}
                {/* ===================== */}
                {selectedRepoData && (
                    <div>
                        <Label className="flex items-center gap-2">
                            <GitBranch className="w-4 h-4" />
                            Branch
                        </Label>

                        <SelectBranch
                            branchList={selectedRepoData.branch}
                            value={branch}
                            onChange={setBranch}
                        />
                    </div>
                )}

                {/* ===================== */}
                {/* Selected Preview      */}
                {/* ===================== */}
                <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-medium">
                            <FolderGit2 className="w-4 h-4 text-muted-foreground" />
                            {selectedRepo || "No repository selected"}
                        </div>

                        {selectedRepo && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={clearSelection}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    {selectedRepo && (
                        <div className="flex flex-wrap gap-3 text-xs">
                            <Badge
                                variant="outline"
                                className="flex items-center gap-1"
                            >
                                <GitBranch className="w-3 h-3" />
                                {branch || "No branch selected"}
                            </Badge>

                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                <Server className="w-3 h-3" />
                                {gitUrl ? "Git URL" : "GitHub"}
                            </Badge>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
