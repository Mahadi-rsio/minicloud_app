"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Menu, Settings, UserIcon, LogOut, Wallet } from "lucide-react"

export default function AppBar() {

    const balance = 0

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-4 md:px-8">

                {/* Left Section */}
                <div className="flex items-center gap-4">

                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <div className="flex items-center gap-2 cursor-pointer">
                        <span className="text-xl font-bold tracking-tight">
                            MiniCloud
                        </span>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-3">

                    {/* Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Avatar className="cursor-pointer h-10 w-10">
                                <AvatarImage src="/profile.jpg" />
                                <AvatarFallback>MR</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>
                                Account
                            </DropdownMenuLabel>
                            <div className="px-2 py-1.5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Available Balance</span>
                                    <span className="font-semibold">৳ {balance}</span>
                                </div>
                            </div>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="flex items-center gap-2">
                                <UserIcon className="h-4 w-4" />
                                Profile
                            </DropdownMenuItem>

                            <DropdownMenuItem className="flex items-center gap-2">
                                <Wallet className="h-4 w-4" />
                                Add Balance
                            </DropdownMenuItem>

                            <DropdownMenuItem className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Settings
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="flex items-center gap-2">
                                <LogOut className="h-4 w-4" />
                                Logout
                            </DropdownMenuItem>

                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
        </header>
    )
}
