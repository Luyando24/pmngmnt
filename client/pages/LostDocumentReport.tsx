import { useState } from 'react';
import { Shield, FileWarning, MapPin, Phone, Calendar, Search, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';
import { Api } from '@/lib/api';
import type { CreateLostDocumentReportRequest, LostDocumentReport as ILostDocumentReport } from '@shared/api';
import { toast } from 'sonner';

export default function LostDocumentReport() {
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);
    const [reports, setReports] = useState<ILostDocumentReport[]>([]);

    const [formData, setFormData] = useState<CreateLostDocumentReportRequest>({
        firstName: '',
        lastName: '',
        contactPhone: '',
        documentType: 'nrc',
        documentNumber: '',
        dateLost: '',
        locationLost: '',
        description: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await Api.createLostDocumentReport(formData);
            setReports([result, ...reports]);
            toast.success('Report submitted successfully');
            setFormData({
                firstName: '',
                lastName: '',
                contactPhone: '',
                documentType: 'nrc',
                documentNumber: '',
                dateLost: '',
                locationLost: '',
                description: '',
            });
        } catch (error) {
            toast.error('Failed to submit report');
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
                                <h1 className="text-2xl font-bold">Lost Documents</h1>
                                <p className="text-sm text-muted-foreground">
                                    Report lost NRCs, Passports, and other official documents
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
                    {/* Report Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Report Lost Document</CardTitle>
                            <CardDescription>Provide details to help us track your document</CardDescription>
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
                                    <Label htmlFor="contactPhone">Contact Phone</Label>
                                    <Input
                                        id="contactPhone"
                                        type="tel"
                                        value={formData.contactPhone}
                                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="documentType">Document Type</Label>
                                        <Select
                                            value={formData.documentType}
                                            onValueChange={(value: any) => setFormData({ ...formData, documentType: value })}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="nrc">NRC (National Registration Card)</SelectItem>
                                                <SelectItem value="passport">Passport</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="documentNumber">Document Number (Optional)</Label>
                                        <Input
                                            id="documentNumber"
                                            value={formData.documentNumber}
                                            onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                                            placeholder="If known"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="dateLost">Date Lost</Label>
                                        <Input
                                            id="dateLost"
                                            type="date"
                                            value={formData.dateLost}
                                            onChange={(e) => setFormData({ ...formData, dateLost: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="locationLost">Location Lost</Label>
                                        <Input
                                            id="locationLost"
                                            value={formData.locationLost}
                                            onChange={(e) => setFormData({ ...formData, locationLost: e.target.value })}
                                            placeholder="e.g. Lusaka CBD"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description of Incident</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe how and where the document was lost..."
                                        rows={4}
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit Report'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Info & Status */}
                    <div className="space-y-6">
                        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                    <AlertCircle className="h-5 w-5" />
                                    Important Notice
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-blue-700 dark:text-blue-400">
                                <p>
                                    Reporting a lost document helps prevent identity theft. Once reported, the document number will be flagged in our system.
                                    If you find your document later, please visit the nearest police station to clear the flag.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Your Reports</CardTitle>
                                <CardDescription>Status of reported lost documents</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {reports.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No reports submitted yet
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {reports.map((report) => (
                                            <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                <div>
                                                    <p className="font-medium">{report.documentType.toUpperCase()} - {report.locationLost}</p>
                                                    <p className="text-sm text-muted-foreground">Lost on {new Date(report.dateLost).toLocaleDateString()}</p>
                                                </div>
                                                <Badge variant={report.status === 'reported' ? 'secondary' : 'outline'}>
                                                    {report.status}
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
