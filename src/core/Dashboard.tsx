"use client"

import { useState, useMemo, useEffect } from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
    ContextMenuShortcut,
} from "@/components/ui/context-menu"
import {
    MoreVertical,
    Trash2,
    Edit,
    FolderKanban,
    PauseCircle,
    PlayCircle,
    PlusIcon,
    Search,
    Calendar as CalendarIcon,
    Filter,
    Ghost,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

type Status = "active" | "paused" | "completed"

export type Project = {
    id: string
    name: string
    description: string
    status: Status
    createdAt: string
}

export default function Dashboard() {
    // --- State ---
    const [projects, setProjects] = useState<Project[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [statusFilter, setStatusFilter] = useState<Status | "all">("all")

    // Form State
    const [open, setOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    // Form Fields
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    })

    const navigate = useNavigate()

    // --- Navigation ---
    const handleNavigate = (project: Project) => {
        navigate("/project", {
            state: {
                id: project.id,
                name: project.name,
                description: project.description,
                status: project.status,
                createdAt: project.createdAt,
            },
        })
    }

    // --- Helpers ---
    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
        })
        setEditingId(null)
    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
        if (!isOpen) resetForm()
    }

    const startEdit = (project: Project) => {
        setEditingId(project.id)
        setFormData({
            name: project.name,
            description: project.description,
        })
        setOpen(true)
    }

    // --- CRUD Operations ---
    const handleSave = (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!formData.name.trim()) return

        if (editingId) {
            setProjects(prev =>
                prev.map(p =>
                    p.id === editingId ? { ...p, ...formData } : p
                )
            )
        } else {
            const newProject: Project = {
                id: String(Date.now()),
                status: "active",
                createdAt: new Date().toISOString(),
                ...formData,
            }
            setProjects(prev => [newProject, ...prev])
        }
        handleOpenChange(false)
    }

    const deleteProject = (id: string) => {
        setProjects(prev => prev.filter(p => p.id !== id))
    }

    const toggleStatus = (id: string) => {
        setProjects(prev =>
            prev.map(p =>
                p.id === id
                    ? {
                        ...p,
                        status: p.status === "active" ? "paused" : "active",
                    }
                    : p
            )
        )
    }

    // --- Save to localStorage ---
    useEffect(() => {
        localStorage.setItem("projects", JSON.stringify(projects))
    }, [projects])

    useEffect(() => {
        const saved = localStorage.getItem("projects")
        if (saved) setProjects(JSON.parse(saved))
    }, [])

    // --- Filtering Logic ---
    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            const matchesSearch = p.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            const matchesFilter =
                statusFilter === "all" || p.status === statusFilter
            return matchesSearch && matchesFilter
        })
    }, [projects, searchQuery, statusFilter])

    // --- UI ---
    return (
        <div className="p-6 space-y-8 max-w-6xl mx-auto">

            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">
                        Manage your ongoing projects and sprints.
                    </p>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search projects..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Filter Status</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter("paused")}>Paused</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Create Button */}
                    <Dialog open={open} onOpenChange={handleOpenChange}>
                        <DialogTrigger asChild>
                            <Button>
                                <PlusIcon className="h-4 w-4 mr-2" /> New Project
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>{editingId ? "Edit Project" : "Create Project"}</DialogTitle>
                            </DialogHeader>

                            <form onSubmit={handleSave} className="space-y-6 py-4">
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <Label>Project Name</Label>
                                        <Input
                                            value={formData.name}
                                            onChange={e =>
                                                setFormData({
                                                    ...formData,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="e.g. Q4 Marketing Sprint"
                                            autoFocus
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            value={formData.description}
                                            onChange={e =>
                                                setFormData({
                                                    ...formData,
                                                    description: e.target.value,
                                                })
                                            }
                                            placeholder="Add details..."
                                            className="h-24"
                                        />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => handleOpenChange(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">Save Project</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Main Content Area */}
            {filteredProjects.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map(project => (
                        <Card
                            onClick={() => handleNavigate(project)}
                            key={project.id}
                            className="group relative hover:border-primary/50 transition-all duration-300 cursor-pointer"
                        >
                            <CardHeader className="pb-1">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="line-clamp-1 my-2">
                                            <div className="flex gap-2 items-center mx-1 my-1">
                                                <FolderKanban size={15} />
                                                {project.name}
                                            </div>
                                        </CardTitle>
                                    </div>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="-mr-2 h-8 w-8 text-muted-foreground"
                                            >
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => startEdit(project)}>
                                                <Edit className="h-4 w-4 mr-2" /> Edit Details
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => toggleStatus(project.id)}>
                                                {project.status === "active" ? (
                                                    <>
                                                        <PauseCircle className="h-4 w-4 mr-2" /> Pause Project
                                                    </>
                                                ) : (
                                                    <>
                                                        <PlayCircle className="h-4 w-4 mr-2" /> Resume Project
                                                    </>
                                                )}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => deleteProject(project.id)}>
                                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </CardHeader>

                            <CardFooter className="pt-1 border-t bg-muted/20 flex justify-between items-center text-xs text-muted-foreground h-6">
                                <div className="flex items-center gap-1">
                                    <CalendarIcon className="h-3 w-3" />
                                    {project.createdAt
                                        ? new Date(project.createdAt).toLocaleDateString()
                                        : "No due date"}
                                </div>
                                <div
                                    className={`flex items-center gap-1.5 ${project.status === "active"
                                        ? "text-emerald-600"
                                        : "text-slate-500"
                                        }`}
                                >
                                    <div
                                        className={`h-2 w-2 rounded-full ${project.status === "active"
                                            ? "bg-emerald-500 animate-pulse"
                                            : "bg-slate-400"
                                            }`}
                                    />
                                    <span className="capitalize font-medium">{project.status}</span>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                /* EMPTY STATE CONTEXT MENU AREA */
                <ContextMenu>
                    <ContextMenuTrigger className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed rounded-xl bg-muted/30 text-center animate-in fade-in-50">
                        <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                            <FolderKanban className="h-10 w-10 text-muted-foreground/50" />
                        </div>
                        <h3 className="text-xl font-semibold tracking-tight">No projects found</h3>
                        <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-sm">
                            {searchQuery
                                ? "Try adjusting your search query or filters to find what you're looking for."
                                : "Right-click anywhere in this box to access the menu, or create a new project below."}
                        </p>
                        <Button onClick={() => setOpen(true)}>
                            <PlusIcon className="h-4 w-4 mr-2" /> Create First Project
                        </Button>
                    </ContextMenuTrigger>

                    <ContextMenuContent className="w-64">
                        <ContextMenuItem inset onClick={() => setOpen(true)}>
                            <PlusIcon className="h-4 w-4 mr-2" />
                            Create New Project
                            <ContextMenuShortcut>⌘N</ContextMenuShortcut>
                        </ContextMenuItem>
                        <ContextMenuItem inset disabled>
                            <FolderKanban className="h-4 w-4 mr-2" />
                            Import from Trello
                        </ContextMenuItem>
                        <ContextMenuSeparator />
                        <ContextMenuItem
                            inset
                            onClick={() => {
                                setSearchQuery("")
                                setStatusFilter("all")
                            }}
                        >
                            <Ghost className="h-4 w-4 mr-2" />
                            Clear Filters
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
            )}
        </div>
    )
}
