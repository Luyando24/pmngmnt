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
import { CreditCard, Search, Plus, Eye, Edit, Calendar, MapPin, Phone, Mail, Clock, RefreshCw } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Api } from "@/lib/api";

interface PassportApplication {
  id: string;
  applicantName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  gender: 'male' | 'female' | 'other';
  applicationType: 'new' | 'renewal' | 'replacement' | 'amendment';
  passportType: 'ordinary' | 'diplomatic' | 'service' | 'emergency';
  applicationDate: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'issued' | 'ready_for_collection';
  priority: 'normal' | 'urgent' | 'emergency';
  documents: string[];
  fee: number;
  processingOfficer?: string;
  notes: string;
  photo?: string;
  email?: string;
  phone?: string;
  address: string;
  emergencyContact: string;
  currentPassportNumber?: string;
  expiryDate?: string;
  issueDate?: string;
  collectionDate?: string;
  trackingNumber: string;
}

const PassportServices = () => {
  const { session: user } = useAuth();
  const [applications, setApplications] = useState<PassportApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<PassportApplication | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/passport-applications');
      setApplications(response.data || []);
    } catch (error) {
      console.error('Failed to load passport applications:', error);
      // Mock data for development
      setApplications([
        {
          id: 'PP-2024-001',
          applicantName: 'Michael Thompson',
          dateOfBirth: '1985-04-12',
          placeOfBirth: 'Lusaka, Zambia',
          nationality: 'Zambian',
          gender: 'male',
          applicationType: 'new',
          passportType: 'ordinary',
          applicationDate: '2024-01-15',
          status: 'ready_for_collection',
          priority: 'normal',
          documents: ['Birth Certificate', 'National ID', 'Photos', 'Application Form'],
          fee: 120,
          processingOfficer: 'Officer Davis',
          notes: 'First-time passport application, all documents verified',
          email: 'michael.thompson@email.com',
          phone: '+260977123456',
          address: '123 Independence Ave, Lusaka',
          emergencyContact: 'Jane Thompson - +260966987654',
          trackingNumber: 'ZM2024001234',
          issueDate: '2024-01-25',
          expiryDate: '2034-01-25'
        },
        {
          id: 'PP-2024-002',
          applicantName: 'Grace Mwanza',
          dateOfBirth: '1992-08-30',
          placeOfBirth: 'Ndola, Zambia',
          nationality: 'Zambian',
          gender: 'female',
          applicationType: 'renewal',
          passportType: 'ordinary',
          applicationDate: '2024-01-18',
          status: 'under_review',
          priority: 'urgent',
          documents: ['Current Passport', 'National ID', 'Photos', 'Application Form'],
          fee: 150,
          processingOfficer: 'Officer Wilson',
          notes: 'Passport renewal, expires in 2 months',
          email: 'grace.mwanza@email.com',
          phone: '+260955876543',
          address: '456 Cairo Road, Ndola',
          emergencyContact: 'Peter Mwanza - +260966123456',
          currentPassportNumber: 'ZM1234567',
          trackingNumber: 'ZM2024001235'
        },
        {
          id: 'PP-2024-003',
          applicantName: 'Ambassador John Banda',
          dateOfBirth: '1970-12-05',
          placeOfBirth: 'Kitwe, Zambia',
          nationality: 'Zambian',
          gender: 'male',
          applicationType: 'new',
          passportType: 'diplomatic',
          applicationDate: '2024-01-20',
          status: 'approved',
          priority: 'emergency',
          documents: ['Diplomatic Credentials', 'National ID', 'Photos', 'Ministry Authorization'],
          fee: 0,
          processingOfficer: 'Senior Officer Brown',
          notes: 'Diplomatic passport for embassy assignment',
          email: 'j.banda@mofa.gov.zm',
          phone: '+260211123456',
          address: 'Ministry of Foreign Affairs, Lusaka',
          emergencyContact: 'Ministry Security - +260211987654',
          trackingNumber: 'ZM2024DIP001'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'issued': return 'bg-purple-100 text-purple-800';
      case 'ready_for_collection': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'normal': return 'bg-gray-100 text-gray-800';
      case 'urgent': return 'bg-orange-100 text-orange-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPassportTypeColor = (type: string) => {
    switch (type) {
      case 'ordinary': return 'bg-blue-100 text-blue-800';
      case 'diplomatic': return 'bg-red-100 text-red-800';
      case 'service': return 'bg-green-100 text-green-800';
      case 'emergency': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesType = typeFilter === 'all' || app.applicationType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
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
          <h1 className="text-3xl font-bold text-gray-900">Passport Services</h1>
          <p className="text-gray-600 mt-2">Manage passport applications and issuance</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Application
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Passport Application</DialogTitle>
              <DialogDescription>
                Create a new passport application
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="applicantName">Applicant Name</Label>
                  <Input id="applicantName" placeholder="Enter full name" />
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
                  <Label htmlFor="applicationType">Application Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select application type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Passport</SelectItem>
                      <SelectItem value="renewal">Renewal</SelectItem>
                      <SelectItem value="replacement">Replacement</SelectItem>
                      <SelectItem value="amendment">Amendment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="passportType">Passport Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select passport type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ordinary">Ordinary</SelectItem>
                      <SelectItem value="diplomatic">Diplomatic</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
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
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input id="emergencyContact" placeholder="Name and phone number" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  Create Application
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search applications..."
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="issued">Issued</SelectItem>
            <SelectItem value="ready_for_collection">Ready for Collection</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="renewal">Renewal</SelectItem>
            <SelectItem value="replacement">Replacement</SelectItem>
            <SelectItem value="amendment">Amendment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredApplications.map((application) => (
          <Card key={application.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={application.photo} />
                    <AvatarFallback>
                      <CreditCard className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {application.applicantName}
                      <span className="text-sm text-gray-500">({application.trackingNumber})</span>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {application.id} • {application.nationality}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={getPassportTypeColor(application.passportType)}>
                    {application.passportType}
                  </Badge>
                  {application.priority !== 'normal' && (
                    <Badge className={getPriorityColor(application.priority)}>
                      {application.priority}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Applied: {new Date(application.applicationDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RefreshCw className="h-4 w-4" />
                  Type: {application.applicationType}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  Born: {application.placeOfBirth}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Fee: ${application.fee}</span>
                </div>
              </div>
              
              {application.currentPassportNumber && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Current Passport:</p>
                  <p className="text-sm text-gray-600">{application.currentPassportNumber}</p>
                </div>
              )}
              
              {application.documents.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Documents:</p>
                  <div className="flex flex-wrap gap-1">
                    {application.documents.map((doc, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {doc}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {application.processingOfficer && (
                    <p>Officer: {application.processingOfficer}</p>
                  )}
                  {application.issueDate && (
                    <p>Issued: {new Date(application.issueDate).toLocaleDateString()}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedApplication(application)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Process
                  </Button>
                  {application.status === 'ready_for_collection' && (
                    <Button variant="outline" size="sm">
                      Mark Collected
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Application Details Dialog */}
      {selectedApplication && (
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Passport className="h-6 w-6" />
                {selectedApplication.applicantName}
                <span className="text-sm text-gray-500">({selectedApplication.trackingNumber})</span>
              </DialogTitle>
              <DialogDescription>
                Passport Application Details
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedApplication.status)}>
                      {selectedApplication.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Badge className={getPriorityColor(selectedApplication.priority)}>
                      {selectedApplication.priority}
                    </Badge>
                  </div>
                  <div>
                    <Label>Application Type</Label>
                    <p className="capitalize">{selectedApplication.applicationType}</p>
                  </div>
                  <div>
                    <Label>Passport Type</Label>
                    <Badge className={getPassportTypeColor(selectedApplication.passportType)}>
                      {selectedApplication.passportType}
                    </Badge>
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <p>{new Date(selectedApplication.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Place of Birth</Label>
                    <p>{selectedApplication.placeOfBirth}</p>
                  </div>
                  <div>
                    <Label>Nationality</Label>
                    <p>{selectedApplication.nationality}</p>
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <p className="capitalize">{selectedApplication.gender}</p>
                  </div>
                  <div>
                    <Label>Fee</Label>
                    <p>${selectedApplication.fee}</p>
                  </div>
                  <div>
                    <Label>Tracking Number</Label>
                    <p>{selectedApplication.trackingNumber}</p>
                  </div>
                  {selectedApplication.currentPassportNumber && (
                    <div>
                      <Label>Current Passport</Label>
                      <p>{selectedApplication.currentPassportNumber}</p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <Label>Address</Label>
                    <p>{selectedApplication.address}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Emergency Contact</Label>
                    <p>{selectedApplication.emergencyContact}</p>
                  </div>
                  {selectedApplication.email && (
                    <div>
                      <Label>Email</Label>
                      <p>{selectedApplication.email}</p>
                    </div>
                  )}
                  {selectedApplication.phone && (
                    <div>
                      <Label>Phone</Label>
                      <p>{selectedApplication.phone}</p>
                    </div>
                  )}
                  {selectedApplication.issueDate && (
                    <div>
                      <Label>Issue Date</Label>
                      <p>{new Date(selectedApplication.issueDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  {selectedApplication.expiryDate && (
                    <div>
                      <Label>Expiry Date</Label>
                      <p>{new Date(selectedApplication.expiryDate).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="documents">
                <div className="space-y-2">
                  {selectedApplication.documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded">
                      <CreditCard className="h-4 w-4 text-blue-500" />
                      <span>{doc}</span>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="processing">
                <div className="space-y-4">
                  <div>
                    <Label>Processing Officer</Label>
                    <p>{selectedApplication.processingOfficer || 'Not assigned'}</p>
                  </div>
                  <div>
                    <Label>Application Date</Label>
                    <p>{new Date(selectedApplication.applicationDate).toLocaleDateString()}</p>
                  </div>
                  {selectedApplication.collectionDate && (
                    <div>
                      <Label>Collection Date</Label>
                      <p>{new Date(selectedApplication.collectionDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline">
                      Approve
                    </Button>
                    <Button variant="outline">
                      Reject
                    </Button>
                    <Button variant="outline">
                      Request More Info
                    </Button>
                    {selectedApplication.status === 'approved' && (
                      <Button variant="outline">
                        Issue Passport
                      </Button>
                    )}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="notes">
                <div className="p-4 bg-gray-50 rounded">
                  <p>{selectedApplication.notes || 'No notes available'}</p>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default PassportServices;