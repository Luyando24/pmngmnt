import { useState } from 'react';
import { Shield, FileText, Download, Filter, Calendar, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Reports() {
    const { session } = useAuth();

    const recentReports = [
        { id: 1, title: 'Monthly Crime Statistics', type: 'Statistical', date: '2024-03-01', author: 'System', status: 'Ready' },
        { id: 2, title: 'Shift Performance Review', type: 'Performance', date: '2024-02-28', author: 'Sgt. Mumba', status: 'Ready' },
        { id: 3, title: 'Incident Response Analysis', type: 'Analytical', date: '2024-02-25', author: 'Lt. Banda', status: 'Draft' },
        { id: 4, title: 'Resource Allocation Report', type: 'Administrative', date: '2024-02-20', author: 'System', status: 'Ready' },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard/police" className="flex items-center gap-2">
                            <Shield className="h-8 w-8 text-primary" />
                            <div>
                                <h1 className="text-2xl font-bold">Reports & Analytics</h1>
                                <p className="text-sm text-muted-foreground">
                                    Generate and view detailed reports
                                </p>
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline">Officer</Badge>
                        <Badge variant="secondary">{session?.userId?.slice(0, 8) || 'PO-001'}</Badge>
                    </div>
                </div>
            </div>

            <div className="container mx-auto p-6 space-y-6">
                <div className="flex justify-between items-center">
                    <Tabs defaultValue="all" className="w-[400px]">
                        <TabsList>
                            <TabsTrigger value="all">All Reports</TabsTrigger>
                            <TabsTrigger value="generated">Generated</TabsTrigger>
                            <TabsTrigger value="drafts">Drafts</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                        <Button>
                            <FileText className="mr-2 h-4 w-4" />
                            Generate New Report
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Report Types */}
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-blue-500" />
                                Crime Statistics
                            </CardTitle>
                            <CardDescription>Crime rates and trends analysis</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="h-5 w-5 text-green-500" />
                                Demographics
                            </CardTitle>
                            <CardDescription>Suspect and victim demographic data</CardDescription>
                        </CardHeader>
                    </Card>
                    <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-purple-500" />
                                Performance
                            </CardTitle>
                            <CardDescription>Officer and station performance metrics</CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Reports</CardTitle>
                        <CardDescription>List of recently generated and modified reports</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentReports.map((report) => (
                                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                            <FileText className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{report.title}</h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <span>{report.type}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {report.date}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden md:block">
                                            <p className="text-sm font-medium">{report.author}</p>
                                            <p className="text-xs text-muted-foreground">Author</p>
                                        </div>
                                        <Badge variant={report.status === 'Ready' ? 'default' : 'secondary'}>
                                            {report.status}
                                        </Badge>
                                        <Button variant="ghost" size="icon">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
