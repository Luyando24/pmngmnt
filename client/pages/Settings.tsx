import { useState } from 'react';
import { Shield, Save, Bell, Lock, User, Monitor, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Settings() {
    const { session } = useAuth();

    return (
        <div className="min-h-screen bg-background">
            {/* Sticky Header */}
            <div className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        <Link to="/dashboard/police" className="flex items-center gap-2">
                            <Shield className="h-8 w-8 text-primary" />
                            <div>
                                <h1 className="text-2xl font-bold">Settings</h1>
                                <p className="text-sm text-muted-foreground">
                                    Manage your preferences and account settings
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
                <Tabs defaultValue="general" className="w-full">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-64">
                            <TabsList className="flex flex-col h-auto items-stretch bg-transparent p-0 gap-1">
                                <TabsTrigger
                                    value="general"
                                    className="justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:text-foreground"
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    General
                                </TabsTrigger>
                                <TabsTrigger
                                    value="notifications"
                                    className="justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:text-foreground"
                                >
                                    <Bell className="mr-2 h-4 w-4" />
                                    Notifications
                                </TabsTrigger>
                                <TabsTrigger
                                    value="security"
                                    className="justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:text-foreground"
                                >
                                    <Lock className="mr-2 h-4 w-4" />
                                    Security
                                </TabsTrigger>
                                <TabsTrigger
                                    value="display"
                                    className="justify-start px-4 py-2 data-[state=active]:bg-muted data-[state=active]:text-foreground"
                                >
                                    <Monitor className="mr-2 h-4 w-4" />
                                    Display
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1">
                            <TabsContent value="general" className="mt-0 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Profile Information</CardTitle>
                                        <CardDescription>Update your personal details</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="firstName">First Name</Label>
                                                <Input id="firstName" defaultValue="John" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="lastName">Last Name</Label>
                                                <Input id="lastName" defaultValue="Doe" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" type="email" defaultValue="john.doe@police.gov.zm" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="badge">Badge Number</Label>
                                            <Input id="badge" defaultValue="PO-12345" disabled />
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Station Assignment</CardTitle>
                                        <CardDescription>Current duty station details</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Station</Label>
                                            <Input defaultValue="Central Police Station" disabled />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Role</Label>
                                            <Input defaultValue="Senior Officer" disabled />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="notifications" className="mt-0 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Notification Preferences</CardTitle>
                                        <CardDescription>Manage how you receive alerts</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Emergency Alerts</Label>
                                                <p className="text-sm text-muted-foreground">Receive high priority emergency notifications</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Shift Updates</Label>
                                                <p className="text-sm text-muted-foreground">Notifications about shift changes and roster updates</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Case Updates</Label>
                                                <p className="text-sm text-muted-foreground">Updates on cases assigned to you</p>
                                            </div>
                                            <Switch defaultChecked />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="security" className="mt-0 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Password & Authentication</CardTitle>
                                        <CardDescription>Manage your security settings</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">Current Password</Label>
                                            <Input id="current-password" type="password" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input id="new-password" type="password" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                                            <Input id="confirm-password" type="password" />
                                        </div>
                                        <Button>Update Password</Button>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="display" className="mt-0 space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Display Settings</CardTitle>
                                        <CardDescription>Customize your dashboard appearance</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Theme</Label>
                                            <Select defaultValue="system">
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="light">Light</SelectItem>
                                                    <SelectItem value="dark">Dark</SelectItem>
                                                    <SelectItem value="system">System</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label>Compact Mode</Label>
                                                <p className="text-sm text-muted-foreground">Use a more compact layout for lists</p>
                                            </div>
                                            <Switch />
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </div>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}
