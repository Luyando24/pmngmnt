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
import { FileText, Search, Plus, Eye, Edit, Calendar, MapPin, Phone, Mail, Building, Clock } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Api } from "@/lib/api";

interface PermitApplication {
  id: string;
  applicantName: string;
  companyName?: string;
  permitType: 'work' | 'residence' | 'business' | 'investment' | 'special' | 'temporary';
  category: string;
  purpose: string;
  duration: number; // in months
  applicationDate: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'issued' | 'expired';
  priority: 'normal' | 'urgent' | 'emergency';
  documents: string[];
  fee: number;
  processingOfficer?: string;
  notes: string;
  photo?: string;
  email?: string;
  phone?: string;
  address: string;
  nationality: string;
  passportNumber?: string;
  startDate?: string;
  expiryDate?: string;
  renewalEligible: boolean;
}

const PermitManagement = () => {
  const { session: user } = useAuth();
  const [applications, setApplications] = useState<PermitApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<PermitApplication | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/permit-applications');
      setApplications(response.data || []);
    } catch (error) {
      console.error('Failed to load permit applications:', error);
      // Mock data for development
      setApplications([
        {
          id: 'PA-2024-001',
          applicantName: 'Sarah Johnson',
          companyName: 'TechCorp Solutions',
          permitType: 'work',
          category: 'Skilled Professional',
          purpose: 'Software Development Position',
          duration: 24,
          applicationDate: '2024-01-15',
          status: 'approved',
          priority: 'normal',
          documents: ['Passport Copy', 'Employment Contract', 'Qualifications', 'Medical Certificate'],
          fee: 500,
          processingOfficer: 'Officer Martinez',
          notes: 'All requirements met, approved for 2 years',
          email: 'sarah.johnson@email.com',
          phone: '+1234567890',
          address: '123 Tech Street, Lusaka',
          nationality: 'Canadian',
          passportNumber: 'CA123456789',
          startDate: '2024-02-01',
          expiryDate: '2026-01-31',
          renewalEligible: true
        },
        {
          id: 'PA-2024-002',
          applicantName: 'Ahmed Hassan',
          companyName: 'Global Investments Ltd',
          permitType: 'investment',
          category: 'Foreign Investor',
          purpose: 'Mining Investment Project',
          duration: 60,
          applicationDate: '2024-01-18',
          status: 'under_review',
          priority: 'urgent',
          documents: ['Passport Copy', 'Investment Plan', 'Financial Statements', 'Company Registration'],
          fee: 2000,
          processingOfficer: 'Officer Thompson',
          notes: 'Large investment project under security review',
          email: 'ahmed.hassan@globalinv.com',
          phone: '+971123456789',
          address: '456 Investment Ave, Lusaka',
          nationality: 'UAE',
          passportNumber: 'AE987654321',
          renewalEligible: true
        },
        {
          id: 'PA-2024-003',
          applicantName: 'Maria Santos',
          permitType: 'residence',
          category: 'Spouse of Citizen',
          purpose: 'Family Reunification',
          duration: 36,
          applicationDate: '2024-01-20',
          status: 'pending',
          priority: 'normal',
          documents: ['Passport Copy', 'Marriage Certificate', 'Spouse ID', 'Medical Certificate'],
          fee: 300,
          notes: 'Awaiting document verification',
          email: 'maria.santos@email.com',
          phone: '+55123456789',
          address: '789 Family Road, Ndola',
          nationality: 'Brazilian',
          passportNumber: 'BR456789123',
          renewalEligible: true
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

  const getPermitTypeColor = (type: string) => {
    switch (type) {
      case 'work': return 'bg-blue-100 text-blue-800';
      case 'residence': return 'bg-green-100 text-green-800';
      case 'business': return 'bg-purple-100 text-purple-800';
      case 'investment': return 'bg-indigo-100 text-indigo-800';
      case 'special': return 'bg-yellow-100 text-yellow-800';
      case 'temporary': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (app.companyName && app.companyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesType = typeFilter === 'all' || app.permitType === typeFilter;
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
          <h1 className="text-3xl font-bold text-gray-900">Permit Management</h1>
          <p className="text-gray-600 mt-2">Process and manage permit applications</p>
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
              <DialogTitle>New Permit Application</DialogTitle>
              <DialogDescription>
                Create a new permit application
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="applicantName">Applicant Name</Label>
                  <Input id="applicantName" placeholder="Enter full name" />
                </div>
                <div>
                  <Label htmlFor="companyName">Company Name (Optional)</Label>
                  <Input id="companyName" placeholder="Enter company name" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="permitType">Permit Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select permit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="work">Work Permit</SelectItem>
                      <SelectItem value="residence">Residence Permit</SelectItem>
                      <SelectItem value="business">Business Permit</SelectItem>
                      <SelectItem value="investment">Investment Permit</SelectItem>
                      <SelectItem value="special">Special Permit</SelectItem>
                      <SelectItem value="temporary">Temporary Permit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" placeholder="Enter category" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duration (months)</Label>
                  <Input id="duration" type="number" placeholder="Enter duration" />
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input id="nationality" placeholder="Enter nationality" />
                </div>
              </div>
              <div>
                <Label htmlFor="purpose">Purpose</Label>
                <Textarea id="purpose" placeholder="Enter purpose" rows={3} />
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
            <SelectItem value="work">Work Permit</SelectItem>
            <SelectItem value="residence">Residence Permit</SelectItem>
            <SelectItem value="business">Business Permit</SelectItem>
            <SelectItem value="investment">Investment Permit</SelectItem>
            <SelectItem value="special">Special Permit</SelectItem>
            <SelectItem value="temporary">Temporary Permit</SelectItem>
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
                      <FileText className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {application.applicantName}
                      <span className="text-sm text-gray-500">({application.id})</span>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {application.companyName && `${application.companyName} • `}
                      {application.nationality}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={getPermitTypeColor(application.permitType)}>
                    {application.permitType} permit
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
                  <Building className="h-4 w-4" />
                  Category: {application.category}
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
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
                <FileText className="h-6 w-6" />
                {selectedApplication.applicantName}
                <span className="text-sm text-gray-500">({selectedApplication.id})</span>
              </DialogTitle>
              <DialogDescription>
                Permit Application Details
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
                    <Label>Permit Type</Label>
                    <Badge className={getPermitTypeColor(selectedApplication.permitType)}>
                      {selectedApplication.permitType} permit
                    </Badge>
                  </div>
                  <div>
                    <Label>Category</Label>
                    <p>{selectedApplication.category}</p>
                  </div>
                  <div>
                    <Label>Duration</Label>
                    <p>{selectedApplication.duration} months</p>
                  </div>
                  <div>
                    <Label>Fee</Label>
                    <p>${selectedApplication.fee}</p>
                  </div>
                  <div>
                    <Label>Nationality</Label>
                    <p>{selectedApplication.nationality}</p>
                  </div>
                  {selectedApplication.passportNumber && (
                    <div>
                      <Label>Passport Number</Label>
                      <p>{selectedApplication.passportNumber}</p>
                    </div>
                  )}
                  {selectedApplication.companyName && (
                    <div className="col-span-2">
                      <Label>Company</Label>
                      <p>{selectedApplication.companyName}</p>
                    </div>
                  )}
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
                  {selectedApplication.startDate && (
                    <div>
                      <Label>Start Date</Label>
                      <p>{new Date(selectedApplication.startDate).toLocaleDateString()}</p>
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
                  <div>
                    <Label>Renewal Eligible</Label>
                    <p>{selectedApplication.renewalEligible ? 'Yes' : 'No'}</p>
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
                    {selectedApplication.renewalEligible && (
                      <Button variant="outline">
                        Process Renewal
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

export default PermitManagement;