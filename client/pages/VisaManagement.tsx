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
import { FileText, Search, Plus, Eye, Edit, Calendar, MapPin, Phone, Mail, Clock, CreditCard } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Api } from "@/lib/api";

interface VisaApplication {
  id: string;
  applicantName: string;
  passportNumber: string;
  nationality: string;
  visaType: 'tourist' | 'business' | 'work' | 'student' | 'transit' | 'diplomatic';
  purpose: string;
  duration: number; // in days
  entryType: 'single' | 'multiple';
  applicationDate: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'issued';
  priority: 'normal' | 'urgent' | 'emergency';
  documents: string[];
  fee: number;
  processingOfficer?: string;
  notes: string;
  photo?: string;
  email?: string;
  phone?: string;
  address: string;
  dateOfBirth: string;
  expectedArrival?: string;
  sponsor?: string;
}

const VisaManagement = () => {
  const { session: user } = useAuth();
  const [applications, setApplications] = useState<VisaApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<VisaApplication | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/visa-applications');
      setApplications(response.data || []);
    } catch (error) {
      console.error('Failed to load visa applications:', error);
      // Mock data for development
      setApplications([
        {
          id: 'VA-2024-001',
          applicantName: 'John Smith',
          passportNumber: 'US123456789',
          nationality: 'American',
          visaType: 'business',
          purpose: 'Business meetings and conferences',
          duration: 30,
          entryType: 'multiple',
          applicationDate: '2024-01-15',
          status: 'under_review',
          priority: 'normal',
          documents: ['Passport Copy', 'Business Letter', 'Hotel Booking'],
          fee: 150,
          processingOfficer: 'Officer Johnson',
          notes: 'All documents verified',
          email: 'john.smith@email.com',
          phone: '+1234567890',
          address: '123 Main St, New York, USA',
          dateOfBirth: '1985-06-15',
          expectedArrival: '2024-02-01',
          sponsor: 'ABC Corporation'
        },
        {
          id: 'VA-2024-002',
          applicantName: 'Maria Garcia',
          passportNumber: 'ES987654321',
          nationality: 'Spanish',
          visaType: 'tourist',
          purpose: 'Tourism and sightseeing',
          duration: 14,
          entryType: 'single',
          applicationDate: '2024-01-18',
          status: 'approved',
          priority: 'normal',
          documents: ['Passport Copy', 'Travel Itinerary', 'Bank Statement'],
          fee: 75,
          processingOfficer: 'Officer Williams',
          notes: 'Standard tourist visa approved',
          email: 'maria.garcia@email.com',
          phone: '+34123456789',
          address: '456 Barcelona St, Madrid, Spain',
          dateOfBirth: '1992-03-22',
          expectedArrival: '2024-02-10'
        },
        {
          id: 'VA-2024-003',
          applicantName: 'David Chen',
          passportNumber: 'CN456789123',
          nationality: 'Chinese',
          visaType: 'work',
          purpose: 'Employment at tech company',
          duration: 365,
          entryType: 'multiple',
          applicationDate: '2024-01-20',
          status: 'pending',
          priority: 'urgent',
          documents: ['Passport Copy', 'Work Permit', 'Employment Contract'],
          fee: 300,
          notes: 'Awaiting security clearance',
          email: 'david.chen@email.com',
          phone: '+86123456789',
          address: '789 Beijing Rd, Shanghai, China',
          dateOfBirth: '1988-11-08',
          sponsor: 'TechCorp Zambia'
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

  const getVisaTypeColor = (type: string) => {
    switch (type) {
      case 'tourist': return 'bg-blue-100 text-blue-800';
      case 'business': return 'bg-green-100 text-green-800';
      case 'work': return 'bg-purple-100 text-purple-800';
      case 'student': return 'bg-indigo-100 text-indigo-800';
      case 'transit': return 'bg-yellow-100 text-yellow-800';
      case 'diplomatic': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.passportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesType = typeFilter === 'all' || app.visaType === typeFilter;
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
          <h1 className="text-3xl font-bold text-gray-900">Visa Management</h1>
          <p className="text-gray-600 mt-2">Process and manage visa applications</p>
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
              <DialogTitle>New Visa Application</DialogTitle>
              <DialogDescription>
                Create a new visa application
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="applicantName">Applicant Name</Label>
                  <Input id="applicantName" placeholder="Enter full name" />
                </div>
                <div>
                  <Label htmlFor="passportNumber">Passport Number</Label>
                  <Input id="passportNumber" placeholder="Enter passport number" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input id="nationality" placeholder="Enter nationality" />
                </div>
                <div>
                  <Label htmlFor="visaType">Visa Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visa type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tourist">Tourist</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="work">Work</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="transit">Transit</SelectItem>
                      <SelectItem value="diplomatic">Diplomatic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (days)</Label>
                  <Input id="duration" type="number" placeholder="Enter duration" />
                </div>
                <div>
                  <Label htmlFor="entryType">Entry Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select entry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single Entry</SelectItem>
                      <SelectItem value="multiple">Multiple Entry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="purpose">Purpose of Visit</Label>
                <Textarea id="purpose" placeholder="Enter purpose of visit" rows={3} />
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
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="tourist">Tourist</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="transit">Transit</SelectItem>
            <SelectItem value="diplomatic">Diplomatic</SelectItem>
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
                      <span className="text-sm text-gray-500">({application.id})</span>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {application.passportNumber} • {application.nationality}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={getVisaTypeColor(application.visaType)}>
                    {application.visaType}
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
                  <Clock className="h-4 w-4" />
                  Duration: {application.duration} days
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  Entry: {application.entryType}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Fee: ${application.fee}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Purpose:</p>
                <p className="text-sm text-gray-600">{application.purpose}</p>
              </div>
              
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
                <span className="text-sm text-gray-500">({selectedApplication.id})</span>
              </DialogTitle>
              <DialogDescription>
                Visa Application Details
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
                    <Label>Passport Number</Label>
                    <p>{selectedApplication.passportNumber}</p>
                  </div>
                  <div>
                    <Label>Nationality</Label>
                    <p>{selectedApplication.nationality}</p>
                  </div>
                  <div>
                    <Label>Visa Type</Label>
                    <Badge className={getVisaTypeColor(selectedApplication.visaType)}>
                      {selectedApplication.visaType}
                    </Badge>
                  </div>
                  <div>
                    <Label>Entry Type</Label>
                    <p className="capitalize">{selectedApplication.entryType} Entry</p>
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <p>{selectedApplication.duration} days</p>
                  </div>
                  <div>
                    <Label>Fee</Label>
                    <p>${selectedApplication.fee}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Purpose</Label>
                    <p>{selectedApplication.purpose}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Address</Label>
                    <p>{selectedApplication.address}</p>
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
                  {selectedApplication.sponsor && (
                    <div className="col-span-2">
                      <Label>Sponsor</Label>
                      <p>{selectedApplication.sponsor}</p>
                    </div>
                  )}
                  {selectedApplication.expectedArrival && (
                    <div className="col-span-2">
                      <Label>Expected Arrival</Label>
                      <p>{new Date(selectedApplication.expectedArrival).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="documents">
                <div className="space-y-2">
                  {selectedApplication.documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded">
                      <FileText className="h-4 w-4 text-blue-500" />
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

export default VisaManagement;