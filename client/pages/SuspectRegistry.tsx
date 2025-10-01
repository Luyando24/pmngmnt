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
import { Users, Search, Plus, Eye, Edit, AlertTriangle, MapPin, Calendar, Phone } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Api } from "@/lib/api";

interface Suspect {
  id: string;
  firstName: string;
  lastName: string;
  alias?: string;
  nationalId?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  nationality: string;
  address: string;
  phone?: string;
  email?: string;
  photo?: string;
  status: 'wanted' | 'detained' | 'released' | 'cleared';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  charges: string[];
  cases: string[];
  lastSeen?: string;
  notes: string;
}

const SuspectRegistry = () => {
  const { session: user } = useAuth();
  const [suspects, setSuspects] = useState<Suspect[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [selectedSuspect, setSelectedSuspect] = useState<Suspect | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuspects();
  }, []);

  const loadSuspects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/suspects');
      setSuspects(response.data || []);
    } catch (error) {
      console.error('Failed to load suspects:', error);
      // Mock data for development
      setSuspects([
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          alias: 'Johnny',
          nationalId: '123456789',
          dateOfBirth: '1985-03-15',
          gender: 'male',
          nationality: 'Zambian',
          address: '123 Main Street, Lusaka',
          phone: '+260977123456',
          status: 'wanted',
          riskLevel: 'high',
          charges: ['Theft', 'Burglary'],
          cases: ['CASE-2024-001', 'CASE-2024-003'],
          lastSeen: '2024-01-10',
          notes: 'Known to frequent downtown area'
        },
        {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          nationalId: '987654321',
          dateOfBirth: '1990-07-22',
          gender: 'female',
          nationality: 'Zambian',
          address: '456 Oak Avenue, Ndola',
          phone: '+260966987654',
          status: 'detained',
          riskLevel: 'medium',
          charges: ['Traffic Violation'],
          cases: ['CASE-2024-002'],
          notes: 'Cooperative during questioning'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'wanted': return 'bg-red-100 text-red-800';
      case 'detained': return 'bg-orange-100 text-orange-800';
      case 'released': return 'bg-blue-100 text-blue-800';
      case 'cleared': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSuspects = suspects.filter(suspect => {
    const matchesSearch = suspect.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         suspect.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (suspect.alias && suspect.alias.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (suspect.nationalId && suspect.nationalId.includes(searchTerm));
    const matchesStatus = statusFilter === 'all' || suspect.status === statusFilter;
    const matchesRisk = riskFilter === 'all' || suspect.riskLevel === riskFilter;
    return matchesSearch && matchesStatus && matchesRisk;
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
          <h1 className="text-3xl font-bold text-gray-900">Suspect Registry</h1>
          <p className="text-gray-600 mt-2">Manage suspect profiles and information</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Suspect
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Suspect</DialogTitle>
              <DialogDescription>
                Enter the suspect's information
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
                  <Label htmlFor="alias">Alias (Optional)</Label>
                  <Input id="alias" placeholder="Enter alias" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wanted">Wanted</SelectItem>
                      <SelectItem value="detained">Detained</SelectItem>
                      <SelectItem value="released">Released</SelectItem>
                      <SelectItem value="cleared">Cleared</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="riskLevel">Risk Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select risk level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Enter address" />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Enter additional notes" rows={3} />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsCreateDialogOpen(false)}>
                  Add Suspect
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
              placeholder="Search suspects..."
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
            <SelectItem value="wanted">Wanted</SelectItem>
            <SelectItem value="detained">Detained</SelectItem>
            <SelectItem value="released">Released</SelectItem>
            <SelectItem value="cleared">Cleared</SelectItem>
          </SelectContent>
        </Select>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredSuspects.map((suspect) => (
          <Card key={suspect.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={suspect.photo} />
                    <AvatarFallback>
                      {suspect.firstName[0]}{suspect.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {suspect.firstName} {suspect.lastName}
                      {suspect.alias && <span className="text-sm text-gray-500">({suspect.alias})</span>}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      ID: {suspect.nationalId} • {suspect.nationality}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getStatusColor(suspect.status)}>
                    {suspect.status}
                  </Badge>
                  <Badge className={getRiskColor(suspect.riskLevel)}>
                    {suspect.riskLevel} risk
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {suspect.address}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Born: {new Date(suspect.dateOfBirth).toLocaleDateString()}
                </div>
                {suspect.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    {suspect.phone}
                  </div>
                )}
                {suspect.lastSeen && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Eye className="h-4 w-4" />
                    Last seen: {new Date(suspect.lastSeen).toLocaleDateString()}
                  </div>
                )}
              </div>
              
              {suspect.charges.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Charges:</p>
                  <div className="flex flex-wrap gap-1">
                    {suspect.charges.map((charge, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {charge}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <p>Cases: {suspect.cases.join(', ')}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelectedSuspect(suspect)}>
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

      {filteredSuspects.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No suspects found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Suspect Details Dialog */}
      {selectedSuspect && (
        <Dialog open={!!selectedSuspect} onOpenChange={() => setSelectedSuspect(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedSuspect.photo} />
                  <AvatarFallback>
                    {selectedSuspect.firstName[0]}{selectedSuspect.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                {selectedSuspect.firstName} {selectedSuspect.lastName}
                {selectedSuspect.alias && <span className="text-sm text-gray-500">({selectedSuspect.alias})</span>}
              </DialogTitle>
              <DialogDescription>
                Suspect Profile
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="charges">Charges</TabsTrigger>
                <TabsTrigger value="cases">Cases</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>
              <TabsContent value="profile" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedSuspect.status)}>
                      {selectedSuspect.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>Risk Level</Label>
                    <Badge className={getRiskColor(selectedSuspect.riskLevel)}>
                      {selectedSuspect.riskLevel}
                    </Badge>
                  </div>
                  <div>
                    <Label>National ID</Label>
                    <p>{selectedSuspect.nationalId}</p>
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <p>{new Date(selectedSuspect.dateOfBirth).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <p className="capitalize">{selectedSuspect.gender}</p>
                  </div>
                  <div>
                    <Label>Nationality</Label>
                    <p>{selectedSuspect.nationality}</p>
                  </div>
                  <div className="col-span-2">
                    <Label>Address</Label>
                    <p>{selectedSuspect.address}</p>
                  </div>
                  {selectedSuspect.phone && (
                    <div>
                      <Label>Phone</Label>
                      <p>{selectedSuspect.phone}</p>
                    </div>
                  )}
                  {selectedSuspect.email && (
                    <div>
                      <Label>Email</Label>
                      <p>{selectedSuspect.email}</p>
                    </div>
                  )}
                  {selectedSuspect.lastSeen && (
                    <div className="col-span-2">
                      <Label>Last Seen</Label>
                      <p>{new Date(selectedSuspect.lastSeen).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="charges">
                <div className="space-y-2">
                  {selectedSuspect.charges.map((charge, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <span>{charge}</span>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="cases">
                <div className="space-y-2">
                  {selectedSuspect.cases.map((caseId, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 border rounded">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{caseId}</span>
                      <Button variant="ghost" size="sm" className="ml-auto">
                        View Case
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="notes">
                <div className="p-4 bg-gray-50 rounded">
                  <p>{selectedSuspect.notes || 'No notes available'}</p>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default SuspectRegistry;