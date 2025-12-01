import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, ArrowLeft, User, Bell, Lock, Globe, Eye, EyeOff, Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';

export default function CitizenSettings() {
    const navigate = useNavigate();
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        nrc: '',
        address: ''
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailNotifications: true,
        smsNotifications: true,
        applicationUpdates: true,
        newsAlerts: false,
        maintenanceAlerts: true
    });

    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: false,
        loginAlerts: true,
        sessionTimeout: '30'
    });

    const [preferences, setPreferences] = useState({
        language: 'en',
        theme: 'dark',
        dateFormat: 'DD/MM/YYYY',
        timezone: 'Africa/Lusaka'
    });

    // Load resident data from session on mount
    useEffect(() => {
        // Debug: Check localStorage directly
        const rawSession = localStorage.getItem('ipims_auth_session');
        console.log('Raw localStorage:', rawSession);
        const parsedSession = rawSession ? JSON.parse(rawSession) : null;
        console.log('Parsed session from localStorage:', parsedSession);
        console.log('Resident from parsed session:', parsedSession?.resident);

        // Debug: Check what useAuth returns
        console.log('Session from useAuth:', session);
        console.log('Resident from useAuth session:', (session as any)?.resident);

        if (session && (session as any).resident) {
            const resident = (session as any).resident;
            console.log('Loading profile data:', {
                firstName: resident.firstName,
                lastName: resident.lastName,
                email: resident.email,
                phone: resident.phone,
                nrc: resident.nrc,
                address: resident.address
            });

            setProfileData({
                firstName: resident.firstName || '',
                lastName: resident.lastName || '',
                email: resident.email || '',
                phone: resident.phone || '',
                nrc: resident.nrc || '',
                address: resident.address || ''
            });
        } else {
            console.error('No resident data found in session!');
        }
    }, [session]);

    const handleSaveProfile = () => {
        setLoading(true);
        setTimeout(() => {
            toast.success('Profile updated successfully!');
            setLoading(false);
        }, 1000);
    };

    const handleSaveNotifications = () => {
        setLoading(true);
        setTimeout(() => {
            toast.success('Notification settings updated!');
            setLoading(false);
        }, 1000);
    };

    const handleSaveSecurity = () => {
        setLoading(true);
        setTimeout(() => {
            toast.success('Security settings updated!');
            setLoading(false);
        }, 1000);
    };

    const handleSavePreferences = () => {
        setLoading(true);
        setTimeout(() => {
            toast.success('Preferences updated!');
            setLoading(false);
        }, 1000);
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
                            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                                <SettingsIcon className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Settings</h1>
                                <p className="text-xs text-muted-foreground">
                                    Manage your account and preferences
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="profile" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            <span className="hidden sm:inline">Profile</span>
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="flex items-center gap-2">
                            <Bell className="h-4 w-4" />
                            <span className="hidden sm:inline">Notifications</span>
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            <span className="hidden sm:inline">Security</span>
                        </TabsTrigger>
                        <TabsTrigger value="preferences" className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span className="hidden sm:inline">Preferences</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Information</CardTitle>
                                <CardDescription>Update your personal information and contact details</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-6 pb-6 border-b">
                                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="h-10 w-10 text-primary" />
                                    </div>
                                    <div>
                                        <Button variant="outline" size="sm">Change Photo</Button>
                                        <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF (max 2MB)</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            value={profileData.firstName}
                                            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            value={profileData.lastName}
                                            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nrc">NRC Number</Label>
                                        <Input
                                            id="nrc"
                                            value={profileData.nrc}
                                            onChange={(e) => setProfileData({ ...profileData, nrc: e.target.value })}
                                            disabled
                                        />
                                        <p className="text-xs text-muted-foreground">NRC cannot be changed</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            value={profileData.address}
                                            onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleSaveProfile} disabled={loading}>
                                        <Save className="h-4 w-4 mr-2" />
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications">
                        <Card>
                            <CardHeader>
                                <CardTitle>Notification Preferences</CardTitle>
                                <CardDescription>Choose how you want to receive notifications</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-lg border">
                                        <div>
                                            <h4 className="font-medium">Email Notifications</h4>
                                            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.emailNotifications}
                                            onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg border">
                                        <div>
                                            <h4 className="font-medium">SMS Notifications</h4>
                                            <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.smsNotifications}
                                            onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, smsNotifications: checked })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg border">
                                        <div>
                                            <h4 className="font-medium">Application Updates</h4>
                                            <p className="text-sm text-muted-foreground">Get updates on your applications</p>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.applicationUpdates}
                                            onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, applicationUpdates: checked })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg border">
                                        <div>
                                            <h4 className="font-medium">News & Alerts</h4>
                                            <p className="text-sm text-muted-foreground">Receive news and general alerts</p>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.newsAlerts}
                                            onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, newsAlerts: checked })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg border">
                                        <div>
                                            <h4 className="font-medium">Maintenance Alerts</h4>
                                            <p className="text-sm text-muted-foreground">Get notified about system maintenance</p>
                                        </div>
                                        <Switch
                                            checked={notificationSettings.maintenanceAlerts}
                                            onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, maintenanceAlerts: checked })}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleSaveNotifications} disabled={loading}>
                                        <Save className="h-4 w-4 mr-2" />
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security">
                        <Card>
                            <CardHeader>
                                <CardTitle>Security Settings</CardTitle>
                                <CardDescription>Manage your account security and privacy</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Change Password */}
                                <div className="border-b pb-6">
                                    <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="currentPassword">Current Password</Label>
                                            <div className="relative">
                                                <Input
                                                    id="currentPassword"
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="Enter current password"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="newPassword">New Password</Label>
                                            <Input
                                                id="newPassword"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                        <Button>Update Password</Button>
                                    </div>
                                </div>

                                {/* Security Options */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-lg border">
                                        <div>
                                            <h4 className="font-medium">Two-Factor Authentication</h4>
                                            <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                                        </div>
                                        <Switch
                                            checked={securitySettings.twoFactorAuth}
                                            onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg border">
                                        <div>
                                            <h4 className="font-medium">Login Alerts</h4>
                                            <p className="text-sm text-muted-foreground">Get notified of new logins</p>
                                        </div>
                                        <Switch
                                            checked={securitySettings.loginAlerts}
                                            onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, loginAlerts: checked })}
                                        />
                                    </div>

                                    <div className="p-4 rounded-lg border">
                                        <div className="mb-3">
                                            <h4 className="font-medium">Session Timeout</h4>
                                            <p className="text-sm text-muted-foreground">Auto logout after inactivity</p>
                                        </div>
                                        <Select value={securitySettings.sessionTimeout} onValueChange={(value) => setSecuritySettings({ ...securitySettings, sessionTimeout: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="15">15 minutes</SelectItem>
                                                <SelectItem value="30">30 minutes</SelectItem>
                                                <SelectItem value="60">1 hour</SelectItem>
                                                <SelectItem value="120">2 hours</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleSaveSecurity} disabled={loading}>
                                        <Save className="h-4 w-4 mr-2" />
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Preferences Tab */}
                    <TabsContent value="preferences">
                        <Card>
                            <CardHeader>
                                <CardTitle>Application Preferences</CardTitle>
                                <CardDescription>Customize your experience</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="language">Language</Label>
                                        <Select value={preferences.language} onValueChange={(value) => setPreferences({ ...preferences, language: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="ny">Nyanja</SelectItem>
                                                <SelectItem value="bem">Bemba</SelectItem>
                                                <SelectItem value="tg">Tonga</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="theme">Theme</Label>
                                        <Select value={preferences.theme} onValueChange={(value) => setPreferences({ ...preferences, theme: value })}>
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

                                    <div className="space-y-2">
                                        <Label htmlFor="dateFormat">Date Format</Label>
                                        <Select value={preferences.dateFormat} onValueChange={(value) => setPreferences({ ...preferences, dateFormat: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="timezone">Timezone</Label>
                                        <Select value={preferences.timezone} onValueChange={(value) => setPreferences({ ...preferences, timezone: value })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Africa/Lusaka">CAT (UTC+2)</SelectItem>
                                                <SelectItem value="Africa/Johannesburg">SAST (UTC+2)</SelectItem>
                                                <SelectItem value="Africa/Nairobi">EAT (UTC+3)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button onClick={handleSavePreferences} disabled={loading}>
                                        <Save className="h-4 w-4 mr-2" />
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}