import { useState, useEffect } from 'react';
import { CreditCard, Users, FileCheck, Globe, BarChart3, Clock, MapPin, Search, Bell, Settings, FileText, Shield, AlertTriangle, FileBarChart, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Api, ImmigrationDashboardStats } from '@/lib/api';
import type { Permit, Visa } from '@shared/api';

export default function ImmigrationDashboard() {
  const { session } = useAuth();
  const [stats, setStats] = useState<ImmigrationDashboardStats | null>(null);
  const [recentPermits, setRecentPermits] = useState<Permit[]>([]);
  const [recentVisas, setRecentVisas] = useState<Visa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [session]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load permit statistics
      const permitStatsResponse = await Api.getPermitStats({
        officeId: session?.immigrationOfficeId,
        officerId: session?.userId
      });

      // Load visa statistics
      const visaStatsResponse = await Api.getVisaStats({
        officeId: session?.immigrationOfficeId,
        officerId: session?.userId
      });

      setStats({
        ...permitStatsResponse,
        ...visaStatsResponse
      });

      // Load recent permits
      const permitsResponse = await Api.listPermits({
        officeId: session?.immigrationOfficeId,
        limit: 5
      });
      setRecentPermits(permitsResponse.items);

      // Load recent visas
      const visasResponse = await Api.listVisas({
        officeId: session?.immigrationOfficeId,
        limit: 5
      });
      setRecentVisas(visasResponse.items);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'expired': return 'destructive';
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getPermitTypeColor = (type: string) => {
    switch (type) {
      case 'work': return 'default';
      case 'student': return 'secondary';
      case 'study': return 'secondary';
      case 'tourist': return 'outline';
      case 'business': return 'default';
      case 'transit': return 'secondary';
      case 'residence': return 'default';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Sticky Header */}
      <div className="sticky top-0 z-50 border-b bg-gradient-to-r from-card via-card to-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 shadow-sm">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Logo and Title Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="IPIMS Logo"
                className="h-12 w-12 object-contain"
              />
              <div className="border-l pl-3">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Immigration Portal
                </h1>
                <p className="text-xs text-muted-foreground font-medium">
                  Integrated Police & Immigration Management
                </p>
              </div>
            </div>
          </div>

          {/* Centered Search Box */}
          <div className="flex-1 flex justify-center px-8">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 hover:bg-accent transition-colors min-w-[200px] md:min-w-[300px]"
            >
              <Search className="h-4 w-4" />
              <span className="hidden md:inline">Search visas, permits, residents...</span>
              <span className="md:hidden">Search</span>
            </Button>
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
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                5
              </span>
            </Button>

            {/* User Info */}
            <div className="flex items-center gap-2 pl-3 border-l">
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-sm font-semibold">Officer</p>
                <p className="text-xs text-muted-foreground">
                  {session?.userId?.slice(0, 8) || 'IO-001'}
                </p>
              </div>
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                <Globe className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="flex h-[calc(100vh-73px)]">
        {/* Sticky Left Navigation */}
        <div className="sticky top-[73px] h-[calc(100vh-73px)] w-72 border-r bg-gradient-to-b from-card to-card/50 backdrop-blur">
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
                    <BarChart3 className="h-4 w-4" />
                    <span className="font-medium">Overview</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="visas"
                    className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-accent/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="font-medium">Visas</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {stats?.totalVisas || 0}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="permits"
                    className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-accent/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  >
                    <FileCheck className="h-4 w-4" />
                    <span className="font-medium">Permits</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {stats?.totalPermits || 0}
                    </Badge>
                  </TabsTrigger>
                </div>

                {/* Services Section */}
                <div className="space-y-1 pt-4 border-t">
                  <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Services
                  </p>
                  <TabsTrigger
                    value="passports"
                    className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-accent/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span className="font-medium">Passports</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="residency"
                    className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-accent/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  >
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Residency</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-accent/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  >
                    <FileBarChart className="h-4 w-4" />
                    <span className="font-medium">Analytics</span>
                  </TabsTrigger>
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
                  <p className="text-xs text-muted-foreground">5 new alerts</p>
                </div>
                <Badge variant="destructive" className="text-xs">5</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Permits</CardTitle>
                  <FileCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalPermits || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    All permits in your jurisdiction
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Permits</CardTitle>
                  <Globe className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats?.activePermits || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently valid permits
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                  <Clock className="h-4 w-4 text-secondary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">{stats?.pendingApplications || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting review and approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Visas</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalVisas || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    All visa records managed
                  </p>
                </CardContent>
              </Card>
            </div>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Quick Actions & Status */}
                <div className="space-y-6 lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>
                        Common immigration tasks and operations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Link to="/immigration/permits">
                        <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
                          <FileCheck className="h-6 w-6 text-primary" />
                          <span>Manage Permits</span>
                        </Button>
                      </Link>
                      <Link to="/immigration/visas">
                        <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
                          <Globe className="h-6 w-6 text-primary" />
                          <span>Visa Management</span>
                        </Button>
                      </Link>
                      <Link to="/immigration/residency">
                        <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
                          <Users className="h-6 w-6 text-primary" />
                          <span>Resident Registry</span>
                        </Button>
                      </Link>
                      <Link to="/verification">
                        <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
                          <Search className="h-6 w-6 text-primary" />
                          <span>Verify ID</span>
                        </Button>
                      </Link>
                      <Link to="/dashboard/police/scan-qr">
                        <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
                          <Search className="h-6 w-6 text-primary" />
                          <span>Scan QR</span>
                        </Button>
                      </Link>
                      <Link to="/dashboard/police/face-scanner">
                        <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
                          <Camera className="h-6 w-6 text-primary" />
                          <span>Face Scan</span>
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Alerts</CardTitle>
                      <CardDescription>Latest system notifications and alerts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-4 p-3 bg-muted/50 rounded-lg">
                          <div className="p-2 bg-yellow-500/10 rounded-full">
                            <Bell className="h-4 w-4 text-yellow-500" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold">Visa Expiry Warning</h4>
                            <p className="text-xs text-muted-foreground">Visa #V-2024-{100 + i} is expiring in 3 days.</p>
                            <span className="text-[10px] text-muted-foreground mt-1 block">2 hours ago</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Stats & Distribution */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Permit Status</CardTitle>
                      <CardDescription>
                        Breakdown of permits by status
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Active Permits</span>
                          <span>{stats?.activePermits || 0}</span>
                        </div>
                        <Progress
                          value={stats?.totalPermits ? (stats.activePermits / stats.totalPermits) * 100 : 0}
                          className="h-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Expired Permits</span>
                          <span>{stats?.expiredPermits || 0}</span>
                        </div>
                        <Progress
                          value={stats?.totalPermits ? (stats.expiredPermits / stats.totalPermits) * 100 : 0}
                          className="h-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Pending Applications</span>
                          <span>{stats?.pendingApplications || 0}</span>
                        </div>
                        <Progress
                          value={stats?.totalPermits ? (stats.pendingApplications / stats.totalPermits) * 100 : 0}
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Processing Metrics</CardTitle>
                      <CardDescription>
                        Key performance indicators
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Pending Applications</span>
                        <span className="font-medium">{stats?.pendingApplications || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Active Visas</span>
                        <span className="font-medium">{stats?.activeVisas || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Total Residents</span>
                        <span className="font-medium">{stats?.totalResidents || 0}</span>
                      </div>
                      <div className="pt-4 border-t">
                        <Button className="w-full" variant="secondary">View Full Report</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="permits" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Permits</CardTitle>
                  <CardDescription>
                    Latest permit applications and renewals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPermits.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No recent permits found
                      </p>
                    ) : (
                      recentPermits.map((permit) => (
                        <div key={permit.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{permit.permitNumber}</span>
                              <Badge variant={getPermitTypeColor(permit.type)}>
                                {permit.type}
                              </Badge>
                              <Badge variant={getStatusColor(permit.status)}>
                                {permit.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Resident ID: {permit.residentId}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Expires: {new Date(permit.validUntil).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Link to={`/immigration/permits/${permit.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visas" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Visas</CardTitle>
                  <CardDescription>
                    Latest visa applications and approvals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentVisas.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No recent visas found
                      </p>
                    ) : (
                      recentVisas.map((visa) => (
                        <div key={visa.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{visa.visaNumber}</span>
                              <Badge variant={getPermitTypeColor(visa.type)}>
                                {visa.type}
                              </Badge>
                              <Badge variant={getStatusColor(visa.status)}>
                                {visa.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Resident ID: {visa.residentId}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Valid until: {new Date((visa as any).expiryDate || (visa as any).validUntil).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Link to={`/immigration/visas/${visa.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="passports">
              <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                <CreditCard className="h-16 w-16 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold">Passport Services</h3>
                <p className="text-muted-foreground">Manage passport applications and renewals.</p>
                <Link to="/immigration/passports">
                  <Button>Go to Passport Services</Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="residency">
              <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                <Users className="h-16 w-16 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold">Residency Management</h3>
                <p className="text-muted-foreground">Manage resident permits and status.</p>
                <Link to="/immigration/residency">
                  <Button>Go to Residency Management</Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                <FileBarChart className="h-16 w-16 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold">Analytics Center</h3>
                <p className="text-muted-foreground">View detailed immigration statistics and reports.</p>
                <Button variant="outline">View Analytics</Button>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                <Settings className="h-16 w-16 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold">Settings</h3>
                <p className="text-muted-foreground">Configure dashboard preferences.</p>
                <Button variant="outline">Open Settings</Button>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}