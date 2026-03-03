import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    SettingsIcon,
    ArrowRightIcon,
    RefreshCwIcon,
    CheckCircle2,
    AlertTriangle,
} from "lucide-react"
import { toast } from "sonner"
import { useSearchParams, useNavigate } from "react-router-dom"

/* ---------------------------------- */
/* Workflow generator                  */
/* ---------------------------------- */
function generateWorkflow(runtime: string, branch: string) {
    switch (runtime) {
        case "nodejs":
            return `
name: Build

on:
  push:
    branches: [${branch}]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install
      - run: npm run build
`.trim()

        case "go":
            return `
name: Build

on:
  push:
    branches: [${branch}]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: "1.22"
      - run: go build ./...
`.trim()

        default:
            return null
    }
}

/* ---------------------------------- */
/* Component                           */
/* ---------------------------------- */
export function Workflow() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const owner = searchParams.get("owner") ?? ""
    const repo = searchParams.get("repo") ?? ""
    const branch = searchParams.get("branch") ?? "main"
    const runtime = searchParams.get("runtime") ?? ""

    const [workflowExists, setWorkflowExists] = useState<boolean | null>(null)
    const [checking, setChecking] = useState(false)

    /* ---------------- Check workflow ---------------- */
    useEffect(() => {
        if (!owner || !repo || !branch) return

        async function checkWorkflow() {
            setChecking(true)
            try {
                const res = await fetch(
                    `https://api.github.com/repos/${owner}/${repo}/contents/.github/workflows/build.yml?ref=${branch}`,
                    { headers: { Accept: "application/vnd.github+json" } }
                )

                setWorkflowExists(res.status === 200)
            } catch {
                setWorkflowExists(false)
            } finally {
                setChecking(false)
            }
        }

        checkWorkflow()
    }, [owner, repo, branch])

    /* ---------------- Create workflow ---------------- */
    function handleConfigure() {
        if (!owner || !repo || !branch || !runtime) {
            toast.error("Missing repository or runtime information")
            return
        }

        const workflow = generateWorkflow(runtime, branch)

        if (!workflow) {
            toast.error("Unsupported runtime")
            return
        }

        const url = new URL(`https://github.com/${owner}/${repo}/new/${branch}`)
        url.searchParams.set("filename", ".github/workflows/build.yml")
        url.searchParams.set("value", workflow)

        localStorage.setItem("awaiting_workflow_commit", "true")
        window.location.href = url.toString()
    }

    /* ---------------- Next step ---------------- */
    function handleNext() {
        navigate(`/deploy?${searchParams.toString()}`)
    }

    function reloadPage() {
        window.location.reload()
    }

    /* ---------------- UI ---------------- */
    return (
        <div className="mt-6 rounded-xl border bg-muted/30 p-6 space-y-4">
            <h3 className="font-semibold text-sm">
                GitHub Workflow Configuration
            </h3>

            {checking && (
                <p className="text-xs text-muted-foreground">
                    Checking repository workflow…
                </p>
            )}

            {/* Workflow missing */}
            {workflowExists === false && !checking && (
                <div className="space-y-4">
                    <div className="flex items-start gap-2 text-xs text-amber-600">
                        <AlertTriangle className="h-4 w-4 mt-0.5" />
                        <p>
                            <b>build.yml not found.</b><br />
                            We’ll create one for your <b>{runtime}</b> project.
                            After committing on GitHub, reload this page.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button onClick={handleConfigure} className="gap-2">
                            <SettingsIcon className="h-4 w-4" />
                            Configure Workflow
                        </Button>

                        <Button
                            variant="outline"
                            onClick={reloadPage}
                            className="gap-2"
                        >
                            <RefreshCwIcon className="h-4 w-4" />
                            Reload
                        </Button>
                    </div>
                </div>
            )}

            {/* Workflow exists */}
            {workflowExists === true && !checking && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-xs text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        Workflow detected — you’re good to go.
                    </div>

                    <Button onClick={handleNext} className="gap-2">
                        Next
                        <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    )
}
