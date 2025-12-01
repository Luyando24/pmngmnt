import { useState, useEffect } from 'react';
import { Shield, Users, FileText, Globe, AlertTriangle, QrCode, UserCheck, Car, Camera, FileSearch, HelpCircle, LogOut, User, Bell, ChevronRight, Menu, X, Settings, LayoutDashboard, CreditCard, FileBarChart, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { cn } from '@/lib/utils';

export default function CitizenDashboard() {
    const { session, setSession } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [notifications] = useState(3);
    const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile && !sidebarOpen) {
                setSidebarOpen(true);
            } else if (mobile && sidebarOpen) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        setSession(null);
        navigate('/');
    };

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    const quickServices = [
        {
            icon: Shield,
            title: "Report Incident",
            description: "Report crimes, accidents, or suspicious activities",
            link: "/services/report-case",
            color: "from-red-500/20 to-red-500/10",
            iconColor: "text-red-600"
        },
        {
            icon: CreditCard,
            title: "NRC Application",
            description: "Apply for National Registration Card",
            link: "/services/nrc",
            color: "from-emerald-500/20 to-emerald-500/10",
            iconColor: "text-emerald-600"
        },
        {
            icon: Globe,
            title: "Passport Application",
            description: "Apply for new Passport or Renewal",
            link: "/services/passport",
            color: "from-sky-500/20 to-sky-500/10",
            iconColor: "text-sky-600"
        },
        {
            icon: Users,
            title: "Birth Certificate",
            description: "Register a new birth",
            link: "/services/birth-certificate",
            color: "from-pink-500/20 to-pink-500/10",
            iconColor: "text-pink-600"
        },
        {
            icon: FileText,
            title: "Death Certificate",
            description: "Register a death",
            link: "/services/death-certificate",
            color: "from-slate-500/20 to-slate-500/10",
            iconColor: "text-slate-600"
        },
        {
            icon: Camera,
            title: "Fingerprint Application",
            description: "Apply for fingerprinting services",
            link: "/services/fingerprint",
            color: "from-blue-500/20 to-blue-500/10",
            iconColor: "text-blue-600"
        },
        {
            icon: FileSearch,
            title: "Lost Documents",
            description: "Report lost NRC or passport",
            link: "/services/lost-documents",
            color: "from-amber-500/20 to-amber-500/10",
            iconColor: "text-amber-600"
        },
        {
            icon: AlertTriangle,
            title: "Background Check",
            description: "Request police clearance certificate",
            link: "/services/background-check",
            color: "from-purple-500/20 to-purple-500/10",
            iconColor: "text-purple-600"
        },
        {
            icon: Globe,
            title: "Visa & Permits",
            description: "Apply for visas and work permits",
            link: "/immigration/permits",
            color: "from-green-500/20 to-green-500/10",
            iconColor: "text-green-600"
        },
        {
            icon: UserCheck,
            title: "Identity Verification",
            description: "Verify your identity documents",
            link: "/verification",
            color: "from-indigo-500/20 to-indigo-500/10",
            iconColor: "text-indigo-600"
        },
        {
            icon: QrCode,
            title: "Document Verification",
            description: "Verify government documents",
            link: "/dashboard/police/scan-qr",
            color: "from-cyan-500/20 to-cyan-500/10",
            iconColor: "text-cyan-600"
        },
        {
            icon: Car,
            title: "Emergency Services",
            description: "Access emergency contacts",
            link: "/services/emergency",
            color: "from-orange-500/20 to-orange-500/10",
            iconColor: "text-orange-600"
        }
    ];

    const recentActivity = [
        {
            title: "Fingerprint Application Submitted",
            date: "2 days ago",
            status: "pending",
            type: "application"
        },
        {
            title: "Background Check Approved",
            date: "1 week ago",
            status: "completed",
            type: "certificate"
        },
        {
            title: "Lost NRC Report Filed",
            date: "2 weeks ago",
            status: "in-progress",
            type: "report"
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-950';
            case 'pending': return 'text-amber-600 bg-amber-100 dark:bg-amber-950';
            case 'in-progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-950';
            default: return 'text-gray-600 bg-gray-100 dark:bg-gray-950';
        }

    };

    return (
        <div className="min-h-screen bg-background">
            {/* Enhanced Sticky Header */}
            <div className="sticky top-0 z-50 border-b bg-gradient-to-r from-card via-card to-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 shadow-sm">
                <div className="flex items-center justify-between px-6 py-3">
                    {/* Logo and Title Section */}
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleSidebar}
                            className="lg:hidden -ml-2"
                        >
                            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/logo.png"
                                alt="IPIMS Logo"
                                className="h-12 w-12 object-contain"
                            />
                            <div className="border-l pl-3 hidden sm:block">
                                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                    Citizen Portal
                                </h1>
                                <p className="text-xs text-muted-foreground font-medium">
                                    Integrated Police & Immigration Management
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Search Box */}
                    <div className="flex-1 max-w-md mx-4 hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search services, applications..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 h-9 bg-muted/50 border-muted-foreground/20 focus:bg-background"
                            />
                        </div>
                    </div>

                    {/* Action Buttons Section */}
                    <div className="flex items-center gap-3">
                        {/* Notifications */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="relative hover:bg-accent transition-colors"
                        >
                            <Bell className="h-4 w-4" />
                            {notifications > 0 && (
                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {notifications}
                                </span>
                            )}
                        </Button>

                        {/* User Info */}
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 pl-3 border-l hover:bg-accent"
                            onClick={() => navigate('/citizen/settings')}
                        >
                            <div className="hidden sm:flex flex-col items-end">
                                <p className="text-sm font-semibold">
                                    {(session as any)?.resident?.firstName || 'Citizen'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {(session as any)?.resident?.nrc || session?.userId?.slice(0, 8) || 'USER-001'}
                                </p>
                            </div>
                            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                        </Button>

                        <Button variant="ghost" size="icon" onClick={handleLogout} className="hidden sm:flex">
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="overview" className="flex h-[calc(100vh-73px)]">
                {/* Sticky Left Navigation */}
                <aside className={cn(
                    "sticky top-[73px] h-[calc(100vh-73px)] border-r bg-gradient-to-b from-card to-card/50 backdrop-blur transition-all duration-300 z-40",
                    sidebarOpen ? "w-72" : "w-0 lg:w-0 overflow-hidden border-none"
                )}>
                    <div className="flex flex-col h-full">
                        {/* Navigation Items */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6 pt-6">
                            <TabsList className="grid w-full grid-cols-1 gap-1 h-auto bg-transparent">
                                {/* Main Section */}
                                <div className="space-y-1">
                                    <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Main
                                    </p>
                                    <TabsTrigger
                                        value="overview"
                                        className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-accent/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                                    >
                                        <LayoutDashboard className="h-4 w-4" />
                                        <span className="font-medium">Overview</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="services"
                                        className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-accent/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                                    >
                                        <Shield className="h-4 w-4" />
                                        <span className="font-medium">Services</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="applications"
                                        className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-accent/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                                    >
                                        <FileText className="h-4 w-4" />
                                        <span className="font-medium">Applications</span>
                                        <Badge variant="secondary" className="ml-auto text-xs">
                                            2
                                        </Badge>
                                    </TabsTrigger>
                                </div>

                                {/* Personal Section */}
                                <div className="space-y-1 pt-4 border-t">
                                    <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        Personal
                                    </p>
                                    <TabsTrigger
                                        value="documents"
                                        className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-accent/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                                    >
                                        <FileSearch className="h-4 w-4" />
                                        <span className="font-medium">Documents</span>
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="verification"
                                        className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-accent/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                                    >
                                        <UserCheck className="h-4 w-4" />
                                        <span className="font-medium">Verification</span>
                                    </TabsTrigger>
                                    <Link to="/citizen/photo-id" className="block">
                                        <div className="flex w-full items-center justify-start gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-accent/50 text-muted-foreground hover:text-foreground">
                                            <Camera className="h-4 w-4" />
                                            <span className="font-medium">My Photo ID</span>
                                        </div>
                                    </Link>
                                </div>

                                {/* System Section */}
                                <div className="space-y-1 pt-4 border-t">
                                    <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                        System
                                    </p>
                                    <TabsTrigger
                                        value="settings"
                                        className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-accent/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                                    >
                                        <Settings className="h-4 w-4" />
                                        <span className="font-medium">Settings</span>
                                    </TabsTrigger>
                                </div>
                            </TabsList>
                        </div>

                        {/* Navigation Footer */}
                        <div className="p-4 border-t bg-card/80">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors cursor-pointer">
                                <div className="p-2 bg-primary/10 rounded-full">
                                    <Bell className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Notifications</p>
                                    <p className="text-xs text-muted-foreground">3 new alerts</p>
                                </div>
                                <Badge variant="destructive" className="text-xs">3</Badge>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 overflow-auto">
                    <div className="p-6 space-y-6 max-w-7xl mx-auto">
                        <TabsContent value="overview" className="space-y-6 mt-0">
                            {/* Welcome Section */}
                            <div className="mb-6 md:mb-8">
                                <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome to Your Dashboard</h2>
                                <p className="text-sm md:text-base text-muted-foreground">
                                    Access all government services in one place. Select a service below to get started.
                                </p>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Active Applications</CardTitle>
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">2</div>
                                        <p className="text-xs text-muted-foreground">
                                            1 pending review
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Completed Services</CardTitle>
                                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">5</div>
                                        <p className="text-xs text-muted-foreground">
                                            All time
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="hidden sm:block md:block">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                                        <Bell className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{notifications}</div>
                                        <p className="text-xs text-muted-foreground">
                                            New updates
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Recent Activity */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <Card className="lg:col-span-2">
                                    <CardHeader>
                                        <CardTitle>Recent Activity</CardTitle>
                                        <CardDescription>Your recent applications and requests</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {recentActivity.map((activity, index) => (
                                                <div key={index} className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                                                    <div className="flex items-center gap-3 md:gap-4">
                                                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                            {activity.type === 'application' && <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />}
                                                            {activity.type === 'certificate' && <UserCheck className="h-4 w-4 md:h-5 md:w-5 text-primary" />}
                                                            {activity.type === 'report' && <Shield className="h-4 w-4 md:h-5 md:w-5 text-primary" />}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm md:text-base font-medium">{activity.title}</p>
                                                            <p className="text-xs text-muted-foreground">{activity.date}</p>
                                                        </div>
                                                    </div>
                                                    <Badge className={cn("text-[10px] md:text-xs", getStatusColor(activity.status))}>
                                                        {activity.status}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                        <Button asChild variant="outline" className="w-full mt-4">
                                            <Link to="/services/applications">View All Activity</Link>
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Quick Links */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Quick Links</CardTitle>
                                        <CardDescription>Frequently used services</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <Button asChild variant="ghost" className="w-full justify-start">
                                            <Link to="/services/fingerprint">
                                                <Camera className="h-4 w-4 mr-2" />
                                                Apply for Fingerprinting
                                            </Link>
                                        </Button>
                                        <Button asChild variant="ghost" className="w-full justify-start">
                                            <Link to="/services/lost-documents">
                                                <FileSearch className="h-4 w-4 mr-2" />
                                                Report Lost Document
                                            </Link>
                                        </Button>
                                        <Button asChild variant="ghost" className="w-full justify-start">
                                            <Link to="/services/background-check">
                                                <AlertTriangle className="h-4 w-4 mr-2" />
                                                Request Background Check
                                            </Link>
                                        </Button>
                                        <Button asChild variant="ghost" className="w-full justify-start">
                                            <Link to="/verification">
                                                <QrCode className="h-4 w-4 mr-2" />
                                                Verify Documents
                                            </Link>
                                        </Button>
                                        <Button asChild variant="ghost" className="w-full justify-start">
                                            <Link to="/">
                                                <HelpCircle className="h-4 w-4 mr-2" />
                                                Help & Support
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Emergency Contact Banner */}
                            <Card className="bg-gradient-to-r from-destructive/10 to-destructive/5 border-destructive/20">
                                <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6 gap-4 text-center sm:text-left">
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center">
                                            <Car className="h-6 w-6 text-destructive" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg">Emergency Services</h4>
                                            <p className="text-sm text-muted-foreground">
                                                Need immediate help? Contact emergency services
                                            </p>
                                        </div>
                                    </div>
                                    <Button asChild variant="destructive" className="w-full sm:w-auto">
                                        <Link to="/services/emergency">Access Now</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="services" className="space-y-6 mt-0">
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <h3 className="text-xl md:text-2xl font-bold">Available Services</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                                {quickServices.map((service, index) => (
                                    <Link key={index} to={service.link}>
                                        <Card className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-pointer h-full">
                                            <CardHeader className="p-4 md:p-6">
                                                <div className={`flex items-center justify-center h-12 w-12 md:h-14 md:w-14 rounded-full bg-gradient-to-br ${service.color} mx-auto mb-3 group-hover:shadow-lg transition-all duration-300`}>
                                                    <service.icon className={`h-6 w-6 md:h-7 md:w-7 ${service.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                                                </div>
                                                <CardTitle className="text-center text-sm md:text-base group-hover:text-primary transition-colors">
                                                    {service.title}
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                                                <p className="text-xs md:text-sm text-muted-foreground text-center group-hover:text-foreground transition-colors">
                                                    {service.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="applications" className="space-y-6 mt-0">
                            <Card>
                                <CardHeader>
                                    <CardTitle>My Applications</CardTitle>
                                    <CardDescription>Track the status of your submitted applications</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentActivity.map((activity, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                                                <div className="flex items-center gap-3 md:gap-4">
                                                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                        {activity.type === 'application' && <FileText className="h-4 w-4 md:h-5 md:w-5 text-primary" />}
                                                        {activity.type === 'certificate' && <UserCheck className="h-4 w-4 md:h-5 md:w-5 text-primary" />}
                                                        {activity.type === 'report' && <Shield className="h-4 w-4 md:h-5 md:w-5 text-primary" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm md:text-base font-medium">{activity.title}</p>
                                                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                                                    </div>
                                                </div>
                                                <Badge className={cn("text-[10px] md:text-xs", getStatusColor(activity.status))}>
                                                    {activity.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </div>
                </div>
            </Tabs>
        </div>
    );
}
