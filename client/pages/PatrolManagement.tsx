import { useState } from 'react';
import { Shield, MapPin, Users, Clock, AlertTriangle, Search, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';

export default function PatrolManagement() {
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard/police" className="flex items-center gap-2">
                            <Shield className="h-8 w-8 text-primary" />
                            <div>
                                <h1 className="text-2xl font-bold">Patrol Management</h1>
                                <p className="text-sm text-muted-foreground">
                                    Monitor and manage active patrols
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
                    <div className="flex gap-2 w-full max-w-md">
                        <Input placeholder="Search patrols..." className="w-full" />
                        <Button variant="outline">
                            <Search className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Patrol
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Active Patrols Stats */}
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Active Patrols</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">12</div>
                            <p className="text-xs text-muted-foreground">Currently on duty</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Incidents Reported</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">5</div>
                            <p className="text-xs text-muted-foreground">In the last 24 hours</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Available Units</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">8</div>
                            <p className="text-xs text-muted-foreground">Ready for dispatch</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Map Placeholder */}
                <Card className="min-h-[400px] flex items-center justify-center bg-muted/20 border-dashed">
                    <div className="text-center text-muted-foreground">
                        <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium">Live Map View</h3>
                        <p>Interactive map integration coming soon</p>
                    </div>
                </Card>

                {/* Patrol List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Active Units</CardTitle>
                        <CardDescription>Real-time status of deployed units</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Users className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Unit P-{100 + i}</p>
                                            <p className="text-sm text-muted-foreground">Zone {String.fromCharCode(64 + i)} • 2 Officers</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">Active</Badge>
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            4h 30m
                                        </span>
                                        <Button variant="ghost" size="sm">Details</Button>
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
