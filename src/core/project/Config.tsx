
"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
} from "lucide-react"

type ConfigSectionProps = {
    appName: string
    setAppName: (v: string) => void

    region: string
    setRegion: (v: string) => void

    runtime: string
    setRuntime: (v: string) => void

    buildCommand: string
    setBuildCommand: (v: string) => void

    startCommand: string
    setStartCommand: (v: string) => void

    outputDir: string
    setOutputDir: (v: string) => void
}

export const regions = [
    { value: "asia-south1", label: "Asia South 1 (Mumbai)" },
    { value: "asia-southeast1", label: "Asia Southeast 1 (Singapore)" },
]

export const runtimes = [
    { value: "nodejs", label: "Node.js" },
    { value: "go", label: "Go" },
]

export default function ConfigSection({
    appName,
    setAppName,
    region,
    setRegion,
    runtime,
    setRuntime,
    buildCommand,
    setBuildCommand,
    startCommand,
    setStartCommand,
    outputDir,
    setOutputDir,
}: ConfigSectionProps) {
    return (
        <Card className="transition-all hover:shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Configuration & Naming
                </CardTitle>
                <CardDescription>
                    Configure runtime, region, and build settings.
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* ======================= */}
                {/* Basic Info */}
                {/* ======================= */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* App Name */}
                    <div>
                        <Label className="flex items-center gap-2">
                            <AppWindow className="w-4 h-4" />
                            App Name
                        </Label>
                        <Input
                            placeholder="my-awesome-app"
                            value={appName}
                            onChange={(e) => setAppName(e.target.value)}
                            className="mt-2"
                        />
                    </div>

                    {/* Region */}
                    <div>
                        <Label className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Region
                        </Label>

                        <Select value={region} onValueChange={setRegion}>
                            <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Select region" />
                            </SelectTrigger>
                            <SelectContent>
                                {regions.map((r) => (
                                    <SelectItem
                                        key={r.value}
                                        value={r.value}
                                    >
                                        {r.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Runtime */}
                    <div>
                        <Label className="flex items-center gap-2">
                            <Cpu className="w-4 h-4" />
                            Runtime
                        </Label>

                        <Select value={runtime} onValueChange={setRuntime}>
                            <SelectTrigger className="mt-2">
                                <SelectValue placeholder="Select runtime" />
                            </SelectTrigger>
                            <SelectContent>
                                {runtimes.map((r) => (
                                    <SelectItem
                                        key={r.value}
                                        value={r.value}
                                    >
                                        {r.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* ======================= */}
                {/* Build Settings */}
                {/* ======================= */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Build Command */}
                    <div>
                        <Label className="flex items-center gap-2">
                            <Terminal className="w-4 h-4" />
                            Build Command
                        </Label>
                        <Input
                            placeholder={
                                runtime === "nodejs"
                                    ? "npm run build"
                                    : "go build -o app"
                            }
                            value={buildCommand}
                            onChange={(e) =>
                                setBuildCommand(e.target.value)
                            }
                            className="mt-2"
                        />
                    </div>

                    {/* Start Command */}
                    <div>
                        <Label className="flex items-center gap-2">
                            <Play className="w-4 h-4" />
                            Start Command
                        </Label>
                        <Input
                            placeholder={
                                runtime === "nodejs"
                                    ? "npm start"
                                    : "./app"
                            }
                            value={startCommand}
                            onChange={(e) =>
                                setStartCommand(e.target.value)
                            }
                            className="mt-2"
                        />
                    </div>

                    {/* Output Directory */}
                    <div>
                        <Label className="flex items-center gap-2">
                            <FolderOutput className="w-4 h-4" />
                            Output Directory
                        </Label>
                        <Input
                            placeholder={
                                runtime === "nodejs"
                                    ? "dist / build / .next"
                                    : "binary folder"
                            }
                            value={outputDir}
                            onChange={(e) =>
                                setOutputDir(e.target.value)
                            }
                            className="mt-2"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
