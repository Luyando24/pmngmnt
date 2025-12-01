import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Api } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import { handleError, validateEmail, validateRequired } from "@/lib/errors";

export default function StaffLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            validateRequired(email, "Email");
            validateRequired(password, "Password");

            if (!validateEmail(email)) {
                throw new Error("Please enter a valid email address");
            }

            const session = await Api.login({ email, password });
            saveSession(session);

            if (session.role === "police_officer" || session.role === "supervisor") {
                navigate("/dashboard/police");
            } else if (session.role === "immigration_officer") {
                navigate("/immigration");
            } else if (session.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (e: any) {
            const errorMessage = String(e?.message || e);
            setError(errorMessage);
            handleError(e, "Staff Login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/5">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="text-center space-y-4">
                    <div className="mb-2">
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            <img
                                src="/images/logo.png"
                                alt="IPIMS Logo"
                                className="h-14 w-14 object-contain filter brightness-0 invert"
                            />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">IPIMS Staff</h1>
                        <p className="text-sm text-muted-foreground mt-1">Official Personnel Access</p>
                    </div>
                    <CardTitle className="text-2xl">Staff Sign In</CardTitle>
                    <CardDescription>Enter your credentials to access the system</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="email">
                                Official Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="officer@police.gov.zm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="password">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                        <div className="text-sm text-center text-muted-foreground pt-2">
                            New department or office?{" "}
                            <Link to="/staff-register" className="text-primary hover:underline font-medium">
                                Register your department
                            </Link>
                        </div>
                    </form>

                    <div className="mt-6 pt-6 border-t text-center">
                        <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            ← Back to Citizen Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
