import { Shield, Users, FileText, Search, AlertTriangle, Globe, QrCode, UserCheck, Menu, Landmark, Car } from 'lucide-react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/navigation/ThemeToggle";
import { useState } from 'react';

import { User as UserIcon } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/lib/auth';

import Chatbot from '@/components/Landing/Chatbot';
import DemoModal from '@/components/Landing/DemoModal';
import { useAppNavigation } from '@/lib/useAppNavigation';

export default function Index() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleAppClick = useAppNavigation();
  const { session } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Chatbot />
      <DemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <header className="sticky top-0 border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 z-50 shadow-sm">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="IPIMS Logo" className="h-10 w-auto" />
            <div>
              <span className="text-2xl font-bold">IPIMS</span>
              <p className="text-xs text-muted-foreground">Integrated Police & Immigration Management</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-2">
            {session && session.role === 'resident' ? (
              <>
                <Button
                  onClick={() => navigate('/citizen/dashboard')}
                  variant="default"
                  className="rounded-full flex items-center gap-2"
                >
                  <UserIcon className="h-4 w-4" />
                  {(session as any).resident?.firstName || 'Dashboard'}
                </Button>
                <ThemeToggle />
              </>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link to="/register">Register</Link>
                </Button>
                <Button asChild variant="default" className="rounded-full">
                  <Link to="/login">Sign In</Link>
                </Button>
                <ThemeToggle />
              </>
            )}
          </div>
          {/* Mobile Navigation */}
          {/* Mobile Navigation */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            {session && session.role === 'resident' ? (
              <Button
                onClick={() => navigate('/citizen/dashboard')}
                variant="default"
                className="rounded-full flex items-center gap-2"
              >
                <UserIcon className="h-4 w-4" />
                {(session as any).resident?.firstName || 'Dashboard'}
              </Button>
            ) : (
              <Button asChild variant="default" className="rounded-full">
                <Link to="/login">Sign In</Link>
              </Button>
            )}
            <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {
          isMenuOpen && (
            <div className="md:hidden bg-background border-t">
              <nav className="flex flex-col gap-4 p-4">
                <a href="#services" className="text-muted-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Services</a>
                <a href="#apply" className="text-muted-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Apply Online</a>
                <a href="#verify" className="text-muted-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Verify Documents</a>
                <a href="#help" className="text-muted-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Help & Support</a>
                <a href="#news" className="text-muted-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>News</a>
                <a href="#contact" className="text-muted-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>Contact</a>
                <Button asChild variant="ghost">
                  <Link to="/register">Register</Link>
                </Button>
              </nav>
            </div>
          )
        }
      </header >

      <section className="relative bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/nationalassembly.jpeg')" }}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-purple-900/60 to-green-900/40 backdrop-blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20"></div>
        <div className="container mx-auto relative min-h-[70vh] sm:min-h-[78vh] flex items-center justify-center px-4 z-10">
          <div className="text-center text-white max-w-4xl animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tighter bg-gradient-to-r from-white via-blue-100 to-green-100 bg-clip-text text-transparent drop-shadow-2xl">
              Home Affairs & Immigration Services
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-100 drop-shadow-lg font-medium">
              Your official portal for police and immigration services. From incident reporting to visa applications, manage all your home affairs needs in one secure platform.
            </p>
            <div className="mt-10 max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search for services, check application status, or verify documents..."
                  className="w-full p-5 pr-16 rounded-full bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-primary/50 shadow-lg"
                />
                <Button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full h-12 w-12 p-0 bg-primary hover:bg-primary/90">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"></path></svg>
                </Button>
              </div >
            </div >
          </div >
        </div >
      </section >

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            <div className="p-4 rounded-lg transition-all duration-300">
              <h3 className="text-4xl font-bold text-primary">150+</h3>
              <p className="text-muted-foreground mt-2">Service Centers</p>
            </div>
            <div className="p-4 rounded-lg transition-all duration-300">
              <h3 className="text-4xl font-bold text-primary">95%</h3>
              <p className="text-muted-foreground mt-2">Customer Satisfaction</p>
            </div>
            <div className="p-4 rounded-lg transition-all duration-300">
              <h3 className="text-4xl font-bold text-primary">500K+</h3>
              <p className="text-muted-foreground mt-2">Citizens Served</p>
            </div>
            <div className="p-4 rounded-lg transition-all duration-300">
              <h3 className="text-4xl font-bold text-primary">12K+</h3>
              <p className="text-muted-foreground mt-2">Documents Processed</p>
            </div>
            <div className="p-4 rounded-lg transition-all duration-300">
              <h3 className="text-4xl font-bold text-primary">2 Days</h3>
              <p className="text-muted-foreground mt-2">Average Processing</p>
            </div>
            <div className="p-4 rounded-lg transition-all duration-300">
              <h3 className="text-4xl font-bold text-primary">24/7</h3>
              <p className="text-muted-foreground mt-2">Online Access</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="py-20 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in" id="services">
            <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-2 leading-relaxed">Access essential government services online. From reporting incidents to applying for documents, we're here to serve you.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* Category 1 */}
            <div className="group relative text-center p-6 rounded-2xl border bg-card hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                <Shield className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Report Incident</h3>
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Report crimes, accidents, or suspicious activities online.</p>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl">
                <Button onClick={handleAppClick} className="shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Report Now
                </Button>
              </div>
            </div>
            {/* Category 2 */}
            <div className="group relative text-center p-6 rounded-2xl border bg-card hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                <AlertTriangle className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Background Check</h3>
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Request official background checks and clearance certificates.</p>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl">
                <Button onClick={handleAppClick} className="shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Apply Now
                </Button>
              </div>
            </div>
            {/* Category 3 */}
            <div className="group relative text-center p-6 rounded-2xl border bg-card hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                <Globe className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Visa & Permits</h3>
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Apply for visas, work permits, and residency documents.</p>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl">
                <Button onClick={handleAppClick} className="shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Apply Now
                </Button>
              </div>
            </div>
            {/* Category 4 */}
            <div className="group relative text-center p-6 rounded-2xl border bg-card hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                <Car className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Emergency Services</h3>
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Access emergency contacts and safety information.</p>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl">
                <Button onClick={handleAppClick} className="shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  View Info
                </Button>
              </div>
            </div>
            {/* Category 5 */}
            <div className="group relative text-center p-6 rounded-2xl border bg-card hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                <Users className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Resident Database</h3>
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Manage national and foreign resident records.</p>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl">
                <Button onClick={handleAppClick} className="shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Access Portal
                </Button>
              </div>
            </div>
            {/* Category 6 */}
            <div className="group relative text-center p-6 rounded-2xl border bg-card hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                <UserCheck className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Identity Verification</h3>
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Verify your identity and access digital certificates.</p>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl">
                <Button onClick={handleAppClick} className="shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Verify Now
                </Button>
              </div>
            </div>
            {/* Category 7 */}
            <div className="group relative text-center p-6 rounded-2xl border bg-card hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                <QrCode className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Document Verification</h3>
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Verify the authenticity of government documents instantly.</p>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl">
                <Button asChild className="shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  <Link to="/scan">Verify Now</Link>
                </Button>
              </div>
            </div>
            {/* Category 8 */}
            <div className="group relative text-center p-6 rounded-2xl border bg-card hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-primary mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                <FileText className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors duration-300">Reports & Analytics</h3>
              <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Generate reports and view system analytics.</p>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-primary/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-2xl">
                <Button onClick={handleAppClick} className="shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                  Access Portal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30 animate-fade-in" id="apply">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Popular Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Most requested services by citizens and organizations - apply online and track your progress.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-card to-card/80 rounded-2xl p-8 shadow-xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                  <Shield className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center group-hover:text-primary transition-colors duration-300">Online Reporting</h3>
              <p className="text-muted-foreground mb-6 text-center leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">Report incidents, file complaints, and track the status of your police cases online.</p>
              <Button onClick={handleAppClick} variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 shadow-md hover:shadow-lg">
                Report Case
              </Button>
            </div>
            <div className="group bg-gradient-to-br from-card to-card/80 rounded-2xl p-8 shadow-xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                  <Globe className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center group-hover:text-primary transition-colors duration-300">Visa Applications</h3>
              <p className="text-muted-foreground mb-6 text-center leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">Apply for tourist, business, student, and work visas online with real-time status tracking.</p>
              <Button onClick={handleAppClick} variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 shadow-md hover:shadow-lg">
                Apply for Visa
              </Button>
            </div>
            <div className="group bg-gradient-to-br from-card to-card/80 rounded-2xl p-8 shadow-xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                  <FileText className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center group-hover:text-primary transition-colors duration-300">Work Permits</h3>
              <p className="text-muted-foreground mb-6 text-center leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">Obtain work permits and employment authorization documents with fast processing times.</p>
              <Button onClick={handleAppClick} variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 shadow-md hover:shadow-lg">
                Apply for Permit
              </Button>
            </div>
            <div className="group bg-gradient-to-br from-card to-card/80 rounded-2xl p-8 shadow-xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                  <UserCheck className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center group-hover:text-primary transition-colors duration-300">Identity Verification</h3>
              <p className="text-muted-foreground mb-6 text-center leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">Get verified digital identity certificates for government and private services.</p>
              <Button onClick={handleAppClick} variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 shadow-md hover:shadow-lg">
                Verify Identity
              </Button>
            </div>
            <div className="group bg-gradient-to-br from-card to-card/80 rounded-2xl p-8 shadow-xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                  <Landmark className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center group-hover:text-primary transition-colors duration-300">Passport Services</h3>
              <p className="text-muted-foreground mb-6 text-center leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">Apply for new passports, renewals, and access your digital passport instantly.</p>
              <Button onClick={handleAppClick} variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 shadow-md hover:shadow-lg">
                Passport Services
              </Button>
            </div>
            <div className="group bg-gradient-to-br from-card to-card/80 rounded-2xl p-8 shadow-xl border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:scale-105 hover:-translate-y-2">
              <div className="flex items-center justify-center mb-6">
                <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300">
                  <QrCode className="h-7 w-7 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center group-hover:text-primary transition-colors duration-300">Residency Permits</h3>
              <p className="text-muted-foreground mb-6 text-center leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">Apply for temporary or permanent residency with streamlined online processing.</p>
              <Button onClick={handleAppClick} variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 shadow-md hover:shadow-lg">
                Apply for Residency
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* News & Updates Section */}
      <section className="py-20 animate-fade-in" id="news">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">News & Updates</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-2 leading-relaxed">Stay informed with the latest service updates and announcements.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* News 1 */}
            <article className="group bg-gradient-to-br from-card to-card/80 rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:scale-105 hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <img src="/images/citizens.jpg" alt="" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">June 1, 2024</p>
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">New Digital Identity System Launched</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">Enhanced security features and faster processing times for all identity verification services.</p>
                <Link to="#" className="inline-flex items-center text-primary font-semibold hover:underline group-hover:translate-x-1 transition-transform duration-300">
                  Read More
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="m9 18 6-6-6-6" /></svg>
                </Link>
              </div>
            </article>
            {/* News 2 */}
            <article className="group bg-gradient-to-br from-card to-card/80 rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:scale-105 hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <img src="/images/business.jpg" alt="" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">May 25, 2024</p>
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">Faster Visa Processing Now Available</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">New express processing options reduce visa application times by up to 50%.</p>
                <Link to="#" className="inline-flex items-center text-primary font-semibold hover:underline group-hover:translate-x-1 transition-transform duration-300">
                  Read More
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="m9 18 6-6-6-6" /></svg>
                </Link>
              </div>
            </article>
            {/* News 3 */}
            <article className="group bg-gradient-to-br from-card to-card/80 rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:scale-105 hover:-translate-y-2">
              <div className="relative overflow-hidden">
                <img src="/images/civil.jpg" alt="" className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                  </div>
                  <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors duration-300">May 15, 2024</p>
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors duration-300">24/7 Online Services Now Available</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed group-hover:text-foreground/80 transition-colors duration-300">Submit applications and access services anytime with our new round-the-clock online platform.</p>
                <Link to="#" className="inline-flex items-center text-primary font-semibold hover:underline group-hover:translate-x-1 transition-transform duration-300">
                  Read More
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="m9 18 6-6-6-6" /></svg>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-background animate-fade-in" id="contact">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Contact Support</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Have questions or need help? Our support team is here for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div className="space-y-8">
              <h3 className="text-2xl font-semibold">Support Channels</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Email</div>
                    <div className="text-muted-foreground">support@ipims.gov.zm</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Phone</div>
                    <div className="text-muted-foreground">+260 211 123456</div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Address</div>
                    <div className="text-muted-foreground">
                      Government Complex, Independence Avenue<br />
                      Lusaka, Zambia
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-muted/30 rounded-lg p-8">
              <h3 className="text-2xl font-semibold mb-6">Send us a Message</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="john.doe@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Help with Visa Application"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    rows={5}
                    className="w-full px-4 py-3 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Please describe your issue in detail..."
                  />
                </div>

                <Button type="submit" className="w-full py-3 text-base">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-muted/30 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-4">About Our Services</h3>
              <p className="text-muted-foreground text-sm">
                Your one-stop digital platform for government services. Access police and immigration services online with secure, fast processing.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#services" className="text-muted-foreground hover:text-primary">Our Services</a></li>
                <li><a href="#apply" className="text-muted-foreground hover:text-primary">Apply Online</a></li>
                <li><Link to="/scan" className="text-muted-foreground hover:text-primary">Verify Documents</Link></li>
                <li><a href="#contact" className="text-muted-foreground hover:text-primary">Contact Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-muted-foreground hover:text-primary">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg></a>
                <a href="#" className="text-muted-foreground hover:text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 2.8 3.2 3 5.2-1.4 1.2-3 2-5 2h-1.5c-1.2 0-2.3-.4-3.2-1.2.9-1.6 1.7-3.2 2.2-4.8-1.6-1.4-3-2.8-4-4 .7-1.3 1.5-2.5 2.5-3.5C13.4 5.1 15 6.5 17 8c-1.2-1.8-2-3.8-2-6h2c.5 2.2 1.5 4.2 3 6Z"></path><path d="M2 22s.7-2.1 2-3.4c-1.6-1.4-2.8-3.2-3-5.2 1.4-1.2 3-2 5-2h1.5c1.2 0 2.3.4 3.2-1.2-.9 1.6-1.7 3.2-2.2 4.8 1.6 1.4 3 2.8 4 4-.7 1.3-1.5 2.5-2.5 3.5C8.6 18.9 7 17.5 5 16c1.2 1.8 2 3.8 2 6H5c-.5-2.2-1.5-4.2-3-6Z"></path></svg></a>
                <a href="#" className="text-muted-foreground hover:text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
              </div>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
            &copy; 2024 IPIMS - Integrated Police & Immigration Management System. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}