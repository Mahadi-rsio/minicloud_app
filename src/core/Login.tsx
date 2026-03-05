import { useState } from 'react';
import { Github, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { signIn } from '@/lib/authClient'

export function Login() {
    const [isLoading, setIsLoading] = useState(false);




    const handleLogin = async () => {
        setIsLoading(true);
        await signIn.social({
            provider: 'github'
        })
        setIsLoading(false)

    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden p-4">
            {/* Background Glows */}
            <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="z-10 w-full max-w-md"
            >
                {/* --- MAIN CARD WITH BORDER ANIMATION --- */}
                <div className="relative p-[1px] rounded-2xl overflow-hidden">
                    {/* Background Rotating Border */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_340deg,#3b82f6_360deg)]"
                    />

                    <Card className="relative border-none bg-slate-900/90 backdrop-blur-2xl rounded-2xl z-10 shadow-2xl">
                        <CardHeader className="space-y-1 text-center pt-8">
                            <div className="flex justify-center mb-4">
                                <motion.div
                                    whileHover={{ rotate: 360 }}
                                    transition={{ duration: 0.5 }}
                                    className="p-3 bg-slate-800 rounded-xl border border-slate-700"
                                >
                                    <Github className="w-8 h-8 text-white" />
                                </motion.div>
                            </div>
                            <CardTitle className="text-2xl font-bold text-white tracking-tight">
                                DevPortal Login
                            </CardTitle>
                            <CardDescription className="text-slate-400">
                                Authenticate with your GitHub account
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="grid gap-6 pb-10">
                            {/* --- DYNAMIC BUTTON --- */}
                            <div className="relative group">
                                {/* Button Border Animation (Only shows when isLoading is true) */}
                                <AnimatePresence>
                                    {isLoading && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 rounded-xl p-[2px] overflow-hidden"
                                        >
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                                className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_300deg,#60a5fa_360deg)]"
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button
                                    onClick={handleLogin}
                                    disabled={isLoading}
                                    className={`
                    relative w-full h-12 rounded-xl flex items-center justify-center gap-3 font-semibold transition-all duration-300 z-20
                    ${isLoading
                                            ? "bg-slate-900 text-blue-400"
                                            : "bg-white text-slate-950 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98]"
                                        }
                  `}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Redirecting to Flow
                                        </>
                                    ) : (
                                        <>
                                            <Github className="w-5 h-5" />
                                            Continue with GitHub
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="h-[1px] w-full bg-slate-800" />
                                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                    Protected by OAuth 2.0
                                </span>
                                <div className="h-[1px] w-full bg-slate-800" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
};

