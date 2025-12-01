import { useState } from 'react';
import { Shield, Globe, User, FileText, MapPin, Calendar, CheckCircle, CreditCard } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function PassportApplication() {
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        nrcNumber: '',
        dateOfBirth: '',
        nationality: 'Zambian',
        passportType: 'ordinary', // ordinary, diplomatic, service
        pages: '32', // 32, 48
        address: '',
        phone: '',
        email: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            toast.success('Passport Application submitted successfully');
            setFormData({
                firstName: '',
                lastName: '',
                nrcNumber: '',
                dateOfBirth: '',
                nationality: 'Zambian',
                passportType: 'ordinary',
                pages: '32',
                address: '',
                phone: '',
                email: ''
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
                                <h1 className="text-2xl font-bold">Passport Services</h1>
                                <p className="text-sm text-muted-foreground">
                                    Apply for a new Passport or Renewal
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
                                <CardTitle>Passport Application Form</CardTitle>
                                <CardDescription>Enter your details for passport processing</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold">Passport Details</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="passportType">Passport Type</Label>
                                                <Select
                                                    value={formData.passportType}
                                                    onValueChange={(value) => setFormData({ ...formData, passportType: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ordinary">Ordinary</SelectItem>
                                                        <SelectItem value="diplomatic">Diplomatic</SelectItem>
                                                        <SelectItem value="service">Service</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="pages">Number of Pages</Label>
                                                <Select
                                                    value={formData.pages}
                                                    onValueChange={(value) => setFormData({ ...formData, pages: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="32">32 Pages</SelectItem>
                                                        <SelectItem value="48">48 Pages</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
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
                                                <Label htmlFor="nrc">NRC Number</Label>
                                                <Input
                                                    id="nrc"
                                                    value={formData.nrcNumber}
                                                    onChange={(e) => setFormData({ ...formData, nrcNumber: e.target.value })}
                                                    required
                                                    placeholder="000000/00/1"
                                                />
                                            </div>
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
                                        <div className="grid grid-cols-2 gap-4">
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
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Button type="submit" className="w-full" disabled={loading}>
                                        {loading ? 'Submitting...' : 'Submit Passport Application'}
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
                                        <CreditCard className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Valid NRC</p>
                                        <p className="text-sm text-muted-foreground">Original National Registration Card</p>
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
                                        <FileText className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Proof of Payment</p>
                                        <p className="text-sm text-muted-foreground">Receipt for application fee</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-primary">Fees</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm">32 Pages</span>
                                    <span className="font-bold">K 320</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">48 Pages</span>
                                    <span className="font-bold">K 500</span>
                                </div>
                                <div className="flex justify-between text-muted-foreground text-xs mt-2 pt-2 border-t">
                                    <span>Express Service</span>
                                    <span>+ K 1,000</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
