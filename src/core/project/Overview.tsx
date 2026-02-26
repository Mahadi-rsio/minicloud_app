import { useState } from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    ExternalLink,
    Copy,
    RotateCcw,
    FolderCode,
    CheckCircle2,
    XCircle,
    Loader2,
    CircleDot,
    GitBranch,
    Zap,
} from "lucide-react"

type OverviewCardProps = {
    selectedService?: string
    selectedRepo?: string
    repoUrl?: string
    status?: "idle" | "deploying" | "success" | "failed"
    loading?: boolean
    onReset: () => void
    projectName: string
    environment?: "production" | "development"
}

export default function OverviewCard({
    projectName,
    selectedService,
    selectedRepo,
    repoUrl,
    status = "idle",
    loading = false,
    onReset,
    environment = "development",
}: OverviewCardProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async () => {
        if (!selectedRepo) return
        await navigator.clipboard.writeText(selectedRepo)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
    }

    const confirmReset = () => {
        if (confirm("Reset selected service and repository?")) {
            onReset()
        }
    }

    const statusConfig = {
        idle: {
            label: "Idle",
            icon: <CircleDot className="h-4 w-4 text-muted-foreground" />,
        },
        deploying: {
            label: "Deploying",
            icon: <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />,
        },
        success: {
            label: "Live",
            icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        },
        failed: {
            label: "Failed",
            icon: <XCircle className="h-4 w-4 text-red-500" />,
        },
    }

    const currentStatus = statusConfig[status]

    return (
        <Card className="transition-all hover:shadow-lg border-muted/40">
            {/* HEADER */}
            <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-muted">
                        <FolderCode size={18} />
                    </div>

                    <div>
                        <CardTitle className="text-lg">
                            {projectName}
                        </CardTitle>
                        <Badge variant='outline'>{environment}</Badge>
                    </div>
                </div>

                {/* Status Right Side */}
                <Badge
                    variant="outline"
                    className="flex items-center gap-2 px-3 py-1"
                >
                    {currentStatus.icon}
                    {currentStatus.label}
                </Badge>
            </CardHeader>

            {/* CONTENT */}
            <CardContent className="flex flex-col md:flex-row md:justify-between gap-6">
                {/* LEFT INFO */}
                <div className="space-y-4">
                    {/* Service */}
                    <div>
                        <div className="text-sm text-muted-foreground mb-1">
                            Service
                        </div>
                        {selectedService ? (
                            <Badge variant="outline">
                                <Zap size='icon' /> {selectedService}
                            </Badge>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Not selected
                            </p>
                        )}
                    </div>

                    {/* Repository */}
                    <div>
                        <div className="text-sm text-muted-foreground mb-1">
                            Repository
                        </div>

                        {selectedRepo ? (
                            <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" >
                                    <GitBranch size='icon' />
                                    {selectedRepo}
                                </Badge>

                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={handleCopy}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>

                                {repoUrl && (
                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        asChild
                                    >
                                        <a
                                            href={repoUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                )}

                                {copied && (
                                    <span className="text-xs text-green-500">
                                        Copied!
                                    </span>
                                )}
                            </div>
                        ) : (
                            <Badge variant='outline'>not selected</Badge>
                        )}
                    </div>

                    {loading && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Loading configuration...
                        </div>
                    )}
                </div>

                {/* RIGHT ACTION */}
                <div className="flex md:justify-end">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={confirmReset}
                        disabled={!selectedService && !selectedRepo}
                        className="gap-2"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Reset
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
