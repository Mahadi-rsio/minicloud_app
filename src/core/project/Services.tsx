import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
    Plus,
    ChevronDown,
    Cloud,
    Globe,
    Server,
    MemoryStick,
    Container
} from "lucide-react"
import { cn } from "@/lib/utils"

export type ServiceType = "serverless" | "static" | "web_service" | "not_selected" | "object_storage" | "redis"

interface ServiceSelectorProps {
    selectedService: ServiceType | null
    setSelectedService: (value: ServiceType) => void
}

const services = [
    {
        id: "serverless" as ServiceType,
        name: "Serverless Function",
        description: "Deploy scalable serverless functions instantly.",
        icon: Cloud,
    },
    {
        id: "static" as ServiceType,
        name: "Static Site",
        description: "Host frontend apps like NextJs,React, Vue, or HTML.",
        icon: Globe,
    },
    {
        id: "web_service" as ServiceType,
        name: "Web Service",
        description: "Deploy full backend services with runtime in Go, Nodejs.",
        icon: Server,
    },
    {
        id: "redis" as ServiceType,
        name: "Redis Cache",
        description: "Use redis to cache data to make fast your services",
        icon: MemoryStick,
    },
    {
        id: "object_storage" as ServiceType,
        name: "Storage",
        description: "Store your static files",
        icon: Container,
    },

]

export default function ServiceSelector({
    selectedService,
    setSelectedService,
}: ServiceSelectorProps) {
    const [open, setOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () =>
            document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const selected = services.find((s) => s.id === selectedService)

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Create & Deploy
                </h1>
                <p className="text-sm text-muted-foreground">
                    Choose a service type to start your deployment.
                </p>
            </div>

            <div
                ref={dropdownRef}
                className="relative w-full sm:w-auto"
            >
                <Button
                    variant="default"
                    className="w-full sm:w-auto flex justify-between gap-2"
                    onClick={() => setOpen((prev) => !prev)}
                    aria-expanded={open}
                >
                    <div className="flex items-center gap-2">
                        {selected ? (
                            <>
                                <selected.icon className="w-4 h-4" />
                                {selected.name}
                            </>
                        ) : (
                            <>
                                <Plus className="w-4 h-4" />
                                New Service
                            </>
                        )}
                    </div>
                    <ChevronDown
                        className={cn(
                            "w-4 h-4 transition-transform",
                            open && "rotate-180"
                        )}
                    />
                </Button>

                {open && (
                    <div className="absolute right-0 mt-2 w-full sm:w-80 bg-card border rounded-xl shadow-xl p-2 z-20 animate-in fade-in zoom-in-95">
                        {services.map((service) => {
                            const Icon = service.icon
                            const isActive = selectedService === service.id

                            return (
                                <button
                                    key={service.id}
                                    onClick={() => {
                                        setSelectedService(service.id)
                                        setOpen(false)
                                    }}
                                    className={cn(
                                        "w-full text-left flex items-start gap-3 p-3 rounded-lg transition-colors",
                                        isActive
                                            ? "bg-primary/10 border border-primary/20"
                                            : "hover:bg-muted/40"
                                    )}
                                >
                                    <div className="p-2 bg-muted rounded-md">
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                            {service.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {service.description}
                                        </span>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
