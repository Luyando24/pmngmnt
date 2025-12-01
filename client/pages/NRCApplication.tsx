import { useState } from 'react';
import { Shield, CreditCard, User, FileText, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function NRCApplication() {
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        placeOfBirth: '',
        gender: '',
        fatherName: '',
        motherName: '',
        address: '',
        phone: '',
        applicationType: 'new' // new, replacement, correction
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('NRC Application submitted successfully');
            setFormData({
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                placeOfBirth: '',
                gender: '',
                fatherName: '',
                motherName: '',
                address: '',
                phone: '',
                applicationType: 'new'
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
                                <h1 className="text-2xl font-bold">NRC Services</h1>
                                <p className="text-sm text-muted-foreground">
                                    National Registration Card Application
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
                                <CardTitle>Application Form</CardTitle>
                                <CardDescription>Please provide accurate information as it appears on official documents</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Application Type</h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <Button
                                                type="button"
                                                variant={formData.applicationType === 'new' ? 'default' : 'outline'}
                                                onClick={() => setFormData({ ...formData, applicationType: 'new' })}
                                                className="w-full"
                                            >
                                                New Registration
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={formData.applicationType === 'replacement' ? 'default' : 'outline'}
                                                onClick={() => setFormData({ ...formData, applicationType: 'replacement' })}
                                                className="w-full"
                                            >
                                                Replacement
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={formData.applicationType === 'correction' ? 'default' : 'outline'}
                                                onClick={() => setFormData({ ...formData, applicationType: 'correction' })}
                                                className="w-full"
                                            >
                                                Correction
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Personal Information</h3>
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
                                                <Label htmlFor="gender">Gender</Label>
                                                <Select
                                                    value={formData.gender}
                                                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select gender" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="male">Male</SelectItem>
                                                        <SelectItem value="female">Female</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="pob">Place of Birth</Label>
                                            <Input
                                                id="pob"
                                                placeholder="City, District, Province"
                                                value={formData.placeOfBirth}
                                                onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Parent Details</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="fatherName">Father's Full Name</Label>
                                                <Input
                                                    id="fatherName"
                                                    value={formData.fatherName}
                                                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="motherName">Mother's Full Name</Label>
                                                <Input
                                                    id="motherName"
                                                    value={formData.motherName}
                                                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Contact Information</h3>
                                        <div className="space-y-2">
                                            <Label htmlFor="address">Residential Address</Label>
                                            <Input
                                                id="address"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                                    </div>

                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? 'Submitting...' : 'Submit NRC Application'}
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
                                        <p className="font-medium">Birth Certificate</p>
                                        <p className="text-sm text-muted-foreground">Original or certified copy</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <User className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Passport Photos</p>
                                        <p className="text-sm text-muted-foreground">2 recent passport-sized photos</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Parent's NRC</p>
                                        <p className="text-sm text-muted-foreground">Copy of parent's NRC (if applicable)</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-primary">Important Note</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">
                                    After submitting your application online, you will be scheduled for biometric data capture at your nearest National Registration Office.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
