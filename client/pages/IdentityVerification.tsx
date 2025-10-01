import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Shield, Search, Plus, Eye, Edit, Calendar, MapPin, Phone, Mail, Clock, QrCode, Fingerprint, Camera, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Api } from "@/lib/api";

interface IdentityRecord {
  id: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  phone?: string;
  email?: string;
  photo?: string;
  fingerprints: string[];
  biometricData: {
    faceRecognition: boolean;
    fingerprintMatch: boolean;
    irisRecognition: boolean;
  };
  verificationStatus: 'verified' | 'pending' | 'flagged' | 'rejected';
  verificationDate?: string;
  verificationOfficer?: string;
  documents: {
    type: string;
    number: string;
    issueDate: string;
    expiryDate?: string;
    verified: boolean;
  }[];
  criminalRecord?: {
    hasRecord: boolean;
    details?: string;
    lastUpdated: string;
  };
  travelHistory: {
    entryDate: string;
    exitDate?: string;
    country: string;
    purpose: string;
  }[];
  alerts: {
    type: 'security' | 'immigration' | 'criminal' | 'document';
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    date: string;
  }[];
  qrCode: string;
  lastVerified: string;
  createdAt: string;
  updatedAt: string;
}

const IdentityVerification = () => {
  const { session: user } = useAuth();
  const [records, setRecords] = useState<IdentityRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [alertFilter, setAlertFilter] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<IdentityRecord | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scanMode, setScanMode] = useState(false);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/identity-records');
      setRecords(response.data || []);
    } catch (error) {
      console.error('Failed to load identity records:', error);
      // Mock data for development
      setRecords([
        {
          id: 'ID-2024-001',
          nationalId: '123456/78/9',
          firstName: 'Michael',
          lastName: 'Thompson',
          dateOfBirth: '1985-04-12',
          placeOfBirth: 'Lusaka, Zambia',
          nationality: 'Zambian',
          gender: 'male',
          address: '123 Independence Ave, Lusaka',
          phone: '+260977123456',
          email: 'michael.thompson@email.com',
          fingerprints: ['thumb_right', 'index_right', 'middle_right'],
          biometricData: {
            faceRecognition: true,
            fingerprintMatch: true,
            irisRecognition: false
          },
          verificationStatus: 'verified',
          verificationDate: '2024-01-15',
          verificationOfficer: 'Officer Davis',
          documents: [
            {
              type: 'National ID',
              number: '123456/78/9',
              issueDate: '2020-01-15',
              expiryDate: '2030-01-15',
              verified: true
            },
            {
              type: 'Passport',
              number: 'ZM1234567',
              issueDate: '2019-06-20',
              expiryDate: '2029-06-20',
              verified: true
            }
          ],
          criminalRecord: {
            hasRecord: false,
            lastUpdated: '2024-01-15'
          },
          travelHistory: [
            {
              entryDate: '2023-12-01',
              exitDate: '2023-12-15',
              country: 'South Africa',
              purpose: 'Business'
            }
          ],
          alerts: [],
          qrCode: 'QR123456789',
          lastVerified: '2024-01-15',
          createdAt: '2020-01-15',
          updatedAt: '2024-01-15'
        },
        {
          id: 'ID-2024-002',
          nationalId: '987654/32/1',
          firstName: 'Grace',
          lastName: 'Mwanza',
          dateOfBirth: '1992-08-30',
          placeOfBirth: 'Ndola, Zambia',
          nationality: 'Zambian',
          gender: 'female',
          address: '456 Cairo Road, Ndola',
          phone: '+260955876543',
          email: 'grace.mwanza@email.com',
          fingerprints: ['thumb_right', 'index_right'],
          biometricData: {
            faceRecognition: true,
            fingerprintMatch: false,
            irisRecognition: true
          },
          verificationStatus: 'flagged',
          verificationDate: '2024-01-18',
          verificationOfficer: 'Officer Wilson',
          documents: [
            {
              type: 'National ID',
              number: '987654/32/1',
              issueDate: '2018-03-10',
              expiryDate: '2028-03-10',
              verified: false
            }
          ],
          criminalRecord: {
            hasRecord: true,
            details: 'Minor traffic violations',
            lastUpdated: '2024-01-18'
          },
          travelHistory: [],
          alerts: [
            {
              type: 'document',
              message: 'Document verification failed - fingerprint mismatch',
              severity: 'high',
              date: '2024-01-18'
            },
            {
              type: 'security',
              message: 'Multiple verification attempts',
              severity: 'medium',
              date: '2024-01-18'
            }
          ],
          qrCode: 'QR987654321',
          lastVerified: '2024-01-18',
          createdAt: '2018-03-10',
          updatedAt: '2024-01-18'
        },
        {
          id: 'ID-2024-003',
          nationalId: '555666/77/8',
          firstName: 'John',
          lastName: 'Banda',
          dateOfBirth: '1970-12-05',
          placeOfBirth: 'Kitwe, Zambia',
          nationality: 'Zambian',
          gender: 'male',
          address: 'Ministry of Foreign Affairs, Lusaka',
          phone: '+260211123456',
          email: 'j.banda@mofa.gov.zm',
          fingerprints: ['thumb_right', 'index_right', 'middle_right', 'ring_right', 'pinky_right'],
          biometricData: {
            faceRecognition: true,
            fingerprintMatch: true,
            irisRecognition: true
          },
          verificationStatus: 'verified',
          verificationDate: '2024-01-20',
          verificationOfficer: 'Senior Officer Brown',
          documents: [
            {
              type: 'Diplomatic ID',
              number: 'DIP001234',
              issueDate: '2023-01-01',
              expiryDate: '2026-01-01',
              verified: true
            },
            {
              type: 'Diplomatic Passport',
              number: 'ZMD123456',
              issueDate: '2023-01-01',
              expiryDate: '2028-01-01',
              verified: true
            }
          ],
          criminalRecord: {
            hasRecord: false,
            lastUpdated: '2024-01-20'
          },
          travelHistory: [
            {
              entryDate: '2023-11-01',
              exitDate: '2023-11-30',
              country: 'United States',
              purpose: 'Diplomatic Mission'
            },
            {
              entryDate: '2023-09-15',
              exitDate: '2023-09-25',
              country: 'United Kingdom',
              purpose: 'Official Visit'
            }
          ],
          alerts: [],
          qrCode: 'QR555666777',
          lastVerified: '2024-01-20',
          createdAt: '2023-01-01',
          updatedAt: '2024-01-20'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'flagged': return 'bg-red-100 text-red-800';
      case 'rejected': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="h-4 w-4" />;
      case 'immigration': return <MapPin className="h-4 w-4" />;
      case 'criminal': return <AlertTriangle className="h-4 w-4" />;
      case 'document': return <Eye className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.nationalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.verificationStatus === statusFilter;
    const matchesAlert = alertFilter === 'all' || 
                        (alertFilter === 'has_alerts' && record.alerts.length > 0) ||
                        (alertFilter === 'no_alerts' && record.alerts.length === 0);
    return matchesSearch && matchesStatus && matchesAlert;
  });

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="grid gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Identity Verification</h1>
          <p className="text-gray-600 mt-2">Verify and manage citizen identity records</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={scanMode ? "default" : "outline"}
            onClick={() => setScanMode(!scanMode)}
            className="flex items-center gap-2"
          >
            <QrCode className="h-4 w-4" />
            {scanMode ? 'Exit Scan Mode' : 'QR Scan Mode'}
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>New Identity Record</DialogTitle>
                <DialogDescription>
                  Create a new identity verification record
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" placeholder="Enter first name" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" placeholder="Enter last name" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nationalId">National ID</Label>
                    <Input id="nationalId" placeholder="Enter national ID" />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input id="dateOfBirth" type="date" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="placeOfBirth">Place of Birth</Label>
                    <Input id="placeOfBirth" placeholder="Enter place of birth" />
                  </div>
                  <div>
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input id="nationality" placeholder="Enter nationality" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="Enter phone number" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="Enter email" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea id="address" placeholder="Enter address" rows={2} />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsCreateDialogOpen(false)}>
                    Create Record
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {scanMode && (
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <QrCode className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold text-blue-900">QR Code Scan Mode Active</h3>
                <p className="text-blue-700">Scan a QR code to quickly verify an identity</p>
              </div>
              <Button variant="outline" className="ml-auto">
                <Camera className="h-4 w-4 mr-2" />
                Start Camera
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, ID, or record number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={alertFilter} onValueChange={setAlertFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by alerts" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Records</SelectItem>
            <SelectItem value="has_alerts">Has Alerts</SelectItem>
            <SelectItem value="no_alerts">No Alerts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredRecords.map((record) => (
          <Card key={record.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={record.photo} />
                    <AvatarFallback>
                      <Shield className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {record.firstName} {record.lastName}
                      <span className="text-sm text-gray-500">({record.nationalId})</span>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {record.id} • {record.nationality}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(record.verificationStatus)}>
                    {record.verificationStatus}
                  </Badge>
                  {record.alerts.length > 0 && (
                    <Badge className="bg-red-100 text-red-800">
                      {record.alerts.length} Alert{record.alerts.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Born: {new Date(record.dateOfBirth).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {record.placeOfBirth}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  {record.phone || 'No phone'}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  Last verified: {new Date(record.lastVerified).toLocaleDateString()}
                </div>
              </div>
              
              {/* Biometric Status */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Biometric Verification:</p>
                <div className="flex gap-2">
                  <Badge variant={record.biometricData.faceRecognition ? "default" : "outline"} className="text-xs">
                    {record.biometricData.faceRecognition ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                    Face
                  </Badge>
                  <Badge variant={record.biometricData.fingerprintMatch ? "default" : "outline"} className="text-xs">
                    {record.biometricData.fingerprintMatch ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                    Fingerprint
                  </Badge>
                  <Badge variant={record.biometricData.irisRecognition ? "default" : "outline"} className="text-xs">
                    {record.biometricData.irisRecognition ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                    Iris
                  </Badge>
                </div>
              </div>
              
              {/* Documents */}
              {record.documents.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Documents:</p>
                  <div className="flex flex-wrap gap-1">
                    {record.documents.map((doc, index) => (
                      <Badge key={index} variant={doc.verified ? "default" : "outline"} className="text-xs">
                        {doc.verified ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                        {doc.type}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Alerts */}
              {record.alerts.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Active Alerts:</p>
                  <div className="space-y-1">
                    {record.alerts.slice(0, 2).map((alert, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        {getAlertTypeIcon(alert.type)}
                        <Badge className={getAlertSeverityColor(alert.severity)}>
                          {alert.severity}
                        </Badge>
                        <span className="text-gray-600">{alert.message}</span>
                      </div>
                    ))}
                    {record.alerts.length > 2 && (
                      <p className="text-xs text-gray-500">+{record.alerts.length - 2} more alerts</p>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {record.verificationOfficer && (
                    <p>Verified by: {record.verificationOfficer}</p>
                  )}
                  {record.criminalRecord?.hasRecord && (
                    <p className="text-red-600">Has criminal record</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedRecord(record)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Fingerprint className="h-4 w-4 mr-1" />
                    Verify
                  </Button>
                  <Button variant="outline" size="sm">
                    <QrCode className="h-4 w-4 mr-1" />
                    QR Code
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Record Details Dialog */}
      {selectedRecord && (
        <Dialog open={!!selectedRecord} onOpenChange={() => setSelectedRecord(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                {selectedRecord.firstName} {selectedRecord.lastName}
                <span className="text-sm text-gray-500">({selectedRecord.nationalId})</span>
              </DialogTitle>
              <DialogDescription>
                Identity Verification Record Details
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList>
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="biometric">Biometric Data</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="travel">Travel History</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
              </TabsList>
              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedRecord.verificationStatus)}>
                      {selectedRecord.verificationStatus}
                    </Badge>
                  </div>
                  <div>
                    <Label>QR Code</Label>
                    <p>{selectedRecord.qrCode}</p>
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <p>{new Date(selectedRecord.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Place of Birth</Label>
                    <p>{selectedRecord.placeOfBirth}</p>
                  </div>
                  <div>
                    <Label>Nationality</Label>
                    <p>{selectedRecord.nationality}</p>
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <p className="capitalize">{selectedRecord.gender}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Address</Label>
                    <p>{selectedRecord.address}</p>
                  </div>
                  {selectedRecord.email && (
                    <div>
                      <Label>Email</Label>
                      <p>{selectedRecord.email}</p>
                    </div>
                  )}
                  {selectedRecord.phone && (
                    <div>
                      <Label>Phone</Label>
                      <p>{selectedRecord.phone}</p>
                    </div>
                  )}
                  <div>
                    <Label>Last Verified</Label>
                    <p>{new Date(selectedRecord.lastVerified).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Verification Officer</Label>
                    <p>{selectedRecord.verificationOfficer || 'Not assigned'}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="biometric">
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className={`p-4 rounded-lg ${selectedRecord.biometricData.faceRecognition ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Camera className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-medium">Face Recognition</p>
                        <p className={selectedRecord.biometricData.faceRecognition ? 'text-green-600' : 'text-red-600'}>
                          {selectedRecord.biometricData.faceRecognition ? 'Verified' : 'Failed'}
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`p-4 rounded-lg ${selectedRecord.biometricData.fingerprintMatch ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Fingerprint className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-medium">Fingerprint</p>
                        <p className={selectedRecord.biometricData.fingerprintMatch ? 'text-green-600' : 'text-red-600'}>
                          {selectedRecord.biometricData.fingerprintMatch ? 'Verified' : 'Failed'}
                        </p>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`p-4 rounded-lg ${selectedRecord.biometricData.irisRecognition ? 'bg-green-100' : 'bg-red-100'}`}>
                        <Eye className="h-8 w-8 mx-auto mb-2" />
                        <p className="font-medium">Iris Recognition</p>
                        <p className={selectedRecord.biometricData.irisRecognition ? 'text-green-600' : 'text-red-600'}>
                          {selectedRecord.biometricData.irisRecognition ? 'Verified' : 'Failed'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Fingerprints on File</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedRecord.fingerprints.map((fp, index) => (
                        <Badge key={index} variant="outline">
                          {fp.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="documents">
                <div className="space-y-2">
                  {selectedRecord.documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded">
                      {doc.verified ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{doc.type}</p>
                        <p className="text-sm text-gray-600">{doc.number}</p>
                        <p className="text-xs text-gray-500">
                          Issued: {new Date(doc.issueDate).toLocaleDateString()}
                          {doc.expiryDate && ` • Expires: ${new Date(doc.expiryDate).toLocaleDateString()}`}
                        </p>
                      </div>
                      <Badge variant={doc.verified ? "default" : "destructive"}>
                        {doc.verified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="travel">
                <div className="space-y-2">
                  {selectedRecord.travelHistory.length > 0 ? (
                    selectedRecord.travelHistory.map((travel, index) => (
                      <div key={index} className="p-3 border rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{travel.country}</p>
                            <p className="text-sm text-gray-600">{travel.purpose}</p>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <p>Entry: {new Date(travel.entryDate).toLocaleDateString()}</p>
                            {travel.exitDate && (
                              <p>Exit: {new Date(travel.exitDate).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No travel history recorded</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="alerts">
                <div className="space-y-2">
                  {selectedRecord.alerts.length > 0 ? (
                    selectedRecord.alerts.map((alert, index) => (
                      <div key={index} className="p-3 border rounded">
                        <div className="flex items-start gap-2">
                          {getAlertTypeIcon(alert.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={getAlertSeverityColor(alert.severity)}>
                                {alert.severity}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(alert.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm">{alert.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No alerts recorded</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default IdentityVerification;