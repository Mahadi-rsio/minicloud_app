

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
    Server,
    Cpu,
    MemoryStick,
    Coins,
    Layers,
    Calculator,
    Zap,
    Globe,
    Container,
} from "lucide-react"
import type { ServiceType } from "./Services"


type PricingSectionProps = {
    serviceType: ServiceType
    instances?: number
    setInstances: (n: number) => void
    selectedPlan?: string
    setSelectedPlan: (id: string) => void
    usage?: number // invocations / requests for serverless & cdn
    setUsage?: (n: number) => void
}

/* ---------------- Web Service Plans ---------------- */

interface Plans {
    id: string;
    price?: string;
    cpu?: string | undefined;
    ram?: string | undefined;
    storage?: string | undefined;
    costPerHour?: number;
    contPerRequest?: number;
    monthlyCost?: number,
    costPerMemory?: number | string;
}

const webPlans: Plans[] = [
    { id: "free", price: "Free", costPerHour: 0, cpu: ".25c", ram: "200MB" },
    { id: "nano", price: "0.25৳", costPerHour: 0.25, cpu: ".25c", ram: "300MB" },
    { id: "small", price: "0.5৳", costPerHour: 0.5, cpu: "0.5c", ram: "512MB" },
    { id: "std", price: "1৳", costPerHour: 1, cpu: "1c", ram: "1GB" },
]

const redisMonthlyPlans: Plans[] = [
    { id: "nano", monthlyCost: 500, ram: "512MB" },
    { id: "medium", monthlyCost: 1000, ram: "1.2GB" },
    { id: "large", monthlyCost: 2250, ram: "3GB" }
]

const redisUsagePlans: Plans[] = [
    { id: "pay_per_use", contPerRequest: 0.01, costPerMemory: "10 taka per 150MB storage(ram)" }
]


/* ---------------- Serverless / CDN Pricing ---------------- */

const FREE_INVOCATIONS = 5000

export default function PricingSection({
    serviceType,
    instances,
    setInstances,
    selectedPlan,
    setSelectedPlan,
    usage = 0,
    setUsage,
}: PricingSectionProps) {
    /* ---------- WEB SERVICE CALC ---------- */
    const webPlan = webPlans.find((p) => p.id === selectedPlan)
    let total: string | null = null
    let note: string | null = null

    if (serviceType === "web_service" && webPlan) {
        if (webPlan.id === "free") {
            total = "Free"
            note = "Includes 250 CPU hours/month"
        } else {
            total = (webPlan.costPerHour! * instances!).toFixed(2)
        }
    }

    /* ---------- SERVERLESS ---------- */
    if (serviceType === "serverless") {
        const billable = Math.max(0, usage - FREE_INVOCATIONS)
        const cost = (billable / 100000) * 15
        total = cost.toFixed(2)
        note = "5K free, then 1৳ per 1K invocations"
    }

    /* ---------- CDN ---------- */
    if (serviceType === "static") {
        const billable = Math.max(0, usage - FREE_INVOCATIONS)
        const cost = (billable / 100000) * 20
        total = cost.toFixed(2)
        note = "5K free, then 1৳ per 1K requests"
    }

    return (
        <Card className="transition-all hover:shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {serviceType === "web_service" && <Server className="w-5 h-5" />}
                    {serviceType === "serverless" && <Zap className="w-5 h-5" />}
                    {serviceType === "static" && <Globe className="w-5 h-5" />}
                    {serviceType === "object_storage" && <Container className="w-5 h-5" />}
                    {serviceType === "redis" && <MemoryStick className="w-5 h-5" />}


                    Pricing
                </CardTitle>

                <CardDescription>
                    {serviceType === "web_service" && "Configure instances and plan."}
                    {serviceType === "serverless" && "Pay per invocation."}
                    {serviceType === "static" && "Pay per request."}
                    {serviceType === "redis" && "Pay per commands."}
                    {serviceType === "object_storage" && "Pay per usage"}


                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* ---------------- WEB SERVICE ---------------- */}
                {serviceType === "web_service" && (
                    <>

                        {/* Instance Count */}
                        <div>
                            <Label className="flex items-center gap-2">
                                <Layers className="w-4 h-4" />
                                Instance Count
                            </Label>

                            <Input
                                type="number"
                                min={1}
                                max={selectedPlan === "free" ? 1 : undefined}
                                value={instances}
                                onChange={(e) =>
                                    setInstances(
                                        selectedPlan === "free"
                                            ? 1
                                            : Math.max(1, Number(e.target.value))
                                    )
                                }
                                className="mt-2"
                            />

                            {selectedPlan === "free" && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Free plan allows only 1 instance
                                </p>
                            )}
                        </div>
                    </>
                )}



                {/* ---------------- SERVERLESS / CDN ---------------- */}
                {(serviceType === "object_storage") && (
                    <div>
                        <Label className="flex items-center gap-2">
                            <Layers className="w-4 h-4" />

                        </Label>

                        <Input
                            type="number"
                            min={0}
                            value={usage}
                            onChange={(e) => setUsage?.(Math.max(0, Number(e.target.value)))}
                            className="mt-2"
                        />
                    </div>
                )}



                {/* ---------------- SERVERLESS / CDN ---------------- */}
                {(serviceType === "serverless" || serviceType === "static") && (
                    <div>
                        <Label className="flex items-center gap-2">
                            <Layers className="w-4 h-4" />
                            Monthly {serviceType === "serverless" ? "Invocations" : "Requests"}
                        </Label>

                        <Input
                            type="number"
                            min={0}
                            value={usage}
                            onChange={(e) => setUsage?.(Math.max(0, Number(e.target.value)))}
                            className="mt-2"
                        />
                    </div>
                )}

                <Separator />

                {/* Summary */}
                <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calculator className="w-4 h-4" />
                        Estimated Cost
                    </div>

                    <div className="text-xl font-semibold">
                        {total === null ? "Configure usage" : `${total}৳`}
                        {serviceType === "web_service" && total !== "Free" && " / hour"}
                        {(serviceType === "serverless" || serviceType === "static") && " / month"}
                    </div>

                    {note && (
                        <div className="text-xs text-muted-foreground">
                            {note}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
