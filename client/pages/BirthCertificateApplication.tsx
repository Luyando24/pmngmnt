import { useState } from 'react';
import { Shield, Baby, User, FileText, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function BirthCertificateApplication() {
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        childFirstName: '',
        childLastName: '',
        dateOfBirth: '',
        timeOfBirth: '',
        gender: '',
        placeOfBirth: '',
        hospitalName: '',
        fatherName: '',
        fatherNrc: '',
        motherName: '',
        motherNrc: '',
        informantName: '',
        informantRelation: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Birth Certificate Application submitted successfully');
            setFormData({
                childFirstName: '',
                childLastName: '',
                dateOfBirth: '',
                timeOfBirth: '',
                gender: '',
                placeOfBirth: '',
                hospitalName: '',
                fatherName: '',
                fatherNrc: '',
                motherName: '',
                motherNrc: '',
                informantName: '',
                informantRelation: ''
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
                                <h1 className="text-2xl font-bold">Birth Registration</h1>
                                <p className="text-sm text-muted-foreground">
                                    Apply for a Birth Certificate
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
                                <CardTitle>Birth Registration Form</CardTitle>
                                <CardDescription>Enter details of the child and parents</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Child's Information</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="childFirstName">First Name</Label>
                                                <Input
                                                    id="childFirstName"
                                                    value={formData.childFirstName}
                                                    onChange={(e) => setFormData({ ...formData, childFirstName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="childLastName">Last Name</Label>
                                                <Input
                                                    id="childLastName"
                                                    value={formData.childLastName}
                                                    onChange={(e) => setFormData({ ...formData, childLastName: e.target.value })}
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
                                            <Label htmlFor="placeOfBirth">Place of Birth (City/District)</Label>
                                            <Input
                                                id="placeOfBirth"
                                                value={formData.placeOfBirth}
                                                onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="hospitalName">Hospital / Health Facility Name</Label>
                                            <Input
                                                id="hospitalName"
                                                value={formData.hospitalName}
                                                onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                                                placeholder="Leave blank if home birth"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Parents' Information</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="motherName">Mother's Full Name</Label>
                                                <Input
                                                    id="motherName"
                                                    value={formData.motherName}
                                                    onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="motherNrc">Mother's NRC</Label>
                                                <Input
                                                    id="motherNrc"
                                                    value={formData.motherNrc}
                                                    onChange={(e) => setFormData({ ...formData, motherNrc: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
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
                                                <Label htmlFor="fatherNrc">Father's NRC</Label>
                                                <Input
                                                    id="fatherNrc"
                                                    value={formData.fatherNrc}
                                                    onChange={(e) => setFormData({ ...formData, fatherNrc: e.target.value })}
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
                                        <p className="font-medium">Birth Record</p>
                                        <p className="text-sm text-muted-foreground">Notification of Birth from Hospital</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <User className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Parents' NRCs</p>
                                        <p className="text-sm text-muted-foreground">Copies of both parents' NRCs</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Marriage Certificate</p>
                                        <p className="text-sm text-muted-foreground">If applicable</p>
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
