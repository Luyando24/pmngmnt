import { useState } from 'react';
import { Shield, Fingerprint, Calendar, User, FileText, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';
import { Api } from '@/lib/api';
import type { CreateFingerprintApplicationRequest, FingerprintApplication as IFingerprintApplication } from '@shared/api';
import { toast } from 'sonner';

export default function FingerprintApplication() {
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);
    const [applications, setApplications] = useState<IFingerprintApplication[]>([]);

    const [formData, setFormData] = useState<CreateFingerprintApplicationRequest>({
        firstName: '',
        lastName: '',
        nrc: '',
        phone: '',
        reason: 'police_clearance',
        preferredDate: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await Api.createFingerprintApplication(formData);
            setApplications([result, ...applications]);
            toast.success('Application submitted successfully');
            setFormData({
                firstName: '',
                lastName: '',
                nrc: '',
                phone: '',
                reason: 'police_clearance',
                preferredDate: '',
            });
        } catch (error) {
            toast.error('Failed to submit application');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                <div className="container mx-auto flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="flex items-center gap-2">
                            <Shield className="h-8 w-8 text-primary" />
                            <div>
                                <h1 className="text-2xl font-bold">Fingerprint Services</h1>
                                <p className="text-sm text-muted-foreground">
                                    Apply for police clearance and fingerprinting
                                </p>
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link to="/">Back to Home</Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto p-6 space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Application Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>New Application</CardTitle>
                            <CardDescription>Fill in your details to book a fingerprinting session</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="nrc">NRC / Passport Number</Label>
                                    <Input
                                        id="nrc"
                                        value={formData.nrc}
                                        onChange={(e) => setFormData({ ...formData, nrc: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="reason">Reason for Application</Label>
                                    <Select
                                        value={formData.reason}
                                        onValueChange={(value: any) => setFormData({ ...formData, reason: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="police_clearance">Police Clearance Certificate</SelectItem>
                                            <SelectItem value="visa">Visa Application</SelectItem>
                                            <SelectItem value="employment">Employment Screening</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date">Preferred Date</Label>
                                    <Input
                                        id="date"
                                        type="date"
                                        value={formData.preferredDate}
                                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit Application'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Info & Status */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Requirements</CardTitle>
                                <CardDescription>What you need to bring</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <User className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Valid ID</p>
                                        <p className="text-sm text-muted-foreground">Original NRC or Passport</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Proof of Payment</p>
                                        <p className="text-sm text-muted-foreground">Receipt for service fee (K150)</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Fingerprint className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Clean Hands</p>
                                        <p className="text-sm text-muted-foreground">Ensure hands are clean and free of cuts</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Your Applications</CardTitle>
                                <CardDescription>Track status of recent requests</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {applications.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No active applications
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {applications.map((app) => (
                                            <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{app.reason.replace('_', ' ').toUpperCase()}</p>
                                                    <p className="text-sm text-muted-foreground">{new Date(app.preferredDate).toLocaleDateString()}</p>
                                                </div>
                                                <Badge variant={app.status === 'pending' ? 'secondary' : 'default'}>
                                                    {app.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
