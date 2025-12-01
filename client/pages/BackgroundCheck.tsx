import { useState } from 'react';
import { AlertTriangle, ArrowLeft, FileCheck, Upload, Download, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function BackgroundCheck() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        purpose: '',
        applicantName: '',
        nrcNumber: '',
        dateOfBirth: '',
        email: '',
        phone: '',
        address: '',
        agreeToTerms: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.agreeToTerms) {
            toast.error('Please agree to the terms and conditions');
            return;
        }

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            toast.success('Background check application submitted!', {
                description: 'Processing time: 5-7 business days'
            });
            setLoading(false);
            navigate('/citizen/dashboard');
        }, 2000);
    };

    const handleChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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
                                <AlertTriangle className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Police Clearance Certificate</h1>
                                <p className="text-xs text-muted-foreground">
                                    Request background check for employment or travel
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Info Cards */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-3">
                                    <FileCheck className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="font-semibold mb-1">Processing Time</h3>
                                <p className="text-sm text-muted-foreground">5-7 business days</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                </div>
                                <h3 className="font-semibold mb-1">Valid For</h3>
                                <p className="text-sm text-muted-foreground">6 months</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex flex-col items-center text-center">
                                <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-3">
                                    <Download className="h-6 w-6 text-orange-600" />
                                </div>
                                <h3 className="font-semibold mb-1">Delivery</h3>
                                <p className="text-sm text-muted-foreground">Digital + Physical</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Application Form</CardTitle>
                        <CardDescription>
                            Complete the form below to apply for a police clearance certificate
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Purpose */}
                            <div className="space-y-3">
                                <Label>Purpose of Application *</Label>
                                <RadioGroup value={formData.purpose} onValueChange={(value) => handleChange('purpose', value)}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="employment" id="employment" />
                                        <Label htmlFor="employment" className="font-normal cursor-pointer">Employment</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="travel" id="travel" />
                                        <Label htmlFor="travel" className="font-normal cursor-pointer">International Travel</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="immigration" id="immigration" />
                                        <Label htmlFor="immigration" className="font-normal cursor-pointer">Immigration/Visa</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="education" id="education" />
                                        <Label htmlFor="education" className="font-normal cursor-pointer">Education</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="adoption" id="adoption" />
                                        <Label htmlFor="adoption" className="font-normal cursor-pointer">Adoption</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="other" id="other" />
                                        <Label htmlFor="other" className="font-normal cursor-pointer">Other</Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            {/* Personal Information */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="applicantName">Full Name (as per NRC) *</Label>
                                        <Input
                                            id="applicantName"
                                            placeholder="Full legal name"
                                            value={formData.applicantName}
                                            onChange={(e) => handleChange('applicantName', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="nrcNumber">NRC Number *</Label>
                                        <Input
                                            id="nrcNumber"
                                            placeholder="e.g., 123456/78/9"
                                            value={formData.nrcNumber}
                                            onChange={(e) => handleChange('nrcNumber', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                                        <Input
                                            id="dateOfBirth"
                                            type="date"
                                            value={formData.dateOfBirth}
                                            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number *</Label>
                                        <Input
                                            id="phone"
                                            placeholder="+260 XXX XXX XXX"
                                            value={formData.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="your.email@example.com"
                                            value={formData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="address">Residential Address *</Label>
                                        <Input
                                            id="address"
                                            placeholder="Full physical address"
                                            value={formData.address}
                                            onChange={(e) => handleChange('address', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Document Upload */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-4">Required Documents</h3>
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Upload className="h-8 w-8 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">Copy of NRC</p>
                                                    <p className="text-xs text-muted-foreground">PDF, JPG, or PNG (max 5MB)</p>
                                                </div>
                                            </div>
                                            <Button type="button" variant="outline" size="sm">
                                                Upload
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="border-2 border-dashed rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Upload className="h-8 w-8 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">Passport Photo</p>
                                                    <p className="text-xs text-muted-foreground">JPG or PNG (max 2MB)</p>
                                                </div>
                                            </div>
                                            <Button type="button" variant="outline" size="sm">
                                                Upload
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="border-2 border-dashed rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Upload className="h-8 w-8 text-muted-foreground" />
                                                <div>
                                                    <p className="font-medium">Proof of Payment</p>
                                                    <p className="text-xs text-muted-foreground">Receipt or transaction slip</p>
                                                </div>
                                            </div>
                                            <Button type="button" variant="outline" size="sm">
                                                Upload
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Fee Information */}
                            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Application Fee</h4>
                                <p className="text-sm text-amber-800 dark:text-amber-200">
                                    Standard Processing: ZMW 150.00<br />
                                    Express Processing: ZMW 300.00 (1-2 business days)
                                </p>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-start space-x-2">
                                <Checkbox
                                    id="terms"
                                    checked={formData.agreeToTerms}
                                    onCheckedChange={(checked) => handleChange('agreeToTerms', checked as boolean)}
                                />
                                <Label htmlFor="terms" className="font-normal leading-relaxed cursor-pointer">
                                    I confirm that the information provided is accurate and complete. I understand that
                                    providing false information is an offense and may result in rejection of my application
                                    or legal consequences.
                                </Label>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => navigate('/citizen/dashboard')}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={loading || !formData.agreeToTerms}
                                >
                                    {loading ? 'Submitting...' : 'Submit Application'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
