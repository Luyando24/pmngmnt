import { useState } from 'react';
import { FileText, ArrowLeft, Search, Filter, CheckCircle2, Clock, AlertCircle, XCircle, Eye, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';

export default function ApplicationTracking() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const applications = [
        {
            id: 'FP-2024-001',
            type: 'Fingerprint Application',
            submittedDate: '2024-01-15',
            status: 'pending',
            statusText: 'Under Review',
            description: 'Fingerprinting service for employment verification',
            lastUpdate: '2 days ago',
            estimatedCompletion: '3-5 business days'
        },
        {
            id: 'BC-2024-045',
            type: 'Background Check',
            submittedDate: '2024-01-08',
            status: 'completed',
            statusText: 'Completed',
            description: 'Police clearance certificate for international travel',
            lastUpdate: '1 week ago',
            estimatedCompletion: 'Completed'
        },
        {
            id: 'LD-2024-023',
            type: 'Lost Document Report',
            submittedDate: '2024-01-10',
            status: 'in-progress',
            statusText: 'In Progress',
            description: 'Report for lost National Registration Card',
            lastUpdate: '5 days ago',
            estimatedCompletion: '7-10 business days'
        },
        {
            id: 'IR-2024-078',
            type: 'Incident Report',
            submittedDate: '2024-01-05',
            status: 'reviewed',
            statusText: 'Reviewed',
            description: 'Vehicle theft report - Case assigned to officer',
            lastUpdate: '2 weeks ago',
            estimatedCompletion: 'Investigation ongoing'
        },
        {
            id: 'VP-2023-156',
            type: 'Visa Application',
            submittedDate: '2023-12-20',
            status: 'rejected',
            statusText: 'Rejected',
            description: 'Tourist visa application - Missing documents',
            lastUpdate: '3 weeks ago',
            estimatedCompletion: 'N/A'
        }
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="h-5 w-5 text-green-600" />;
            case 'pending':
                return <Clock className="h-5 w-5 text-amber-600" />;
            case 'in-progress':
            case 'reviewed':
                return <AlertCircle className="h-5 w-5 text-blue-600" />;
            case 'rejected':
                return <XCircle className="h-5 w-5 text-red-600" />;
            default:
                return <FileText className="h-5 w-5 text-gray-600" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-950';
            case 'pending': return 'text-amber-600 bg-amber-100 dark:bg-amber-950';
            case 'in-progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-950';
            case 'reviewed': return 'text-indigo-600 bg-indigo-100 dark:bg-indigo-950';
            case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-950';
            default: return 'text-gray-600 bg-gray-100 dark:bg-gray-950';
        }
    };

    const filterApplications = (status?: string) => {
        let filtered = applications;

        if (status && status !== 'all') {
            filtered = filtered.filter(app => app.status === status);
        }

        if (searchTerm) {
            filtered = filtered.filter(app =>
                app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        return filtered;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
            {/* Header */}
            <div className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 shadow-sm">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/citizen/dashboard')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                                <FileText className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">My Applications</h1>
                                <p className="text-xs text-muted-foreground">
                                    Track status of all your applications
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total</p>
                                    <p className="text-2xl font-bold">{applications.length}</p>
                                </div>
                                <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Pending</p>
                                    <p className="text-2xl font-bold text-amber-600">
                                        {applications.filter(a => a.status === 'pending').length}
                                    </p>
                                </div>
                                <Clock className="h-8 w-8 text-amber-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Completed</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {applications.filter(a => a.status === 'completed').length}
                                    </p>
                                </div>
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">In Progress</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {applications.filter(a => a.status === 'in-progress' || a.status === 'reviewed').length}
                                    </p>
                                </div>
                                <AlertCircle className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Application History</CardTitle>
                                <CardDescription>View and track all your submitted applications</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Search */}
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by ID, type, or description..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Tabs */}
                        <Tabs defaultValue="all" className="space-y-6">
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="pending">Pending</TabsTrigger>
                                <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                                <TabsTrigger value="completed">Completed</TabsTrigger>
                                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                            </TabsList>

                            {['all', 'pending', 'in-progress', 'completed', 'rejected'].map(tabValue => (
                                <TabsContent key={tabValue} value={tabValue} className="space-y-4">
                                    {filterApplications(tabValue).map((application) => (
                                        <div
                                            key={application.id}
                                            className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                        {getStatusIcon(application.status)}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h3 className="font-semibold text-lg">{application.type}</h3>
                                                            <Badge className={getStatusColor(application.status)}>
                                                                {application.statusText}
                                                            </Badge>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground mb-2">
                                                            {application.description}
                                                        </p>
                                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                            <span>ID: {application.id}</span>
                                                            <span>•</span>
                                                            <span>Submitted: {new Date(application.submittedDate).toLocaleDateString()}</span>
                                                            <span>•</span>
                                                            <span>Updated: {application.lastUpdate}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View
                                                    </Button>
                                                    {application.status === 'completed' && (
                                                        <Button size="sm">
                                                            <Download className="h-4 w-4 mr-2" />
                                                            Download
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mt-4 pt-4 border-t">
                                                <div className="flex items-center justify-between text-sm mb-2">
                                                    <span className="text-muted-foreground">Estimated Completion</span>
                                                    <span className="font-medium">{application.estimatedCompletion}</span>
                                                </div>
                                                <div className="w-full bg-secondary rounded-full h-2">
                                                    <div
                                                        className="bg-primary h-2 rounded-full transition-all"
                                                        style={{
                                                            width: application.status === 'completed' ? '100%' :
                                                                application.status === 'reviewed' ? '75%' :
                                                                    application.status === 'in-progress' ? '50%' :
                                                                        application.status === 'pending' ? '25%' : '0%'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {filterApplications(tabValue).length === 0 && (
                                        <div className="text-center py-12">
                                            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                            <h3 className="text-lg font-semibold mb-2">No applications found</h3>
                                            <p className="text-sm text-muted-foreground">
                                                {searchTerm ? 'Try adjusting your search terms' : 'You haven\'t submitted any applications yet'}
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
