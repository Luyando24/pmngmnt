import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Api } from '@/lib/api';
import ThemeToggle from '@/components/navigation/ThemeToggle';
import { 
  Shield, 
  Passport, 
  Users, 
  Activity, 
  BarChart3, 
  TrendingUp,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Globe,
  MapPin,
  Calendar,
  Settings,
  DollarSign,
  Search,
  Plus,
  Filter,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import type { Case, Permit, Visa, Officer } from '@shared/api';

interface SupervisorStats {
  // Police Stats
  totalCases: number;
  openCases: number;
  inProgressCases: number;
  closedCases: number;
  highPriorityCases: number;
  totalOfficers: number;
  activeOfficers: number;
  
  // Immigration Stats
  totalPermits: number;
  activePermits: number;
  expiredPermits: number;
  pendingApplications: number;
  totalVisas: number;
  activeVisas: number;
  expiredVisas: number;
  totalResidents: number;
}

export default function SupervisorDashboard() {
  const { session } = useAuth();
  const [stats, setStats] = useState<SupervisorStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // Mock data for missing variables
  const serviceCategories = [
    { name: 'Police Services', count: 45, icon: Shield, color: 'bg-blue-500' },
    { name: 'Immigration', count: 32, icon: Passport, color: 'bg-green-500' },
    { name: 'Identity Verification', count: 28, icon: Users, color: 'bg-purple-500' },
    { name: 'Emergency Services', count: 15, icon: AlertTriangle, color: 'bg-red-500' }
  ];

  const services = [
    { id: 1, name: 'Case Management', category: 'Police', applications: 156, status: 'Active' },
    { id: 2, name: 'Visa Processing', category: 'Immigration', applications: 89, status: 'Active' },
    { id: 3, name: 'Permit Renewal', category: 'Immigration', applications: 67, status: 'Active' },
    { id: 4, name: 'Identity Verification', category: 'Security', applications: 234, status: 'Active' }
  ];

  useEffect(() => {
    loadDashboardData();
  }, [session]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load combined statistics from both police and immigration systems
      const [policeStats, immigrationStats, activityData] = await Promise.all([
        Api.getCaseStats({ supervisorId: session?.userId }),
        Api.getPermitStats({ supervisorId: session?.userId }),
        Api.getRecentActivity({ supervisorId: session?.userId, limit: 20 })
      ]);
      
      setStats({
        ...policeStats,
        ...immigrationStats
      });
      
      setRecentActivity(activityData.items || []);
    } catch (error) {
      console.error('Failed to load supervisor dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(6)].map((_, i) => (
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
            <BarChart3 className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Supervisor Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                IPIMS Operations Overview - Supervisor
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Supervisor</Badge>
            <Badge variant="secondary">{session?.userId?.slice(0, 8) || 'SUP-001'}</Badge>
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4" />
            </Button>
            <ThemeToggle />
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
                value="police" 
                className="w-full justify-start gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Shield className="h-4 w-4" />
                Police Operations
              </TabsTrigger>
              <TabsTrigger 
                value="immigration" 
                className="w-full justify-start gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Passport className="h-4 w-4" />
                Immigration
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="w-full justify-start gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <TrendingUp className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            <TabsContent value="overview" className="space-y-6 mt-0">(
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Cases</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalCases || 0}</div>
                    <p className="text-xs text-muted-foreground">Police cases managed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Permits</CardTitle>
                    <Passport className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.activePermits || 0}</div>
                    <p className="text-xs text-muted-foreground">Immigration permits</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Officers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalOfficers || 0}</div>
                    <p className="text-xs text-muted-foreground">Active personnel</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.pendingApplications || 0}</div>
                    <p className="text-xs text-muted-foreground">Awaiting review</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Analytics Overview</CardTitle>
                    <CardDescription>Service performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      <BarChart3 className="h-8 w-8 mr-2" />
                      Chart placeholder
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest service applications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New business registration</p>
                          <p className="text-xs text-muted-foreground">2 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Health permit approved</p>
                          <p className="text-xs text-muted-foreground">5 minutes ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Driver license renewal</p>
                          <p className="text-xs text-muted-foreground">10 minutes ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="police" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Case Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Open Cases</span>
                        <span className="font-medium">{stats?.openCases || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">In Progress</span>
                        <span className="font-medium">{stats?.inProgressCases || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Closed Cases</span>
                        <span className="font-medium">{stats?.closedCases || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Personnel
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Officers</span>
                        <span className="font-medium">{stats?.totalOfficers || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Active Officers</span>
                        <span className="font-medium">{stats?.activeOfficers || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="immigration" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Passport className="h-5 w-5" />
                      Permits & Visas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Active Permits</span>
                        <span className="font-medium">{stats?.activePermits || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Active Visas</span>
                        <span className="font-medium">{stats?.activeVisas || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Expired</span>
                        <span className="font-medium">{(stats?.expiredPermits || 0) + (stats?.expiredVisas || 0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Residents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Total Residents</span>
                        <span className="font-medium">{stats?.totalResidents || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Pending Applications</span>
                        <span className="font-medium">{stats?.pendingApplications || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>System Performance</CardTitle>
                    <CardDescription>Overall system metrics and trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                      <BarChart3 className="h-8 w-8 mr-2" />
                      Analytics Chart Placeholder
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest system activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">
                          No recent activity found
                        </p>
                      ) : (
                        recentActivity.slice(0, 5).map((activity, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.description || 'System activity'}</p>
                              <p className="text-xs text-muted-foreground">{activity.timestamp || 'Recently'}</p>
                            </div>
                          </div>
                        ))
                      )}
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
