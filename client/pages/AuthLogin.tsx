import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Api } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import { handleError, validateRequired } from "@/lib/errors";

export default function AuthLogin() {
  const navigate = useNavigate();
  const [nrc, setNrc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      validateRequired(nrc, "NRC/Passport Number");

      const session = await Api.residentLogin({ identityCardId: nrc });
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
          <CardTitle className="text-2xl">Citizen Sign In</CardTitle>
          <CardDescription>Enter your details to access services</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="nrc">
                NRC or Passport Number
              </label>
              <Input
                id="nrc"
                type="text"
                placeholder="Enter your NRC or Passport number"
                value={nrc}
                onChange={(e) => setNrc(e.target.value)}
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
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="text-sm text-center text-muted-foreground pt-2">
              Not registered?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Register as a citizen
              </Link>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t text-center space-y-2">
            <div>
              <Link to="/staff-login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Staff Login
              </Link>
            </div>
            <div>
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                ← Back to home
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
