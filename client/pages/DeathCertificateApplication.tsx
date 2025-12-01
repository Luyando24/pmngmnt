import { useState } from 'react';
import { Shield, FileX, User, FileText, MapPin, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function DeathCertificateApplication() {
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        deceasedFirstName: '',
        deceasedLastName: '',
        deceasedNrc: '',
        dateOfBirth: '',
        dateOfDeath: '',
        placeOfDeath: '',
        causeOfDeath: '',
        informantName: '',
        informantNrc: '',
        informantRelation: '',
        informantPhone: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Death Certificate Application submitted successfully');
            setFormData({
                deceasedFirstName: '',
                deceasedLastName: '',
                deceasedNrc: '',
                dateOfBirth: '',
                dateOfDeath: '',
                placeOfDeath: '',
                causeOfDeath: '',
                informantName: '',
                informantNrc: '',
                informantRelation: '',
                informantPhone: ''
            });
        } catch (error) {
            toast.error('Failed to submit application');
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
                        <Link to="/citizen/dashboard" className="flex items-center gap-2">
                            <Shield className="h-8 w-8 text-primary" />
                            <div>
                                <h1 className="text-2xl font-bold">Death Registration</h1>
                                <p className="text-sm text-muted-foreground">
                                    Apply for a Death Certificate
                                </p>
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link to="/citizen/dashboard">Back to Dashboard</Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto p-6 space-y-8 max-w-5xl">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Application Form */}
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Death Registration Form</CardTitle>
                                <CardDescription>Enter details of the deceased and informant</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Deceased's Information</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="deceasedFirstName">First Name</Label>
                                                <Input
                                                    id="deceasedFirstName"
                                                    value={formData.deceasedFirstName}
                                                    onChange={(e) => setFormData({ ...formData, deceasedFirstName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="deceasedLastName">Last Name</Label>
                                                <Input
                                                    id="deceasedLastName"
                                                    value={formData.deceasedLastName}
                                                    onChange={(e) => setFormData({ ...formData, deceasedLastName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="deceasedNrc">NRC Number</Label>
                                            <Input
                                                id="deceasedNrc"
                                                value={formData.deceasedNrc}
                                                onChange={(e) => setFormData({ ...formData, deceasedNrc: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="dob">Date of Birth</Label>
                                                <Input
                                                    id="dob"
                                                    type="date"
                                                    value={formData.dateOfBirth}
                                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="dod">Date of Death</Label>
                                                <Input
                                                    id="dod"
                                                    type="date"
                                                    value={formData.dateOfDeath}
                                                    onChange={(e) => setFormData({ ...formData, dateOfDeath: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="placeOfDeath">Place of Death</Label>
                                            <Input
                                                id="placeOfDeath"
                                                value={formData.placeOfDeath}
                                                onChange={(e) => setFormData({ ...formData, placeOfDeath: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Informant's Information</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="informantName">Full Name</Label>
                                                <Input
                                                    id="informantName"
                                                    value={formData.informantName}
                                                    onChange={(e) => setFormData({ ...formData, informantName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="informantNrc">NRC Number</Label>
                                                <Input
                                                    id="informantNrc"
                                                    value={formData.informantNrc}
                                                    onChange={(e) => setFormData({ ...formData, informantNrc: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="informantRelation">Relationship to Deceased</Label>
                                                <Input
                                                    id="informantRelation"
                                                    value={formData.informantRelation}
                                                    onChange={(e) => setFormData({ ...formData, informantRelation: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="informantPhone">Phone Number</Label>
                                                <Input
                                                    id="informantPhone"
                                                    type="tel"
                                                    value={formData.informantPhone}
                                                    onChange={(e) => setFormData({ ...formData, informantPhone: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? 'Submitting...' : 'Submit Application'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Info & Status */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Requirements</CardTitle>
                                <CardDescription>Required documents</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Medical Certificate</p>
                                        <p className="text-sm text-muted-foreground">Cause of Death Certificate</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <User className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Deceased's NRC</p>
                                        <p className="text-sm text-muted-foreground">Original NRC of the deceased</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Informant's ID</p>
                                        <p className="text-sm text-muted-foreground">Valid NRC of the informant</p>
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
