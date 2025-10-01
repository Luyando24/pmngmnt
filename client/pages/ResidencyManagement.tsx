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
import { Home, Search, Plus, Eye, Edit, Calendar, MapPin, Phone, Mail, Clock, Users, Building, FileText, AlertTriangle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Api } from "@/lib/api";

interface ResidencyApplication {
  id: string;
  applicantName: string;
  nationality: string;
  passportNumber: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: 'male' | 'female' | 'other';
  applicationType: 'temporary' | 'permanent' | 'work_permit' | 'student' | 'investor' | 'family_reunion';
  applicationDate: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'issued' | 'expired';
  priority: 'normal' | 'urgent' | 'emergency';
  duration: number; // in months
  purpose: string;
  sponsorInfo?: {
    name: string;
    relationship: string;
    contact: string;
    address: string;
  };
  employmentInfo?: {
    employer: string;
    position: string;
    salary: number;
    contract: string;
  };
  educationInfo?: {
    institution: string;
    course: string;
    duration: string;
    level: string;
  };
  address: string;
  phone?: string;
  email?: string;
  photo?: string;
  documents: string[];
  fee: number;
  processingOfficer?: string;
  notes: string;
  issueDate?: string;
  expiryDate?: string;
  renewalEligible: boolean;
  dependents: {
    name: string;
    relationship: string;
    age: number;
    nationality: string;
  }[];
  criminalRecord: {
    hasRecord: boolean;
    details?: string;
    verified: boolean;
  };
  medicalClearance: {
    required: boolean;
    completed: boolean;
    expiryDate?: string;
  };
  financialProof: {
    required: boolean;
    amount: number;
    verified: boolean;
  };
  trackingNumber: string;
}

