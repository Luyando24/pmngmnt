import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Api } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Shield, Building, Lock } from "lucide-react";
import { handleError, validateStaffData } from "@/lib/errors";

export default function StaffRegister() {
    const navigate = useNavigate();

    // Staff registration state
    const [departmentName, setDepartmentName] = useState("");
    const [departmentType, setDepartmentType] = useState<"police" | "immigration">("police");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [badgeNumber, setBadgeNumber] = useState("");
    const [rank, setRank] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Validate passwords match
            if (password !== confirmPassword) {
                throw new Error("Passwords do not match");
            }

            validateStaffData({ email, password, firstName, lastName });

            const res = await Api.registerOfficer({
                stationName: departmentType === "police" ? departmentName : undefined,
                immigrationOfficeName: departmentType === "immigration" ? departmentName : undefined,
                email,
                password,
                firstName,
                lastName,
                badgeNumber,
                rank,
                role: "admin",
            });

            saveSession({
                userId: res.userId,
                role: "admin",
                stationId: res.stationId,
                immigrationOfficeId: res.immigrationOfficeId,
                tokens: { accessToken: res.userId, expiresInSec: 3600 },
            });

            // Navigate based on department type
            if (departmentType === "police") {
                navigate("/dashboard/police");
            } else {
                navigate("/immigration");
            }
        } catch (e: any) {
            const errorMessage = String(e?.message || e);
            setError(errorMessage);
            handleError(e, "Staff Registration");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/5">
            <Card className="w-full max-w-2xl shadow-xl border-2">
                <CardHeader className="text-center space-y-4 bg-gradient-to-r from-primary/5 to-primary/10 border-b">
                    <div className="mb-2">
                        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mb-4 shadow-lg ring-4 ring-primary/20">
                            <Shield className="h-10 w-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">IPIMS</h1>
                        <p className="text-sm text-muted-foreground mt-1">Integrated Police & Immigration Management</p>
                    </div>
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-destructive/10 text-destructive rounded-full text-xs font-semibold">
                            <Lock className="h-3 w-3" />
                            STAFF ONLY - RESTRICTED ACCESS
                        </div>
                        <CardTitle className="text-2xl">Department Registration</CardTitle>
                        <CardDescription>Register your Police Station or Immigration Office</CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <form className="grid gap-4" onSubmit={handleSubmit}>
                        {/* Department Information */}
                        <div className="space-y-4 p-4 rounded-lg bg-accent/50 border">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Building className="h-4 w-4" />
                                Department Information
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="department-type" className="text-sm font-medium">
                                    Department Type *
                                </label>
                                <select
                                    id="department-type"
                                    value={departmentType}
                                    onChange={(e) => setDepartmentType(e.target.value as "police" | "immigration")}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    required
                                >
                                    <option value="police">Police Station</option>
                                    <option value="immigration">Immigration Office</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="department" className="text-sm font-medium">
                                    {departmentType === "police" ? "Police Station Name *" : "Immigration Office Name *"}
                                </label>
                                <Input
                                    id="department"
                                    placeholder={departmentType === "police" ? "e.g., Central Police Station, Lusaka" : "e.g., Lusaka Immigration Office"}
                                    value={departmentName}
                                    onChange={(e) => setDepartmentName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Officer Information */}
                        <div className="space-y-4 p-4 rounded-lg bg-accent/50 border">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Shield className="h-4 w-4" />
                                Officer Information
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="first-name">
                                        First Name *
                                    </label>
                                    <Input
                                        id="first-name"
                                        placeholder="John"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="last-name">
                                        Last Name *
                                    </label>
                                    <Input
                                        id="last-name"
                                        placeholder="Banda"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="badge">
                                        Badge Number *
                                    </label>
                                    <Input
                                        id="badge"
                                        placeholder="PO-12345"
                                        value={badgeNumber}
                                        onChange={(e) => setBadgeNumber(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="rank">
                                        Rank
                                    </label>
                                    <Input
                                        id="rank"
                                        placeholder="e.g., Sergeant, Inspector"
                                        value={rank}
                                        onChange={(e) => setRank(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Account Credentials */}
                        <div className="space-y-4 p-4 rounded-lg bg-accent/50 border">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                <Lock className="h-4 w-4" />
                                Account Credentials
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="email">
                                    Official Email *
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="officer@police.gov.zm"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <p className="text-xs text-muted-foreground">Use your official government email address</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="password">
                                    Password *
                                </label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Create a strong password (min. 8 characters)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium" htmlFor="confirm-password">
                                    Confirm Password *
                                </label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="Re-enter your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20">
                                {error}
                            </div>
                        )}

                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded-md space-y-2">
                            <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" x2="12" y1="9" y2="13"></line><line x1="12" x2="12.01" y1="17" y2="17"></line></svg>
                                Important: One-Time Department Registration
                            </p>
                            <p className="text-xs text-amber-800 dark:text-amber-300">
                                Each police station or immigration office can only be registered <strong>once</strong>.
                                This registration creates the initial administrator account for your department.
                                Additional staff members must be added later through the Staff Management section in your dashboard after login.
                            </p>
                        </div>

                        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-3 rounded-md">
                            <p className="text-xs text-blue-800 dark:text-blue-300">
                                <strong>Security Notice:</strong> This registration is for authorized government personnel only.
                                Unauthorized access is strictly prohibited and may result in legal action.
                            </p>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full h-12 text-base">
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Registering Department...
                                </>
                            ) : (
                                <>
                                    <Shield className="mr-2 h-5 w-5" />
                                    Register Department
                                </>
                            )}
                        </Button>

                        <div className="text-sm text-center text-muted-foreground">
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary hover:underline font-medium">
                                Sign in here
                            </Link>
                        </div>
                    </form>

                    <div className="mt-6 pt-6 border-t text-center">
                        <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            ← Back to home
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
