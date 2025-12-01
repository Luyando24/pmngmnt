import { useState } from 'react';
import { Shield, Calendar, Clock, Users, ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ShiftManagement() {
    const { session } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date());

    const shifts = [
        { id: 1, name: 'Morning Shift', time: '06:00 - 14:00', officers: 12, supervisor: 'Sgt. Mumba', status: 'active' },
        { id: 2, name: 'Afternoon Shift', time: '14:00 - 22:00', officers: 10, supervisor: 'Sgt. Banda', status: 'upcoming' },
        { id: 3, name: 'Night Shift', time: '22:00 - 06:00', officers: 8, supervisor: 'Sgt. Phiri', status: 'upcoming' },
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
                                <h1 className="text-2xl font-bold">Shift Management</h1>
                                <p className="text-sm text-muted-foreground">
                                    Manage officer schedules and assignments
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2 border rounded-md px-4 py-2 bg-card">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{currentDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <Button variant="outline" size="icon">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Users className="mr-2 h-4 w-4" />
                            View Roster
                        </Button>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Assign Shift
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Today's Overview */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Today's Shifts</CardTitle>
                            <CardDescription>Overview of current and upcoming shifts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {shifts.map((shift) => (
                                    <div key={shift.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${shift.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                <Clock className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium">{shift.name}</h3>
                                                <p className="text-sm text-muted-foreground">{shift.time}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right hidden md:block">
                                                <p className="text-sm font-medium">{shift.supervisor}</p>
                                                <p className="text-xs text-muted-foreground">Supervisor</p>
                                            </div>
                                            <div className="text-right hidden md:block">
                                                <p className="text-sm font-medium">{shift.officers} Officers</p>
                                                <p className="text-xs text-muted-foreground">On Duty</p>
                                            </div>
                                            <Badge variant={shift.status === 'active' ? 'default' : 'secondary'}>
                                                {shift.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Staffing Levels</CardTitle>
                                <CardDescription>Current deployment status</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Total Officers</span>
                                        <span className="font-medium">45</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-primary w-[100%]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>On Duty</span>
                                        <span className="font-medium">12</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[26%]" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>On Leave</span>
                                        <span className="font-medium">3</span>
                                    </div>
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-500 w-[6%]" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Pending Requests</CardTitle>
                                <CardDescription>Leave and shift swap requests</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                                        <div>
                                            <p className="text-sm font-medium">Leave Request</p>
                                            <p className="text-xs text-muted-foreground">Officer John Doe • 2 days</p>
                                        </div>
                                        <Button size="sm" variant="outline">Review</Button>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                                        <div>
                                            <p className="text-sm font-medium">Shift Swap</p>
                                            <p className="text-xs text-muted-foreground">Jane Smith ↔ Mike Ross</p>
                                        </div>
                                        <Button size="sm" variant="outline">Review</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
