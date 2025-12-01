import { useState, useEffect } from 'react';
import { Shield, Users, FileText, AlertTriangle, BarChart3, Clock, MapPin, Search, Camera, Car, Calendar, Settings, Bell, FileBarChart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Api } from '@/lib/api';
import type { Case, Suspect, Officer, DashboardStats } from '@shared/api';

export default function PoliceDashboard() {
  const { session } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCases, setRecentCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [session]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Load case statistics
      const statsResponse = await Api.getCaseStats({
        stationId: session?.stationId,
        officerId: session?.userId
      });
      setStats(statsResponse);

      // Load recent cases
      const casesResponse = await Api.listCases({
        stationId: session?.stationId,
        limit: 10
      });
      setRecentCases(casesResponse.items);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in_progress': return 'default';
      case 'closed': return 'secondary';
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
                  Police Dashboard
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
              <span className="hidden md:inline">Search cases, officers, reports...</span>
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
                3
              </span>
            </Button>

            {/* User Info */}
            <div className="flex items-center gap-2 pl-3 border-l">
              <div className="hidden sm:flex flex-col items-end">
                <p className="text-sm font-semibold">Officer</p>
                <p className="text-xs text-muted-foreground">
                  {session?.userId?.slice(0, 8) || 'PO-001'}
                </p>
              </div>
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                <Shield className="h-5 w-5 text-primary" />
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
                    value="cases"
                    className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-accent/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">Cases</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {stats?.totalCases || 0}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-accent/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span className="font-medium">Analytics</span>
                  </TabsTrigger>
                </div>

                {/* Operations Section */}
                <div className="space-y-1 pt-4 border-t">
                  <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Operations
                  </p>
                  <TabsTrigger
                    value="patrols"
                    className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-accent/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  >
                    <Car className="h-4 w-4" />
                    <span className="font-medium">Patrols</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="shifts"
                    className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-accent/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  >
                    <Calendar className="h-4 w-4" />
                    <span className="font-medium">Shift Management</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="reports"
                    className="w-full justify-start gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-accent/50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                  >
                    <FileBarChart className="h-4 w-4" />
                    <span className="font-medium">Reports</span>
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
                  <p className="text-xs text-muted-foreground">3 new alerts</p>
                </div>
                <Badge variant="destructive" className="text-xs">3</Badge>
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
                  <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalCases || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    All cases in your jurisdiction
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Open Cases</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{stats?.openCases || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Requires immediate attention
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <Clock className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{stats?.inProgressCases || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Currently being investigated
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Priority</CardTitle>
                  <BarChart3 className="h-4 w-4 text-destructive" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">{stats?.highPriorityCases || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Urgent cases requiring action
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
                        Common tasks and operations
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <Link to="/dashboard/police/cases/new">
                        <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
                          <FileText className="h-6 w-6 text-primary" />
                          <span>New Case</span>
                        </Button>
                      </Link>
                      <Link to="/dashboard/police/suspects">
                        <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
                          <Users className="h-6 w-6 text-primary" />
                          <span>Suspect Registry</span>
                        </Button>
                      </Link>
                      <Link to="/dashboard/police/patrols">
                        <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
                          <Car className="h-6 w-6 text-primary" />
                          <span>Patrols</span>
                        </Button>
                      </Link>
                      <Link to="/verification">
                        <Button className="w-full h-24 flex flex-col gap-2" variant="outline">
                          <Search className="h-6 w-6 text-primary" />
                          <span>Verify ID</span>
                        </Button>
                      </Link>
                      <Link to="/dashboard/police/scan">
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
                            <h4 className="text-sm font-semibold">High Priority Case Update</h4>
                            <p className="text-xs text-muted-foreground">Case #2024-{100 + i} has been updated with new evidence.</p>
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
                      <CardTitle>Shift Status</CardTitle>
                      <CardDescription>Current shift information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Current Shift</span>
                        <Badge>Morning (06:00 - 14:00)</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Officer in Charge</span>
                        <span className="text-sm font-medium">Sgt. Mumba</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Active Units</span>
                        <span className="text-sm font-medium">8 Units</span>
                      </div>
                      <div className="pt-4 border-t">
                        <Button className="w-full" variant="secondary">View Roster</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Case Priority</CardTitle>
                      <CardDescription>
                        Active cases by priority
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>High Priority</span>
                          <span>{stats?.highPriorityCases || 0}</span>
                        </div>
                        <Progress
                          value={stats?.totalCases ? (stats.highPriorityCases / stats.totalCases) * 100 : 0}
                          className="h-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Medium Priority</span>
                          <span>{stats?.mediumPriorityCases || 0}</span>
                        </div>
                        <Progress
                          value={stats?.totalCases ? (stats.mediumPriorityCases / stats.totalCases) * 100 : 0}
                          className="h-2"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Low Priority</span>
                          <span>{stats?.lowPriorityCases || 0}</span>
                        </div>
                        <Progress
                          value={stats?.totalCases ? (stats.lowPriorityCases / stats.totalCases) * 100 : 0}
                          className="h-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="patrols">
              <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                <Car className="h-16 w-16 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold">Patrol Management</h3>
                <p className="text-muted-foreground">View and manage active patrols in the dedicated dashboard.</p>
                <Link to="/dashboard/police/patrols">
                  <Button>Go to Patrol Dashboard</Button>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="shifts">
              <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                <Calendar className="h-16 w-16 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold">Shift Management</h3>
                <p className="text-muted-foreground">Manage officer rosters and shift schedules.</p>
                <Button variant="outline">View Schedule</Button>
              </div>
            </TabsContent>

            <TabsContent value="reports">
              <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                <FileBarChart className="h-16 w-16 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold">Reports Center</h3>
                <p className="text-muted-foreground">Generate and download detailed police reports.</p>
                <Button variant="outline">Generate Report</Button>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                <Settings className="h-16 w-16 text-muted-foreground/50" />
                <h3 className="text-xl font-semibold">Settings</h3>
                <p className="text-muted-foreground">Configure dashboard preferences and account settings.</p>
                <Button variant="outline">Open Settings</Button>
              </div>
            </TabsContent>

            <TabsContent value="cases" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Cases</CardTitle>
                  <CardDescription>
                    Latest cases in your jurisdiction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentCases.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No recent cases found
                      </p>
                    ) : (
                      recentCases.map((case_) => (
                        <div key={case_.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{case_.caseNumber}</span>
                              <Badge variant={getPriorityColor(case_.priority)}>
                                {case_.priority}
                              </Badge>
                              <Badge variant={getStatusColor(case_.status)}>
                                {case_.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{case_.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {case_.location || 'No location'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(case_.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Link to={`/dashboard/police/cases/${case_.id}`}>
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

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Case Resolution Rate</CardTitle>
                    <CardDescription>
                      Percentage of cases successfully closed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-primary">
                        {stats?.totalCases ? Math.round((stats.closedCases / stats.totalCases) * 100) : 0}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {stats?.closedCases || 0} of {stats?.totalCases || 0} cases resolved
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>
                      Key performance indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Active Cases</span>
                      <span className="font-medium">{(stats?.openCases || 0) + (stats?.inProgressCases || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Closed This Month</span>
                      <span className="font-medium">{stats?.closedCases || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Response Time</span>
                      <span className="font-medium">2.4 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Case Load</span>
                      <span className="font-medium">{stats?.totalCases || 0}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}