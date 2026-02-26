import { useState } from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
    const [user, setUser] = useState({
        name: "Jane Doe",
        email: "jane@example.com",
        joinedAt: "2023-08-15",
        userId: "user_123456",
        role: "Admin",
        subscription: "Pro",
        company: "Acme Cloud",
        avatar: "",
    })

    const [editing, setEditing] = useState(false)
    const [form, setForm] = useState(user)
    const [twoFAEnabled, setTwoFAEnabled] = useState(false)

    const handleChange = (key: any, value: any) => setForm({ ...form, [key]: value })
    const handleSave = () => {
        setUser({ ...user, ...form })
        setEditing(false)
        alert("Profile saved!")
    }
    return (
        <div className="min-h-screen p-2 flex justify-center">
            <div className="w-full max-w-3xl space-y-6">
                {/* Profile Card */}
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                        <Avatar className="h-16 w-16 mb-3 sm:mb-0">
                            {user.avatar ? (
                                <AvatarImage src={user.avatar} alt={user.name} />
                            ) : (
                                <AvatarFallback>{user.name[0]}</AvatarFallback>
                            )}
                        </Avatar>
                        <div>
                            <CardTitle className="text-lg">{user.name}</CardTitle>
                            <CardDescription>{user.email}</CardDescription>
                            <div className="mt-2 flex items-center gap-2 flex-wrap">
                                <Badge variant="secondary">{user.role}</Badge>
                                <Badge variant="outline">{user.subscription}</Badge>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            {editing ? (
                                <>
                                    <Label>Company</Label>
                                    <Input
                                        value={form.company}
                                        onChange={(e) => handleChange("company", e.target.value)} />
                                    <Label>Name</Label>
                                    <Input
                                        value={form.name}
                                        onChange={e => handleChange("name", e.target.value)} />
                                </>
                            ) : (
                                <>
                                    <Label>Company</Label>
                                    <p className="text-sm text-muted-foreground">{user.company}</p>

                                </>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>User ID</Label>
                            <p className="text-sm text-muted-foreground">{user.userId}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {editing ? (
                                <>
                                    <Button onClick={handleSave}>Save</Button>
                                    <Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
                                </>
                            ) : (
                                <Button variant="outline" onClick={() => setEditing(true)}>Edit</Button>
                            )}
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <CardTitle className="text-sm">Security</CardTitle>
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-sm">Two-factor authentication</p>
                                    <p className="text-xs text-muted-foreground">Use an authenticator app for stronger security</p>
                                </div>
                                <Switch checked={twoFAEnabled} onCheckedChange={() => setTwoFAEnabled((v) => !v)} />
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <CardTitle className="text-sm">Subscription</CardTitle>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <div>
                                    <p className="text-sm">{user.subscription} plan</p>
                                    <p className="text-xs text-muted-foreground">Billed monthly · Next invoice: Mar 1, 2026</p>
                                </div>
                                <Button onClick={() => alert("Manage billing - demo")}>Manage billing</Button>
                            </div>
                        </div>
                        <Separator />

                        <div className="space-y-2">
                            <CardTitle className="text-sm">Notification Preferences</CardTitle>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 border rounded">
                                    <div>
                                        <p className="font-medium text-sm">Email alerts</p>
                                        <p className="text-xs text-muted-foreground">Account and billing updates</p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between p-2 border rounded">
                                    <div>
                                        <p className="font-medium text-sm">Product updates</p>
                                        <p className="text-xs text-muted-foreground">News about product and releases</p>
                                    </div>
                                    <Switch />
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex flex-wrap gap-2">
                            <Button variant="destructive" onClick={() => alert("Account deleted - demo")}>Delete account</Button>
                            <Button onClick={() => alert("Logged out - demo")}>Log out</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
