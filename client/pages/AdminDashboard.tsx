import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Shield, 
  Settings, 
  BarChart3, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText, 
  Database, 
  Server, 
  Lock, 
  UserPlus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Plus,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Calendar,
  MapPin,
  Phone,
  Mail
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Api } from "@/lib/api";

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalCases: number;
  activeCases: number;
  totalApplications: number;
  pendingApplications: number;
  systemUptime: string;
  databaseSize: string;
  lastBackup: string;
  securityAlerts: number;
  performanceScore: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'police_officer' | 'immigration_officer' | 'supervisor' | 'analyst';
  department: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  permissions: string[];
  avatar?: string;
  phone?: string;
  badgeNumber?: string;
  location?: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed' | 'warning';
}

interface SystemAlert {
  id: string;
  type: 'security' | 'performance' | 'system' | 'maintenance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
}

const AdminDashboard = () => {
  const { session: user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Load all dashboard data
      await Promise.all([
        loadSystemStats(),
        loadUsers(),
        loadAuditLogs(),
        loadSystemAlerts()
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSystemStats = async () => {
    try {
      const response = await api.get('/api/admin/stats');
      setSystemStats(response.data);
    } catch (error) {
      // Mock data for development
      setSystemStats({
        totalUsers: 156,
        activeUsers: 89,
        totalCases: 2847,
        activeCases: 234,
        totalApplications: 1523,
        pendingApplications: 67,
        systemUptime: '99.8%',
        databaseSize: '2.4 GB',
        lastBackup: '2024-01-20T02:00:00Z',
        securityAlerts: 3,
        performanceScore: 94
      });
    }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data || []);
    } catch (error) {
      // Mock data for development
      setUsers([
        {
          id: 'user-001',
          name: 'John Smith',
          email: 'john.smith@police.gov.zm',
          role: 'police_officer',
          department: 'Criminal Investigation',
          status: 'active',
          lastLogin: '2024-01-20T10:30:00Z',
          createdAt: '2023-06-15T09:00:00Z',
          permissions: ['cases:read', 'cases:write', 'suspects:read', 'suspects:write'],
          badgeNumber: 'PO-12345',
          phone: '+260977123456',
          location: 'Lusaka Central Police Station'
        },
        {
          id: 'user-002',
          name: 'Maria Rodriguez',
          email: 'maria.rodriguez@immigration.gov.zm',
          role: 'immigration_officer',
          department: 'Visa Services',
          status: 'active',
          lastLogin: '2024-01-20T09:15:00Z',
          createdAt: '2023-08-20T14:30:00Z',
          permissions: ['visas:read', 'visas:write', 'permits:read', 'permits:write'],
          badgeNumber: 'IO-67890',
          phone: '+260966789012',
          location: 'Immigration Headquarters'
        },
        {
          id: 'user-003',
          name: 'David Chen',
          email: 'david.chen@admin.gov.zm',
          role: 'admin',
          department: 'System Administration',
          status: 'active',
          lastLogin: '2024-01-20T11:45:00Z',
          createdAt: '2023-01-10T08:00:00Z',
          permissions: ['admin:all', 'users:manage', 'system:configure'],
          phone: '+260955456789',
          location: 'IT Department'
        },
        {
          id: 'user-004',
          name: 'Sarah Johnson',
          email: 'sarah.johnson@police.gov.zm',
          role: 'supervisor',
          department: 'Operations',
          status: 'inactive',
          lastLogin: '2024-01-18T16:20:00Z',
          createdAt: '2023-03-05T10:15:00Z',
          permissions: ['cases:read', 'reports:generate', 'team:manage'],
          badgeNumber: 'SV-11111',
          phone: '+260944567890',
          location: 'Regional Office'
        }
      ]);
    }
  };

  const loadAuditLogs = async () => {
    try {
      const response = await api.get('/api/admin/audit-logs');
      setAuditLogs(response.data || []);
    } catch (error) {
      // Mock data for development
      setAuditLogs([
        {
          id: 'audit-001',
          timestamp: '2024-01-20T10:30:00Z',
          userId: 'user-001',
          userName: 'John Smith',
          action: 'CREATE_CASE',
          resource: 'Case #CASE-2024-001',
          details: 'Created new criminal case',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          status: 'success'
        },
        {
          id: 'audit-002',
          timestamp: '2024-01-20T10:15:00Z',
          userId: 'user-002',
          userName: 'Maria Rodriguez',
          action: 'UPDATE_VISA',
          resource: 'Visa Application #VISA-2024-045',
          details: 'Updated visa application status to approved',
          ipAddress: '192.168.1.105',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          status: 'success'
        },
        {
          id: 'audit-003',
          timestamp: '2024-01-20T09:45:00Z',
          userId: 'user-003',
          userName: 'David Chen',
          action: 'LOGIN_FAILED',
          resource: 'Authentication System',
          details: 'Failed login attempt - invalid password',
          ipAddress: '192.168.1.200',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          status: 'failed'
        }
      ]);
    }
  };

  const loadSystemAlerts = async () => {
    try {
      const response = await api.get('/api/admin/alerts');
      setSystemAlerts(response.data || []);
    } catch (error) {
      // Mock data for development
      setSystemAlerts([
        {
          id: 'alert-001',
          type: 'security',
          severity: 'high',
          title: 'Multiple Failed Login Attempts',
          message: 'User account john.doe@police.gov.zm has 5 failed login attempts in the last hour',
          timestamp: '2024-01-20T10:00:00Z',
          resolved: false
        },
        {
          id: 'alert-002',
          type: 'performance',
          severity: 'medium',
          title: 'Database Query Performance',
          message: 'Average database query time has increased by 15% in the last 24 hours',
          timestamp: '2024-01-20T08:30:00Z',
          resolved: false
        },
        {
          id: 'alert-003',
          type: 'system',
          severity: 'low',
          title: 'Scheduled Maintenance',
          message: 'System maintenance scheduled for tonight at 2:00 AM',
          timestamp: '2024-01-19T14:00:00Z',
          resolved: true,
          resolvedBy: 'System Administrator',
          resolvedAt: '2024-01-20T02:30:00Z'
        }
      ]);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'supervisor': return 'bg-purple-100 text-purple-800';
      case 'police_officer': return 'bg-blue-100 text-blue-800';
      case 'immigration_officer': return 'bg-green-100 text-green-800';
      case 'analyst': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAuditStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.badgeNumber && user.badgeNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">System administration and management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadDashboardData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
          <TabsTrigger value="alerts">System Alerts</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* System Statistics */}
          {systemStats && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    {systemStats.activeUsers} active users
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.activeCases}</div>
                  <p className="text-xs text-muted-foreground">
                    of {systemStats.totalCases} total cases
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.pendingApplications}</div>
                  <p className="text-xs text-muted-foreground">
                    of {systemStats.totalApplications} total
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">System Health</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{systemStats.performanceScore}%</div>
                  <p className="text-xs text-muted-foreground">
                    Uptime: {systemStats.systemUptime}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* System Information */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  System Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemStats && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Database Size:</span>
                      <span className="text-sm">{systemStats.databaseSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Last Backup:</span>
                      <span className="text-sm">{new Date(systemStats.lastBackup).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">System Uptime:</span>
                      <span className="text-sm">{systemStats.systemUptime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Performance Score:</span>
                      <div className="flex items-center gap-2">
                        <Progress value={systemStats.performanceScore} className="w-20" />
                        <span className="text-sm">{systemStats.performanceScore}%</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {systemAlerts.slice(0, 3).map((alert) => (
                    <div key={alert.id} className={`p-3 rounded border ${getSeverityColor(alert.severity)}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{alert.title}</p>
                          <p className="text-xs mt-1">{alert.message}</p>
                        </div>
                        <Badge className={getSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {systemAlerts.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">No recent alerts</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="police_officer">Police Officer</SelectItem>
                  <SelectItem value="immigration_officer">Immigration Officer</SelectItem>
                  <SelectItem value="analyst">Analyst</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New User</DialogTitle>
                  <DialogDescription>
                    Add a new user to the system
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="Enter full name" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter email" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="police_officer">Police Officer</SelectItem>
                          <SelectItem value="immigration_officer">Immigration Officer</SelectItem>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                          <SelectItem value="analyst">Analyst</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" placeholder="Enter department" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="badgeNumber">Badge Number</Label>
                      <Input id="badgeNumber" placeholder="Enter badge number" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" placeholder="Enter phone number" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="Enter work location" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateUserDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsCreateUserDialogOpen(false)}>
                      Create User
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>
                          <Users className="h-6 w-6" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{user.name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getRoleColor(user.role)}>
                            {user.role.replace('_', ' ')}
                          </Badge>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex gap-2 mb-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">
                        Last login: {new Date(user.lastLogin).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <span className="font-medium">Department:</span> {user.department}
                    </div>
                    {user.badgeNumber && (
                      <div>
                        <span className="font-medium">Badge:</span> {user.badgeNumber}
                      </div>
                    )}
                    {user.phone && (
                      <div>
                        <span className="font-medium">Phone:</span> {user.phone}
                      </div>
                    )}
                    {user.location && (
                      <div>
                        <span className="font-medium">Location:</span> {user.location}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Audit Logs</CardTitle>
              <CardDescription>
                System activity and user actions log
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{log.action.replace('_', ' ')}</p>
                        <p className="text-sm text-gray-600">{log.details}</p>
                        <p className="text-xs text-gray-500">
                          {log.userName} • {new Date(log.timestamp).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          IP: {log.ipAddress} • Resource: {log.resource}
                        </p>
                      </div>
                    </div>
                    <Badge className={getAuditStatusColor(log.status)}>
                      {log.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
                
                {auditLogs.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No audit logs</h3>
                    <p className="text-gray-500">System activity will appear here</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                System Alerts
              </CardTitle>
              <CardDescription>
                Security, performance, and system notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded border ${getSeverityColor(alert.severity)}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{alert.title}</h4>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge variant="outline">
                            {alert.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(alert.timestamp).toLocaleString()}
                        </p>
                        {alert.resolved && (
                          <p className="text-xs text-green-600 mt-1">
                            Resolved by {alert.resolvedBy} at {new Date(alert.resolvedAt!).toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!alert.resolved && (
                          <Button variant="outline" size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {systemAlerts.length === 0 && (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No system alerts</h3>
                    <p className="text-gray-500">All systems are running normally</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Automatic Backups</p>
                    <p className="text-sm text-gray-600">Daily database backups at 2:00 AM</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Session Timeout</p>
                    <p className="text-sm text-gray-600">Auto-logout after 30 minutes of inactivity</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Password Policy</p>
                    <p className="text-sm text-gray-600">Minimum 8 characters, special characters required</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Require 2FA for admin accounts</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">IP Whitelist</p>
                    <p className="text-sm text-gray-600">Restrict access to specific IP ranges</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Audit Logging</p>
                    <p className="text-sm text-gray-600">Log all user actions and system events</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enabled
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                {selectedUser.name}
              </DialogTitle>
              <DialogDescription>
                User Details and Permissions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <p>{selectedUser.email}</p>
                </div>
                <div>
                  <Label>Role</Label>
                  <Badge className={getRoleColor(selectedUser.role)}>
                    {selectedUser.role.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <Label>Department</Label>
                  <p>{selectedUser.department}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className={getStatusColor(selectedUser.status)}>
                    {selectedUser.status}
                  </Badge>
                </div>
                {selectedUser.badgeNumber && (
                  <div>
                    <Label>Badge Number</Label>
                    <p>{selectedUser.badgeNumber}</p>
                  </div>
                )}
                {selectedUser.phone && (
                  <div>
                    <Label>Phone</Label>
                    <p>{selectedUser.phone}</p>
                  </div>
                )}
                <div>
                  <Label>Created</Label>
                  <p>{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label>Last Login</Label>
                  <p>{new Date(selectedUser.lastLogin).toLocaleString()}</p>
                </div>
              </div>
              
              {selectedUser.location && (
                <div>
                  <Label>Location</Label>
                  <p>{selectedUser.location}</p>
                </div>
              )}
              
              <div>
                <Label>Permissions</Label>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedUser.permissions.map((permission, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminDashboard;