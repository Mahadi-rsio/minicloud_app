import { device } from "@/lib/authClient";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Loader2, Copy } from "lucide-react";
import { toast } from "sonner";

export default function DeviceApprovalPage() {

    const [searchParams] = useSearchParams();
    const userCode = searchParams.get("user_code");

    const [loading, setLoading] = useState(false);

    const formattedCode = userCode
        ? `${userCode.slice(0, 4)}-${userCode.slice(4, 8)}`
        : "UNKNOWN";

    const copyCode = async () => {
        if (!userCode) return;

        await navigator.clipboard.writeText(formattedCode);
        toast.success("Code copied to clipboard");
    };

    const handleApprove = async () => {

        if (!userCode) {
            toast.error("Invalid device code");
            return;
        }

        setLoading(true);

        try {

            await device.approve({
                userCode
            });

            toast.success("Device approved successfully!");

            setTimeout(() => {
                window.location.href = "/";
            }, 1200);

        } catch {

            toast.error("Failed to approve device");

        }

        setLoading(false);
    };

    const handleDeny = async () => {

        if (!userCode) {
            toast.error("Invalid device code");
            return;
        }

        setLoading(true);

        try {

            await device.deny({
                userCode
            });

            toast.error("Device access denied");

            setTimeout(() => {
                window.location.href = "/";
            }, 1200);

        } catch {

            toast.error("Failed to deny device");

        }

        setLoading(false);
    };

    return (

        <div className="flex items-center justify-center min-h-screen bg-muted p-4">

            <Card className="w-full max-w-md shadow-xl border">

                <CardHeader className="text-center space-y-2">

                    <CardTitle className="text-2xl font-semibold">
                        Device Authorization
                    </CardTitle>

                    <CardDescription>
                        A device is requesting access to your account
                    </CardDescription>

                </CardHeader>

                <CardContent className="space-y-6">

                    {/* Device Code */}

                    <div className="text-center space-y-2">

                        <p className="text-sm text-muted-foreground">
                            Device Code
                        </p>

                        <div className="flex items-center justify-center gap-2">

                            <p className="text-xl font-bold tracking-[0.35em]">
                                {formattedCode}
                            </p>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={copyCode}
                                disabled={!userCode}
                            >
                                <Copy className="h-4 w-4" />
                            </Button>

                        </div>

                    </div>

                    {/* Warning */}

                    <div className="text-xs text-muted-foreground text-center">
                        Only approve if you started this request on another device.
                    </div>

                    {/* Buttons */}

                    <div className="flex gap-4">

                        <Button
                            onClick={handleApprove}
                            className="flex-1 flex items-center justify-center gap-2"
                            disabled={loading}
                        >

                            {loading && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}

                            {loading ? "Approving..." : "Approve"}

                        </Button>

                        <Button
                            variant="destructive"
                            onClick={handleDeny}
                            className="flex-1 flex items-center justify-center gap-2"
                            disabled={loading}
                        >
                            Deny
                        </Button>

                    </div>

                </CardContent>

            </Card>

        </div>
    );
}
