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
import { FileText, Search, Plus, Eye, Edit, AlertTriangle, CheckCircle, Clock, Users } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Api } from "@/lib/api";

interface Case {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  status: 'open' | 'investigating' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedOfficer: string;
  reportedDate: string;
  location: string;
  suspects: string[];
  evidence: string[];
}

const CaseManagement = () => {
  const { session: user } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/cases');
      setCases(response.data || []);
    } catch (error) {
      console.error('Failed to load cases:', error);
      // Mock data for development
      setCases([
        {
          id: '1',
          caseNumber: 'CASE-2024-001',
          title: 'Theft Investigation',
          description: 'Reported theft at downtown market',
          status: 'investigating',
          priority: 'medium',
          assignedOfficer: 'Officer Smith',
          reportedDate: '2024-01-15',
          location: 'Downtown Market, Main Street',
          suspects: ['John Doe'],
          evidence: ['CCTV Footage', 'Witness Statement']
        },
        {
          id: '2',
          caseNumber: 'CASE-2024-002',
          title: 'Traffic Violation',
          description: 'Speeding violation on highway',
          status: 'closed',
          priority: 'low',
          assignedOfficer: 'Officer Johnson',
          reportedDate: '2024-01-14',
          location: 'Highway 101, Mile 45',
          suspects: ['Jane Smith'],
          evidence: ['Speed Camera Photo', 'Citation']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || caseItem.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
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
          <h1 className="text-3xl font-bold text-gray-900">Case Management</h1>
          <p className="text-gray-600 mt-2">Manage and track police cases</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Case</DialogTitle>
              <DialogDescription>
                Enter the details for the new case
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Case Title</Label>
                  <Input id="title" placeholder="Enter case title" />
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter incident location" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter case description" rows={4} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  Create Case
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
              placeholder="Search cases..."
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
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="investigating">Investigating</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredCases.map((caseItem) => (
          <Card key={caseItem.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {caseItem.title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {caseItem.caseNumber} • {caseItem.location}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(caseItem.status)}>
                    {caseItem.status}
                  </Badge>
                  <Badge className={getPriorityColor(caseItem.priority)}>
                    {caseItem.priority}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{caseItem.description}</p>
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <p>Assigned to: {caseItem.assignedOfficer}</p>
                  <p>Reported: {new Date(caseItem.reportedDate).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedCase(caseItem)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCases.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No cases found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Case Details Dialog */}
      {selectedCase && (
        <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {selectedCase.title}
              </DialogTitle>
              <DialogDescription>
                Case #{selectedCase.caseNumber}
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
                <TabsTrigger value="suspects">Suspects</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedCase.status)}>
                      {selectedCase.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Badge className={getPriorityColor(selectedCase.priority)}>
                      {selectedCase.priority}
                    </Badge>
                  </div>
                  <div>
                    <Label>Assigned Officer</Label>
                    <p>{selectedCase.assignedOfficer}</p>
                  </div>
                  <div>
                    <Label>Reported Date</Label>
                    <p>{new Date(selectedCase.reportedDate).toLocaleDateString()}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Location</Label>
                    <p>{selectedCase.location}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Description</Label>
                    <p>{selectedCase.description}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="evidence">
                <div className="space-y-2">
                  {selectedCase.evidence.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <FileText className="h-4 w-4" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="suspects">
                <div className="space-y-2">
                  {selectedCase.suspects.map((suspect, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <Users className="h-4 w-4" />
                      <span>{suspect}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="timeline">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Case Reported</p>
                      <p className="text-sm text-gray-500">{new Date(selectedCase.reportedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div>
                      <p className="font-medium">Investigation Started</p>
                      <p className="text-sm text-gray-500">Assigned to {selectedCase.assignedOfficer}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CaseManagement;