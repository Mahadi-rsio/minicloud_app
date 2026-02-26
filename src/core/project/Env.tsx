import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Settings2,
    Key,
    Lock,
    Plus,
    Trash2,
    Eye,
    EyeOff,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

type EnvVar = {
    key: string
    value: string
    secret?: boolean
}

type EnvVarsSectionProps = {
    envVars: EnvVar[]
    setEnvVars: (vars: EnvVar[]) => void
}

export default function EnvVarsSection({
    envVars,
    setEnvVars,
}: EnvVarsSectionProps) {
    const [showValues, setShowValues] = useState(false)

    function addVar() {
        setEnvVars([...envVars, { key: "", value: "", secret: true }])
    }

    function updateVar(i: number, field: keyof EnvVar, value: any) {
        const copy = [...envVars]
        copy[i] = { ...copy[i], [field]: value }
        setEnvVars(copy)
    }

    function removeVar(i: number) {
        setEnvVars(envVars.filter((_, idx) => idx !== i))
    }

    return (
        <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    <Settings2 className="w-5 h-5" />
                    Environment Variables
                </CardTitle>

                {envVars.length > 0 && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowValues(!showValues)}
                        title={showValues ? "Hide values" : "Show values"}
                    >
                        {showValues ? (
                            <EyeOff className="w-4 h-4" />
                        ) : (
                            <Eye className="w-4 h-4" />
                        )}
                    </Button>
                )}
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Empty state */}
                {envVars.length === 0 && (
                    <div className="text-sm text-muted-foreground text-center py-6">
                        No environment variables added yet
                    </div>
                )}

                {/* Variables list */}
                {envVars.map((e, i) => (
                    <div
                        key={i}
                        className="grid grid-cols-1 md:grid-cols-2 gap-3 items-start"
                    >
                        {/* Key */}
                        <div>
                            <Label className="flex items-center gap-2 text-xs">
                                <Key className="w-3 h-3" />
                                Key
                            </Label>
                            <Input
                                placeholder="DATABASE_URL"
                                value={e.key}
                                onChange={(ev) =>
                                    updateVar(i, "key", ev.target.value.toUpperCase())
                                }
                                className="mt-1"
                            />
                        </div>

                        {/* Value */}
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Label className="flex items-center gap-2 text-xs">
                                    <Lock className="w-3 h-3" />
                                    Value
                                </Label>
                                <Input
                                    type={showValues ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={e.value}
                                    onChange={(ev) =>
                                        updateVar(i, "value", ev.target.value)
                                    }
                                    className="mt-1"
                                />
                            </div>

                            {/* Remove */}
                            <Button
                                variant="outline"
                                size="icon"
                                className="mt-6"
                                onClick={() => removeVar(i)}
                            >
                                <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                        </div>
                        <Separator />
                    </div>
                ))}

                {/* Add button */}
                <Button variant="outline" onClick={addVar} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Variable
                </Button>
            </CardContent>
        </Card>
    )
}