const ResidencyManagement = () => {
  const { session: user } = useAuth();
  const [applications, setApplications] = useState<ResidencyApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<ResidencyApplication | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/residency-applications');
      setApplications(response.data || []);
    } catch (error) {
      console.error('Failed to load residency applications:', error);
      // Mock data for development
      setApplications([
        {
          id: 'RES-2024-001',
          applicantName: 'Sarah Johnson',
          nationality: 'British',
          passportNumber: 'GB123456789',
          dateOfBirth: '1985-03-15',
          placeOfBirth: 'London, UK',
          gender: 'female',
          applicationType: 'work_permit',
          applicationDate: '2024-01-10',
          status: 'approved',
          priority: 'normal',
          duration: 24,
          purpose: 'Employment with mining company',
          employmentInfo: {
            employer: 'Zambia Copper Mines Ltd',
            position: 'Mining Engineer',
            salary: 8000,
            contract: 'Full-time permanent'
          },
          address: '789 Mining Road, Kitwe',
          phone: '+260977654321',
          email: 'sarah.johnson@email.com',
          documents: ['Passport', 'Employment Contract', 'Qualifications', 'Medical Certificate', 'Police Clearance'],
          fee: 500,
          processingOfficer: 'Officer Martinez',
          notes: 'Qualified mining engineer, all documents verified',
          issueDate: '2024-01-25',
          expiryDate: '2026-01-25',
          renewalEligible: true,
          dependents: [
            {
              name: 'James Johnson',
              relationship: 'Spouse',
              age: 32,
              nationality: 'British'
            },
            {
              name: 'Emma Johnson',
              relationship: 'Child',
              age: 8,
              nationality: 'British'
            }
          ],
          criminalRecord: {
            hasRecord: false,
            verified: true
          },
          medicalClearance: {
            required: true,
            completed: true,
            expiryDate: '2025-01-25'
          },
          financialProof: {
            required: true,
            amount: 10000,
            verified: true
          },
          trackingNumber: 'ZM2024RES001'
        },
        {
          id: 'RES-2024-002',
          applicantName: 'Chen Wei',
          nationality: 'Chinese',
          passportNumber: 'CN987654321',
          dateOfBirth: '1990-07-22',
          placeOfBirth: 'Beijing, China',
          gender: 'male',
          applicationType: 'student',
          applicationDate: '2024-01-15',
          status: 'under_review',
          priority: 'normal',
          duration: 48,
          purpose: 'University studies - Engineering degree',
          educationInfo: {
            institution: 'University of Zambia',
            course: 'Mechanical Engineering',
            duration: '4 years',
            level: 'Bachelor\'s Degree'
          },
          address: 'University Campus, Lusaka',
          phone: '+260955123456',
          email: 'chen.wei@student.unza.zm',
          documents: ['Passport', 'Admission Letter', 'Academic Transcripts', 'Financial Proof', 'Medical Certificate'],
          fee: 300,
          processingOfficer: 'Officer Thompson',
          notes: 'Student visa application, awaiting final document verification',
          renewalEligible: true,
          dependents: [],
          criminalRecord: {
            hasRecord: false,
            verified: true
          },
          medicalClearance: {
            required: true,
            completed: true,
            expiryDate: '2025-01-15'
          },
          financialProof: {
            required: true,
            amount: 15000,
            verified: false
          },
          trackingNumber: 'ZM2024RES002'
        },
        {
          id: 'RES-2024-003',
          applicantName: 'Maria Santos',
          nationality: 'Portuguese',
          passportNumber: 'PT456789123',
          dateOfBirth: '1978-11-08',
          placeOfBirth: 'Lisbon, Portugal',
          gender: 'female',
          applicationType: 'investor',
          applicationDate: '2024-01-20',
          status: 'pending',
          priority: 'urgent',
          duration: 60,
          purpose: 'Investment in tourism sector',
          address: '456 Investment Plaza, Lusaka',
          phone: '+260966789012',
          email: 'maria.santos@investments.com',
          documents: ['Passport', 'Investment Plan', 'Bank Statements', 'Business Registration', 'Tax Clearance'],
          fee: 1000,
          processingOfficer: 'Senior Officer Davis',
          notes: 'Large investment application, requires senior review',
          renewalEligible: true,
          dependents: [
            {
              name: 'Carlos Santos',
              relationship: 'Spouse',
              age: 45,
              nationality: 'Portuguese'
            }
          ],
          criminalRecord: {
            hasRecord: false,
            verified: true
          },
          medicalClearance: {
            required: true,
            completed: false
          },
          financialProof: {
            required: true,
            amount: 250000,
            verified: true
          },
          trackingNumber: 'ZM2024RES003'
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
      case 'expired': return 'bg-gray-100 text-gray-800';
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

  const getApplicationTypeColor = (type: string) => {
    switch (type) {
      case 'temporary': return 'bg-blue-100 text-blue-800';
      case 'permanent': return 'bg-green-100 text-green-800';
      case 'work_permit': return 'bg-purple-100 text-purple-800';
      case 'student': return 'bg-indigo-100 text-indigo-800';
      case 'investor': return 'bg-yellow-100 text-yellow-800';
      case 'family_reunion': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.passportNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          <h1 className="text-3xl font-bold text-gray-900">Residency Management</h1>
          <p className="text-gray-600 mt-2">Manage residency permits and applications</p>
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
              <DialogTitle>New Residency Application</DialogTitle>
              <DialogDescription>
                Create a new residency permit application
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="applicantName">Applicant Name</Label>
                  <Input id="applicantName" placeholder="Enter full name" />
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input id="nationality" placeholder="Enter nationality" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="passportNumber">Passport Number</Label>
                  <Input id="passportNumber" placeholder="Enter passport number" />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input id="dateOfBirth" type="date" />
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
                      <SelectItem value="temporary">Temporary Residence</SelectItem>
                      <SelectItem value="permanent">Permanent Residence</SelectItem>
                      <SelectItem value="work_permit">Work Permit</SelectItem>
                      <SelectItem value="student">Student Visa</SelectItem>
                      <SelectItem value="investor">Investor Visa</SelectItem>
                      <SelectItem value="family_reunion">Family Reunion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Duration (months)</Label>
                  <Input id="duration" type="number" placeholder="Enter duration" />
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
                <Label htmlFor="purpose">Purpose of Residence</Label>
                <Textarea id="purpose" placeholder="Describe the purpose" rows={2} />
              </div>
              <div>
                <Label htmlFor="address">Address in Zambia</Label>
                <Textarea id="address" placeholder="Enter address" rows={2} />
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
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="temporary">Temporary</SelectItem>
            <SelectItem value="permanent">Permanent</SelectItem>
            <SelectItem value="work_permit">Work Permit</SelectItem>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="investor">Investor</SelectItem>
            <SelectItem value="family_reunion">Family Reunion</SelectItem>
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
                      <Home className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {application.applicantName}
                      <span className="text-sm text-gray-500">({application.trackingNumber})</span>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {application.id} • {application.nationality} • {application.passportNumber}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={getApplicationTypeColor(application.applicationType)}>
                    {application.applicationType.replace('_', ' ')}
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
                  Duration: {application.duration} months
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  Born: {application.placeOfBirth}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Fee: ${application.fee}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Purpose:</p>
                <p className="text-sm text-gray-600">{application.purpose}</p>
              </div>
              
              {/* Employment/Education/Investment Info */}
              {application.employmentInfo && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Employment:</p>
                  <p className="text-sm text-gray-600">
                    {application.employmentInfo.position} at {application.employmentInfo.employer}
                  </p>
                </div>
              )}
              
              {application.educationInfo && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Education:</p>
                  <p className="text-sm text-gray-600">
                    {application.educationInfo.course} at {application.educationInfo.institution}
                  </p>
                </div>
              )}
              
              {/* Dependents */}
              {application.dependents.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Dependents:</p>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {application.dependents.length} dependent{application.dependents.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Requirements Status */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Requirements:</p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant={application.criminalRecord.verified ? "default" : "outline"} className="text-xs">
                    Criminal Check: {application.criminalRecord.verified ? 'Verified' : 'Pending'}
                  </Badge>
                  <Badge variant={application.medicalClearance.completed ? "default" : "outline"} className="text-xs">
                    Medical: {application.medicalClearance.completed ? 'Completed' : 'Pending'}
                  </Badge>
                  <Badge variant={application.financialProof.verified ? "default" : "outline"} className="text-xs">
                    Financial: {application.financialProof.verified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
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
                  {application.issueDate && (
                    <p>Issued: {new Date(application.issueDate).toLocaleDateString()}</p>
                  )}
                  {application.expiryDate && (
                    <p>Expires: {new Date(application.expiryDate).toLocaleDateString()}</p>
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
                  {application.renewalEligible && application.status === 'issued' && (
                    <Button variant="outline" size="sm">
                      Renew
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
          <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
                <Home className="h-6 w-6" />
                {selectedApplication.applicantName}
                <span className="text-sm text-gray-500">({selectedApplication.trackingNumber})</span>
              </DialogTitle>
              <DialogDescription>
                Residency Application Details
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList>
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="application">Application</TabsTrigger>
                <TabsTrigger value="requirements">Requirements</TabsTrigger>
                <TabsTrigger value="dependents">Dependents</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              <TabsContent value="personal" className="space-y-4">
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
                    <Label>Nationality</Label>
                    <p>{selectedApplication.nationality}</p>
                  </div>
                  <div>
                    <Label>Passport Number</Label>
                    <p>{selectedApplication.passportNumber}</p>
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
                    <Label>Gender</Label>
                    <p className="capitalize">{selectedApplication.gender}</p>
                  </div>
                  <div>
                    <Label>Tracking Number</Label>
                    <p>{selectedApplication.trackingNumber}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Address in Zambia</Label>
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
                </div>
              </TabsContent>
              <TabsContent value="application">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Application Type</Label>
                      <Badge className={getApplicationTypeColor(selectedApplication.applicationType)}>
                        {selectedApplication.applicationType.replace('_', ' ')}
                      </Badge>
                    </div>
                    <div>
                      <Label>Duration</Label>
                      <p>{selectedApplication.duration} months</p>
                    </div>
                    <div>
                      <Label>Application Date</Label>
                      <p>{new Date(selectedApplication.applicationDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label>Fee</Label>
                      <p>${selectedApplication.fee}</p>
                    </div>
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
                  <div>
                    <Label>Purpose</Label>
                    <p>{selectedApplication.purpose}</p>
                  </div>
                  <div>
                    <Label>Processing Officer</Label>
                    <p>{selectedApplication.processingOfficer || 'Not assigned'}</p>
                  </div>
                  
                  {/* Employment Info */}
                  {selectedApplication.employmentInfo && (
                    <div className="p-4 bg-gray-50 rounded">
                      <h4 className="font-medium mb-2">Employment Information</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>Employer:</strong> {selectedApplication.employmentInfo.employer}</div>
                        <div><strong>Position:</strong> {selectedApplication.employmentInfo.position}</div>
                        <div><strong>Salary:</strong> ${selectedApplication.employmentInfo.salary}</div>
                        <div><strong>Contract:</strong> {selectedApplication.employmentInfo.contract}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Education Info */}
                  {selectedApplication.educationInfo && (
                    <div className="p-4 bg-gray-50 rounded">
                      <h4 className="font-medium mb-2">Education Information</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>Institution:</strong> {selectedApplication.educationInfo.institution}</div>
                        <div><strong>Course:</strong> {selectedApplication.educationInfo.course}</div>
                        <div><strong>Duration:</strong> {selectedApplication.educationInfo.duration}</div>
                        <div><strong>Level:</strong> {selectedApplication.educationInfo.level}</div>
                      </div>
                    </div>
                  )}
                  
                  {/* Sponsor Info */}
                  {selectedApplication.sponsorInfo && (
                    <div className="p-4 bg-gray-50 rounded">
                      <h4 className="font-medium mb-2">Sponsor Information</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>Name:</strong> {selectedApplication.sponsorInfo.name}</div>
                        <div><strong>Relationship:</strong> {selectedApplication.sponsorInfo.relationship}</div>
                        <div><strong>Contact:</strong> {selectedApplication.sponsorInfo.contact}</div>
                        <div className="col-span-2"><strong>Address:</strong> {selectedApplication.sponsorInfo.address}</div>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="requirements">
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <div className="p-4 border rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4" />
                        <h4 className="font-medium">Criminal Record Check</h4>
                        <Badge variant={selectedApplication.criminalRecord.verified ? "default" : "outline"}>
                          {selectedApplication.criminalRecord.verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Has Record: {selectedApplication.criminalRecord.hasRecord ? 'Yes' : 'No'}
                      </p>
                      {selectedApplication.criminalRecord.details && (
                        <p className="text-sm text-gray-600 mt-1">
                          Details: {selectedApplication.criminalRecord.details}
                        </p>
                      )}
                    </div>
                    
                    <div className="p-4 border rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4" />
                        <h4 className="font-medium">Medical Clearance</h4>
                        <Badge variant={selectedApplication.medicalClearance.completed ? "default" : "outline"}>
                          {selectedApplication.medicalClearance.completed ? 'Completed' : 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Required: {selectedApplication.medicalClearance.required ? 'Yes' : 'No'}
                      </p>
                      {selectedApplication.medicalClearance.expiryDate && (
                        <p className="text-sm text-gray-600 mt-1">
                          Expires: {new Date(selectedApplication.medicalClearance.expiryDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    
                    <div className="p-4 border rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="h-4 w-4" />
                        <h4 className="font-medium">Financial Proof</h4>
                        <Badge variant={selectedApplication.financialProof.verified ? "default" : "outline"}>
                          {selectedApplication.financialProof.verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Required Amount: ${selectedApplication.financialProof.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="dependents">
                <div className="space-y-2">
                  {selectedApplication.dependents.length > 0 ? (
                    selectedApplication.dependents.map((dependent, index) => (
                      <div key={index} className="p-3 border rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{dependent.name}</p>
                            <p className="text-sm text-gray-600">{dependent.relationship}</p>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <p>Age: {dependent.age}</p>
                            <p>{dependent.nationality}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No dependents listed</p>
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
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ResidencyManagement;