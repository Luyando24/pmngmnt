import { Car, Phone, AlertTriangle, ArrowLeft, MapPin, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function EmergencyServices() {
    const navigate = useNavigate();

    const emergencyContacts = [
        {
            name: 'Police Emergency',
            number: '999',
            description: 'For crimes in progress, accidents, or immediate danger',
            icon: AlertTriangle,
            color: 'from-red-500/20 to-red-500/10',
            iconColor: 'text-red-600',
            bgColor: 'bg-red-50 dark:bg-red-950/30'
        },
        {
            name: 'Ambulance',
            number: '993',
            description: 'For medical emergencies and serious injuries',
            icon: Car,
            color: 'from-blue-500/20 to-blue-500/10',
            iconColor: 'text-blue-600',
            bgColor: 'bg-blue-50 dark:bg-blue-950/30'
        },
        {
            name: 'Fire Service',
            number: '993',
            description: 'For fires, gas leaks, or trapped persons',
            icon: AlertTriangle,
            color: 'from-orange-500/20 to-orange-500/10',
            iconColor: 'text-orange-600',
            bgColor: 'bg-orange-50 dark:bg-orange-950/30'
        }
    ];

    const policeStations = [
        {
            name: 'Central Police Station',
            address: 'Independence Avenue, Lusaka',
            phone: '+260 211 123456',
            hours: '24/7'
        },
        {
            name: 'Kabwata Police Station',
            address: 'Kabwata Road, Lusaka',
            phone: '+260 211 234567',
            hours: '24/7'
        },
        {
            name: 'Matero Police Station',
            address: 'Great East Road, Lusaka',
            phone: '+260 211 345678',
            hours: '24/7'
        }
    ];

    const safetyTips = [
        'Stay calm and speak clearly when calling emergency services',
        'Provide your exact location and describe the emergency',
        'Follow instructions from the emergency operator',
        'Do not hang up until told to do so',
        'If it\'s safe, stay on the scene until help arrives',
        'Provide witness information if available'
    ];

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
                                <Car className="h-5 w-5 text-destructive" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">Emergency Services</h1>
                                <p className="text-xs text-muted-foreground">
                                    Quick access to emergency contacts and information
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Emergency Alert Banner */}
                <Card className="mb-8 bg-gradient-to-r from-destructive/10 to-destructive/5 border-destructive/20">
                    <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="h-6 w-6 text-destructive" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2">In Case of Life-Threatening Emergency</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    If you or someone else is in immediate danger, call 999 immediately. This service is available 24/7.
                                </p>
                                <Button variant="destructive" size="lg" className="font-bold">
                                    <Phone className="h-5 w-5 mr-2" />
                                    Call 999 Now
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Emergency Contacts */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">Emergency Contact Numbers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {emergencyContacts.map((contact, index) => (
                            <Card key={index} className={contact.bgColor}>
                                <CardContent className="p-6">
                                    <div className={`flex items-center justify-center h-14 w-14 rounded-full bg-gradient-to-br ${contact.color} mx-auto mb-4`}>
                                        <contact.icon className={`h-7 w-7 ${contact.iconColor}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-center mb-2">{contact.name}</h3>
                                    <p className="text-3xl font-bold text-center mb-3">{contact.number}</p>
                                    <p className="text-sm text-center text-muted-foreground">{contact.description}</p>
                                    <Button className="w-full mt-4" variant="outline">
                                        <Phone className="h-4 w-4 mr-2" />
                                        Call Now
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Police Stations */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Nearby Police Stations
                            </CardTitle>
                            <CardDescription>24/7 emergency and non-emergency services</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {policeStations.map((station, index) => (
                                <div key={index} className="p-4 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
                                    <h4 className="font-semibold mb-2">{station.name}</h4>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-3 w-3" />
                                            <span>{station.address}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-3 w-3" />
                                            <span>{station.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-3 w-3" />
                                            <span>{station.hours}</span>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="w-full mt-3">
                                        Get Directions
                                    </Button>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Safety Tips */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Safety Tips
                            </CardTitle>
                            <CardDescription>What to do when calling emergency services</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3">
                                {safetyTips.map((tip, index) => (
                                    <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
                                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-xs font-bold text-primary">{index + 1}</span>
                                        </div>
                                        <p className="text-sm">{tip}</p>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* Additional Services */}
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Non-Emergency Services</CardTitle>
                        <CardDescription>For general inquiries and non-urgent matters</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg border">
                                <h4 className="font-semibold mb-2">Police Reporting</h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Report non-emergency crimes
                                </p>
                                <p className="font-bold text-lg">991</p>
                            </div>
                            <div className="p-4 rounded-lg border">
                                <h4 className="font-semibold mb-2">Crime Stoppers</h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                    Anonymous tip line
                                </p>
                                <p className="font-bold text-lg">992</p>
                            </div>
                            <div className="p-4 rounded-lg border">
                                <h4 className="font-semibold mb-2">Gender-Based Violence</h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                    24/7 support hotline
                                </p>
                                <p className="font-bold text-lg">116</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
