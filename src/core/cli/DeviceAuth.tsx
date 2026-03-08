import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";

import { device, getSession } from "@/lib/authClient";

import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function DeviceAuthorizationPage() {

    const [userCode, setUserCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const inputRef = useRef<HTMLInputElement>(null);

    const user_code = searchParams.get("user_code");

    async function validateUser() {
        const { data, error } = await getSession();

        if (error) {
            toast.error(error.message);
            navigate("/login");
            return;
        }

        toast.success("Logged in as " + data?.user.email);
    }

    const formatCode = (value: string) => {
        const cleaned = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

        if (cleaned.length <= 4) return cleaned;

        return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}`;
    };

    const submitCode = async (code: string) => {
        setLoading(true);
        setError(null);

        try {

            const formattedCode = code.replace(/-/g, "");

            const response = await device({
                query: { user_code: formattedCode },
            });

            if (response.data) {
                navigate(`/device/approve?user_code=${formattedCode}`);
            }

        } catch {
            setError("Invalid or expired device code");
        }

        setLoading(false);
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        submitCode(userCode);
    };

    useEffect(() => {
        validateUser();

        // focus input
        inputRef.current?.focus();

        // auto submit if url contains code
        if (user_code) {

            const formatted = formatCode(user_code);
            setUserCode(formatted);

            submitCode(formatted);
        }

    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-muted p-4">

            <Card className="w-full max-w-md shadow-xl border">

                <CardHeader className="text-center space-y-2">

                    <CardTitle className="text-2xl font-semibold">
                        Connect a Device
                    </CardTitle>

                    <CardDescription>
                        Enter the code shown on your device
                    </CardDescription>

                </CardHeader>

                <CardContent>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <Input
                            ref={inputRef}
                            type="text"
                            value={userCode}
                            disabled={loading}
                            onChange={(e) =>
                                setUserCode(formatCode(e.target.value))
                            }
                            placeholder="ABCD-1234"
                            className="text-center text-lg tracking-[0.3em] font-medium"
                            maxLength={9}
                        />

                        {error && (
                            <div className="text-sm text-red-500 text-center bg-red-50 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2"
                            disabled={loading || userCode.length < 8}
                        >

                            {loading && (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            )}

                            {loading ? "Checking Code..." : "Continue"}

                        </Button>

                    </form>

                </CardContent>

            </Card>

        </div>
    );
}
