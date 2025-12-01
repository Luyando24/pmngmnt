import { useState } from 'react';
import { Shield, MapPin, Camera, FileText, AlertCircle, ArrowLeft, Upload, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function ReportCase() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        incidentType: '',
        location: '',
        dateTime: '',
        description: '',
        witnessName: '',
        witnessContact: '',
        reporterName: '',
        reporterContact: '',
        reporterEmail: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            toast.success('Incident reported successfully!', {
                description: 'You will receive a reference number via email.'
            });
            setLoading(false);
            navigate('/citizen/dashboard');
        }, 2000);
    };

    const handleChange = (field: string, value: string) => {
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
                            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
                                <Shield className="h-5 w-5 text-destructive" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Report Incident</h1>
                                <p className="text-xs text-muted-foreground">
                                    Report crimes, accidents, or suspicious activities
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Incident Report Form</CardTitle>
                        <CardDescription>
                            Please provide detailed information about the incident. All fields marked with * are required.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Incident Type */}
                            <div className="space-y-2">
                                <Label htmlFor="incidentType">Incident Type *</Label>
                                <Select value={formData.incidentType} onValueChange={(value) => handleChange('incidentType', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select incident type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="theft">Theft</SelectItem>
                                        <SelectItem value="assault">Assault</SelectItem>
                                        <SelectItem value="vandalism">Vandalism</SelectItem>
                                        <SelectItem value="burglary">Burglary</SelectItem>
                                        <SelectItem value="fraud">Fraud</SelectItem>
                                        <SelectItem value="accident">Traffic Accident</SelectItem>
                                        <SelectItem value="suspicious">Suspicious Activity</SelectItem>
                                        <SelectItem value="domestic">Domestic Violence</SelectItem>
                                        <SelectItem value="cybercrime">Cybercrime</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location">Location *</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="location"
                                        placeholder="Enter location of incident"
                                        className="pl-10"
                                        value={formData.location}
                                        onChange={(e) => handleChange('location', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Date and Time */}
                            <div className="space-y-2">
                                <Label htmlFor="dateTime">Date and Time *</Label>
                                <Input
                                    id="dateTime"
                                    type="datetime-local"
                                    value={formData.dateTime}
                                    onChange={(e) => handleChange('dateTime', e.target.value)}
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Incident Description *</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Provide a detailed description of what happened..."
                                    className="min-h-32"
                                    value={formData.description}
                                    onChange={(e) => handleChange('description', e.target.value)}
                                    required
                                />
                            </div>

                            {/* Witness Information */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-4">Witness Information (Optional)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="witnessName">Witness Name</Label>
                                        <Input
                                            id="witnessName"
                                            placeholder="Full name"
                                            value={formData.witnessName}
                                            onChange={(e) => handleChange('witnessName', e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="witnessContact">Witness Contact</Label>
                                        <Input
                                            id="witnessContact"
                                            placeholder="Phone number"
                                            value={formData.witnessContact}
                                            onChange={(e) => handleChange('witnessContact', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Reporter Information */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-4">Your Contact Information *</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="reporterName">Full Name *</Label>
                                        <Input
                                            id="reporterName"
                                            placeholder="Your full name"
                                            value={formData.reporterName}
                                            onChange={(e) => handleChange('reporterName', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reporterEmail">Email *</Label>
                                        <Input
                                            id="reporterEmail"
                                            type="email"
                                            placeholder="your.email@example.com"
                                            value={formData.reporterEmail}
                                            onChange={(e) => handleChange('reporterEmail', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reporterContact">Phone Number *</Label>
                                        <Input
                                            id="reporterContact"
                                            placeholder="Your phone number"
                                            value={formData.reporterContact}
                                            onChange={(e) => handleChange('reporterContact', e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Evidence Upload */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-4">Evidence (Optional)</h3>
                                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Upload photos, videos, or documents related to the incident
                                    </p>
                                    <Button type="button" variant="outline" size="sm">
                                        Choose Files
                                    </Button>
                                </div>
                            </div>

                            {/* Info Alert */}
                            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3">
                                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Important Information</p>
                                    <ul className="list-disc list-inside text-blue-800 dark:text-blue-200 space-y-1">
                                        <li>You will receive a reference number via email</li>
                                        <li>A police officer may contact you for additional information</li>
                                        <li>False reports are punishable by law</li>
                                        <li>For emergencies, please call 999 immediately</li>
                                    </ul>
                                </div>
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
                                    disabled={loading}
                                >
                                    {loading ? 'Submitting...' : 'Submit Report'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
