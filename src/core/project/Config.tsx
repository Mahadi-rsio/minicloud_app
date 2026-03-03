"use client"

import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Settings,
    AppWindow,
    Globe,
    Terminal,
    Play,
    FolderOutput,
    Cpu,
    Rocket,
    GitBranch,
    Github,
} from "lucide-react"

/* ---------------------------------- */
/* Static options                     */
/* ---------------------------------- */

const regions = [
    { value: "asia-south1", label: "Asia South 1 (Mumbai)" },
    { value: "asia-southeast1", label: "Asia Southeast 1 (Singapore)" },
]

const runtimes = [
    { value: "nodejs", label: "Node.js" },
    { value: "go", label: "Go" },
]

/* ---------------------------------- */
/* Component                          */
/* ---------------------------------- */

export default function ConfigSection() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    /* ---------------- Git data from URL ---------------- */
    const owner = searchParams.get("owner") || ""
    const repo = searchParams.get("repo") || ""
    const branch = searchParams.get("branch") || "main"

    /* ---------------- Local config state ---------------- */
    const [appName, setAppName] = useState(repo)
    const [region, setRegion] = useState("")
    const [runtime, setRuntime] = useState("")
    const [buildCommand, setBuildCommand] = useState("")
    const [startCommand, setStartCommand] = useState("")
    const [outputDir, setOutputDir] = useState("")

    /* Auto defaults per runtime */
    useEffect(() => {
        if (runtime === "nodejs") {
            setBuildCommand("npm run build")
            setStartCommand("npm start")
            setOutputDir("dist")
        }
        if (runtime === "go") {
            setBuildCommand("go build -o app")
            setStartCommand("./app")
            setOutputDir("bin")
        }
    }, [runtime])

    const canDeploy =
        owner &&
        repo &&
        branch &&
        appName &&
        region &&
        runtime &&
        buildCommand &&
        startCommand

    /* ---------------- Navigate to deploy ---------------- */
    const goToDeploy = () => {
        const params = new URLSearchParams({
            /* Git */
            owner,
            repo,
            branch,

            /* Config */
            app_name: appName,
            region,
            runtime,
            build_command: buildCommand,
            start_command: startCommand,
            output_dir: outputDir,
        })

        navigate(`/workflow?${params.toString()}`)
    }

    return (
        <Card className="transition-all hover:shadow-lg">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Configure Deployment
                </CardTitle>
                <CardDescription>
                    Review repository and configure build settings.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
                {/* GIT INFO (READ-ONLY) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 rounded-lg border p-4 bg-muted/40">
                    <Info label="Owner" icon={<Github />} value={owner} />
                    <Info label="Repository" icon={<AppWindow />} value={repo} />
                    <Info
                        label="Branch"
                        icon={<GitBranch />}
                        value={branch}
                    />
                </div>

                {/* BASIC CONFIG */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Field
                        icon={<AppWindow />}
                        label="App Name"
                        value={appName}
                        onChange={setAppName}
                    />

                    <SelectField
                        icon={<Globe />}
                        label="Region"
                        value={region}
                        onChange={setRegion}
                        options={regions}
                    />

                    <SelectField
                        icon={<Cpu />}
                        label="Runtime"
                        value={runtime}
                        onChange={setRuntime}
                        options={runtimes}
                    />
                </div>

                <div className="border-t pt-6" />

                {/* BUILD CONFIG */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <Field
                        icon={<Terminal />}
                        label="Build Command"
                        value={buildCommand}
                        onChange={setBuildCommand}
                    />

                    <Field
                        icon={<Play />}
                        label="Start Command"
                        value={startCommand}
                        onChange={setStartCommand}
                    />

                    <Field
                        icon={<FolderOutput />}
                        label="Output Directory"
                        value={outputDir}
                        onChange={setOutputDir}
                    />
                </div>

                {/* CTA */}
                <div className="flex justify-end pt-4">
                    <Button
                        size="lg"
                        className="gap-2"
                        disabled={!canDeploy}
                        onClick={goToDeploy}
                    >
                        <Rocket className="w-4 h-4" />
                        Deploy
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

/* ---------------------------------- */
/* Small UI helpers                    */
/* ---------------------------------- */

function Field({ label, icon, value, onChange }: any) {
    return (
        <div>
            <Label className="flex items-center gap-2">
                {icon}
                {label}
            </Label>
            <Input
                className="mt-2"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    )
}

function SelectField({ label, icon, value, onChange, options }: any) {
    return (
        <div>
            <Label className="flex items-center gap-2">
                {icon}
                {label}
            </Label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="mt-2">
                    <SelectValue placeholder={`Select ${label}`} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((o: any) => (
                        <SelectItem key={o.value} value={o.value}>
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

function Info({ label, icon, value }: any) {
    return (
        <div>
            <Label className="flex items-center gap-2 text-muted-foreground">
                {icon}
                {label}
            </Label>
            <div className="mt-1 font-mono text-sm">{value || "—"}</div>
        </div>
    )
}
