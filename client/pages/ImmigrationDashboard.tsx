import { useState, useEffect } from 'react';
import { CreditCard, Users, FileCheck, Globe, BarChart3, Clock, MapPin, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Api } from '@/lib/api';
import type { Permit, Visa, Resident } from '@shared/api';

interface DashboardStats {
  totalPermits: number;
  activePermits: number;
  expiredPermits: number;
  pendingApplications: number;
  totalVisas: number;
  activeVisas: number;
  expiredVisas: number;
  totalResidents: number;
}

export default function ImmigrationDashboard() {
  const { session } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
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
      const permitStatsResponse = await api.getPermitStats({
        officeId: session?.officeId,
        officerId: session?.userId
      });
      
      // Load visa statistics
      const visaStatsResponse = await api.getVisaStats({
        officeId: session?.officeId,
        officerId: session?.userId
      });
      
      setStats({
        ...permitStatsResponse,
        ...visaStatsResponse
      });
      
      // Load recent permits
      const permitsResponse = await api.listPermits({
        officeId: session?.officeId,
        limit: 5
      });
      setRecentPermits(permitsResponse.items);
      
      // Load recent visas
      const visasResponse = await api.listVisas({
        officeId: session?.officeId,
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
      case 'tourist': return 'outline';
      case 'business': return 'default';
      case 'transit': return 'secondary';
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
      {/* Sticky Top Header */}
      <div className="sticky top-0 z-50 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Immigration Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, Immigration Officer
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">Immigration Officer</Badge>
              <Badge variant="secondary">{session?.userId?.slice(0, 8) || 'IO-001'}</Badge>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Container */}
      <Tabs defaultValue="overview" orientation="vertical" className="flex">
        {/* Sticky Left Navigation */}
        <div className="sticky top-[73px] h-[calc(100vh-73px)] w-64 bg-muted/30 border-r overflow-y-auto">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">NAVIGATION</h3>
            <TabsList className="grid w-full grid-rows-4 h-auto bg-transparent p-0 gap-1">
              <TabsTrigger 
                value="overview" 
                className="w-full justify-start px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="permits" 
                className="w-full justify-start px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Recent Permits
              </TabsTrigger>
              <TabsTrigger 
                value="visas" 
                className="w-full justify-start px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Globe className="h-4 w-4 mr-2" />
                Recent Visas
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="w-full justify-start px-3 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="container mx-auto px-6 py-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Common immigration tasks and operations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link to="/immigration/permits">
                    <Button className="w-full justify-start" variant="outline">
                      <FileCheck className="mr-2 h-4 w-4" />
                      Manage Permits
                    </Button>
                  </Link>
                  <Link to="/immigration/visas">
                    <Button className="w-full justify-start" variant="outline">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Visa Management
                    </Button>
                  </Link>
                  <Link to="/immigration/residents">
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="mr-2 h-4 w-4" />
                      Resident Registry
                    </Button>
                  </Link>
                  <Link to="/verification">
                    <Button className="w-full justify-start" variant="outline">
                      <Search className="mr-2 h-4 w-4" />
                      Identity Verification
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Permit Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Permit Status Distribution</CardTitle>
                  <CardDescription>
                    Breakdown of permits by current status
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
                            {permit.holderName} - {permit.nationality}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Expires: {new Date(permit.expiryDate).toLocaleDateString()}
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
                            {visa.holderName} - {visa.nationality}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Valid until: {new Date(visa.expiryDate).toLocaleDateString()}
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

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Permit Approval Rate</CardTitle>
                  <CardDescription>
                    Percentage of applications approved
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-2">
                    <div className="text-3xl font-bold text-primary">
                      {stats?.totalPermits ? Math.round((stats.activePermits / stats.totalPermits) * 100) : 0}%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {stats?.activePermits || 0} of {stats?.totalPermits || 0} permits approved
                    </p>
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
                    <span className="text-sm">Active Permits</span>
                    <span className="font-medium">{stats?.activePermits || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Active Visas</span>
                    <span className="font-medium">{stats?.activeVisas || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Residents</span>
                    <span className="font-medium">{stats?.totalResidents || 0}</span>
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