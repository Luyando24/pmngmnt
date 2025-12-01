import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Api } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import { handleError, validateEmail, validateRequired } from "@/lib/errors";
import { Shield, Users, Globe } from "lucide-react";

export default function AuthLogin() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"staff" | "citizen">("staff");

  // Staff login state
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");

  // Citizen login state
  const [citizenNrc, setCitizenNrc] = useState("");
  const [citizenPassword, setCitizenPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      validateRequired(staffEmail, "Email");
      validateRequired(staffPassword, "Password");

      if (!validateEmail(staffEmail)) {
        throw new Error("Please enter a valid email address");
      }

      const session = await Api.login({ email: staffEmail, password: staffPassword });
      saveSession(session);

      // Navigate based on user role
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

  const handleCitizenLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      validateRequired(citizenNrc, "NRC/Passport Number");

      const session = await Api.residentLogin({ identityCardId: citizenNrc });
      saveSession(session);
      navigate("/citizen/dashboard");
    } catch (e: any) {
      const errorMessage = String(e?.message || e);
      setError(errorMessage);
      handleError(e, "Citizen Login");
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">IPIMS</h1>
            <p className="text-sm text-muted-foreground mt-1">Integrated Police & Immigration Management</p>
          </div>
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Choose your account type to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={userType} onValueChange={(v) => setUserType(v as "staff" | "citizen")} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="staff" className="gap-2">
                <Shield className="h-4 w-4" />
                Staff
              </TabsTrigger>
              <TabsTrigger value="citizen" className="gap-2">
                <Users className="h-4 w-4" />
                Citizen
              </TabsTrigger>
            </TabsList>

            {/* Staff Login */}
            <TabsContent value="staff">
              <form className="space-y-4" onSubmit={handleStaffLogin}>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="staff-email">
                    Official Email
                  </label>
                  <Input
                    id="staff-email"
                    type="email"
                    placeholder="officer@police.gov.zm"
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="staff-password">
                    Password
                  </label>
                  <Input
                    id="staff-password"
                    type="password"
                    placeholder="Enter your password"
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    required
                  />
                </div>
                {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Signing in..." : "Sign In as Staff"}
                </Button>
                <div className="text-sm text-center text-muted-foreground pt-2">
                  New department or office?{" "}
                  <Link to="/staff-register" className="text-primary hover:underline font-medium">
                    Register your department
                  </Link>
                </div>
              </form>
            </TabsContent>

            {/* Citizen Login */}
            <TabsContent value="citizen">
              <form className="space-y-4" onSubmit={handleCitizenLogin}>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="citizen-nrc">
                    NRC or Passport Number
                  </label>
                  <Input
                    id="citizen-nrc"
                    type="text"
                    placeholder="Enter your NRC or Passport number"
                    value={citizenNrc}
                    onChange={(e) => setCitizenNrc(e.target.value)}
                    required
                  />
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-3 rounded-md">
                  <p className="text-xs text-blue-800 dark:text-blue-300">
                    <strong>Note:</strong> First-time users can login with just their NRC/Passport number. You may set up a password later for enhanced security.
                  </p>
                </div>
                {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Signing in..." : "Sign In as Citizen"}
                </Button>
                <div className="text-sm text-center text-muted-foreground pt-2">
                  Not registered?{" "}
                  <Link to="/register" className="text-primary hover:underline font-medium">
                    Register as a citizen
                  </Link>
                </div>
              </form>
            </TabsContent>
          </Tabs>

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
