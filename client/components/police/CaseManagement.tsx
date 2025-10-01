import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Eye, Edit, FileText, Calendar, User, MapPin } from 'lucide-react';
import { Api } from '@/lib/api';
import type { CreateCaseRequest, ListCasesResponse } from '@shared/api';

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
  residentId?: string;
  stationId: string;
}

const CaseManagement: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [newCase, setNewCase] = useState<Partial<CreateCaseRequest>>({
    title: '',
    description: '',
    priority: 'medium',
    location: '',
    residentId: '',
  });

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      setLoading(true);
      const response: ListCasesResponse = await Api.listCases();
      setCases(response.cases || []);
    } catch (error) {
      console.error('Failed to load cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCase = async () => {
    if (!newCase.title || !newCase.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await Api.createCase(newCase as CreateCaseRequest);
      setIsCreateDialogOpen(false);
      setNewCase({
        title: '',
        description: '',
        priority: 'medium',
        location: '',
        residentId: '',
      });
      await loadCases();
    } catch (error) {
      console.error('Failed to create case:', error);
      alert('Failed to create case. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCases = cases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || caseItem.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Case Management</h1>
          <p className="text-muted-foreground">Manage and track police cases</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Case
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Case</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new police case.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Case Title *</Label>
                <Input
                  id="title"
                  value={newCase.title || ''}
                  onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                  placeholder="Enter case title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={newCase.description || ''}
                  onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                  placeholder="Enter case description"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newCase.priority || 'medium'}
                    onValueChange={(value) => setNewCase({ ...newCase, priority: value as any })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newCase.location || ''}
                    onChange={(e) => setNewCase({ ...newCase, location: e.target.value })}
                    placeholder="Enter location"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="residentId">Related Resident ID (Optional)</Label>
                <Input
                  id="residentId"
                  value={newCase.residentId || ''}
                  onChange={(e) => setNewCase({ ...newCase, residentId: e.target.value })}
                  placeholder="Enter resident ID if applicable"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateCase} disabled={loading}>
                {loading ? 'Creating...' : 'Create Case'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search cases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="investigating">Investigating</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cases ({filteredCases.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading cases...</div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No cases found matching your criteria.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Case #</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned Officer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCases.map((caseItem) => (
                  <TableRow key={caseItem.id}>
                    <TableCell className="font-medium">{caseItem.caseNumber}</TableCell>
                    <TableCell>{caseItem.title}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeColor(caseItem.status)}>
                        {caseItem.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityBadgeColor(caseItem.priority)}>
                        {caseItem.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>{caseItem.assignedOfficer}</TableCell>
                    <TableCell>{new Date(caseItem.reportedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCase(caseItem);
                            setIsViewDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Case Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Case Details</DialogTitle>
          </DialogHeader>
          {selectedCase && (
            <Tabs defaultValue="details" className="w-full">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="evidence">Evidence</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Case Number</Label>
                    <p className="text-sm text-muted-foreground">{selectedCase.caseNumber}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge className={getStatusBadgeColor(selectedCase.status)}>
                      {selectedCase.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Priority</Label>
                    <Badge className={getPriorityBadgeColor(selectedCase.priority)}>
                      {selectedCase.priority}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Assigned Officer</Label>
                    <p className="text-sm text-muted-foreground">{selectedCase.assignedOfficer}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="text-sm text-muted-foreground">{selectedCase.location}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Reported Date</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedCase.reportedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-muted-foreground mt-1">{selectedCase.description}</p>
                </div>
              </TabsContent>
              <TabsContent value="timeline">
                <div className="text-center py-8 text-muted-foreground">
                  Timeline feature coming soon...
                </div>
              </TabsContent>
              <TabsContent value="evidence">
                <div className="text-center py-8 text-muted-foreground">
                  Evidence management feature coming soon...
                </div>
              </TabsContent>
              <TabsContent value="notes">
                <div className="text-center py-8 text-muted-foreground">
                  Notes feature coming soon...
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaseManagement;