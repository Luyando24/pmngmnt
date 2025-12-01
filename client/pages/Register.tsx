import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Api } from "@/lib/api";
import { saveSession } from "@/lib/auth";
import { useNavigate, Link } from "react-router-dom";
import { Loader2, Users, User, Phone, MapPin, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { handleError } from "@/lib/errors";

export default function Register() {
  const navigate = useNavigate();

  // Citizen registration state
  const [isZambianCitizen, setIsZambianCitizen] = useState(true);
  const [nrc, setNrc] = useState("");
  const [passport, setPassport] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [nationality, setNationality] = useState("Zambia");
  const [country, setCountry] = useState("Zambia");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await Api.registerResident({
        nrc,
        passportNumber: passport,
        firstName,
        lastName,
        gender,
        dob,
        phone,
        address,
        nationality,
        residencyStatus: "citizen",
        emergencyContactName: "",
        emergencyContactPhone: "",
        occupation: "",
        maritalStatus: "single",
      });

      console.log('=== REGISTRATION DEBUG ===');
      console.log('Full API response:', res);
      console.log('Resident in response:', res.resident);
      console.log('Resident fields:', {
        id: res.resident?.id,
        firstName: res.resident?.firstName,
        lastName: res.resident?.lastName,
        nrc: res.resident?.nrc,
        phone: res.resident?.phone,
        address: res.resident?.address,
        email: res.resident?.email
      });
      console.log('=== END DEBUG ===');

      saveSession(res);
      navigate("/citizen/dashboard");
    } catch (e: any) {
      const errorMessage = String(e?.message || e);
      setError(errorMessage);
      handleError(e, "Citizen Registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/5">
      <Card className="w-full max-w-2xl shadow-xl">
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
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
              <Users className="h-3 w-3" />
              CITIZEN REGISTRATION
            </div>
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>Register to access police and immigration services</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4" onSubmit={handleSubmit}>
            {/* Nationality Type */}
            <div className="space-y-4 p-4 rounded-lg bg-accent/50 border">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Globe className="h-4 w-4" />
                Citizenship Status
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Are you a Zambian Citizen? *</label>
                <Select
                  value={isZambianCitizen ? "zambian" : "foreign"}
                  onValueChange={(value) => {
                    setIsZambianCitizen(value === "zambian");
                    if (value === "zambian") {
                      setNationality("Zambia");
                      setCountry("Zambia");
                    } else {
                      setNationality("");
                      setCountry("");
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zambian">Yes, I am a Zambian Citizen</SelectItem>
                    <SelectItem value="foreign">No, I am a Foreign National</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Identity Documents */}
            <div className="space-y-4 p-4 rounded-lg bg-accent/50 border">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Globe className="h-4 w-4" />
                Identity Documents
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {isZambianCitizen ? (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="nrc">
                        NRC Number *
                      </label>
                      <Input
                        id="nrc"
                        placeholder="123456/78/1"
                        value={nrc}
                        onChange={(e) => setNrc(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">Required for Zambian citizens</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="passport">
                        Passport Number
                      </label>
                      <Input
                        id="passport"
                        placeholder="ZM1234567"
                        value={passport}
                        onChange={(e) => setPassport(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Optional</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="passport">
                        Passport Number *
                      </label>
                      <Input
                        id="passport"
                        placeholder="AB1234567"
                        value={passport}
                        onChange={(e) => setPassport(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">Required for foreign nationals</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="nrc">
                        NRC Number
                      </label>
                      <Input
                        id="nrc"
                        placeholder="123456/78/1"
                        value={nrc}
                        onChange={(e) => setNrc(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Optional if you have one</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4 p-4 rounded-lg bg-accent/50 border">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <User className="h-4 w-4" />
                Personal Information
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="firstName">
                    First Name *
                  </label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="lastName">
                    Last Name *
                  </label>
                  <Input
                    id="lastName"
                    placeholder="Banda"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label htmlFor="gender" className="text-sm font-medium">
                    Gender *
                  </label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as "male" | "female")}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="dob">
                    Date of Birth *
                  </label>
                  <Input
                    id="dob"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                </div>
              </div>

              {!isZambianCitizen && (
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="country">
                    Country of Origin *
                  </label>
                  <Select
                    value={country}
                    onValueChange={(value) => {
                      setCountry(value);
                      setNationality(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Zimbabwe">Zimbabwe</SelectItem>
                      <SelectItem value="South Africa">South Africa</SelectItem>
                      <SelectItem value="Malawi">Malawi</SelectItem>
                      <SelectItem value="Tanzania">Tanzania</SelectItem>
                      <SelectItem value="Botswana">Botswana</SelectItem>
                      <SelectItem value="Namibia">Namibia</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-4 p-4 rounded-lg bg-accent/50 border">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Phone className="h-4 w-4" />
                Contact Information
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="phone">
                    Phone Number *
                  </label>
                  <Input
                    id="phone"
                    placeholder="+260 XXX XXX XXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium" htmlFor="address">
                    Address *
                  </label>
                  <Input
                    id="address"
                    placeholder="123 Main Street, Lusaka"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive font-medium">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button className="w-full" type="submit" size="lg" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Users className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>

            {/* Login Link */}
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/auth/login" className="text-primary hover:underline font-semibold">
                Login here
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}