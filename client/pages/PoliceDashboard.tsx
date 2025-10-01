import { useState, useEffect } from 'react';
import { Shield, Users, FileText, AlertTriangle, BarChart3, Clock, MapPin, Search, Camera } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Api } from '@/lib/api';
import type { Case, Suspect, Officer } from '@shared/api';

interface DashboardStats {
  totalCases: number;
  openCases: number;
  inProgressCases: number;
  closedCases: number;
  highPriorityCases: number;
  mediumPriorityCases: number;
  lowPriorityCases: number;
}

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
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Police Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, Police Officer
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Officer</Badge>
            <Badge variant="secondary">{session?.userId?.slice(0, 8) || 'PO-001'}</Badge>
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="flex h-[calc(100vh-73px)]">
        {/* Sticky Left Navigation */}
        <div className="sticky top-[73px] h-[calc(100vh-73px)] w-64 border-r bg-card/50 backdrop-blur">
          <div className="p-4">
            <TabsList className="grid w-full grid-cols-1 gap-2 h-auto bg-transparent">
              <TabsTrigger 
                value="overview" 
                className="w-full justify-start gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="cases" 
                className="w-full justify-start gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <FileText className="h-4 w-4" />
                Recent Cases
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="w-full justify-start gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Common tasks and operations
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Link to="/police/cases">
                      <Button className="w-full justify-start" variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Manage Cases
                      </Button>
                    </Link>
                    <Link to="/police/suspects">
                      <Button className="w-full justify-start" variant="outline">
                        <Users className="mr-2 h-4 w-4" />
                        Suspect Registry
                      </Button>
                    </Link>
                    <Link to="/verification">
                      <Button className="w-full justify-start" variant="outline">
                        <Search className="mr-2 h-4 w-4" />
                        Identity Verification
                      </Button>
                    </Link>
                    <Link to="/police/scan">
                      <Button className="w-full justify-start" variant="outline">
                        <Search className="mr-2 h-4 w-4" />
                        ID Scanner
                      </Button>
                    </Link>
                    <Link to="/police/face-scanner">
                       <Button className="w-full justify-start" variant="outline">
                         <Camera className="mr-2 h-4 w-4" />
                         Face Scanner
                       </Button>
                     </Link>
                  </CardContent>
                </Card>

                {/* Case Priority Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Case Priority Distribution</CardTitle>
                    <CardDescription>
                      Breakdown of cases by priority level
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
                          <Link to={`/police/cases/${case_.id}`}>
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