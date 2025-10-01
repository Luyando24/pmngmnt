import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, AlertTriangle, Users, Calendar, Brain, Target, Activity, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';

interface PatientRisk {
  id: string;
  name: string;
  age: number;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  conditions: string[];
  lastVisit: string;
  predictedRisks: {
    condition: string;
    probability: number;
    timeframe: string;
  }[];
  recommendations: string[];
}

interface TestRecommendation {
  patientId: string;
  patientName: string;
  recommendedTests: {
    test: string;
    priority: 'routine' | 'urgent' | 'critical';
    reason: string;
    dueDate: string;
  }[];
}

interface ResourceAllocation {
  date: string;
  staffOptimization: {
    department: string;
    currentStaff: number;
    recommendedStaff: number;
    efficiency: number;
  }[];
  equipmentUsage: {
    equipment: string;
    currentUsage: number;
    optimalUsage: number;
    availability: string[];
  }[];
}

interface SmartAlert {
  id: string;
  type: 'patient_risk' | 'resource_shortage' | 'appointment_conflict' | 'test_overdue';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  timestamp: Date;
  patientId?: string;
  actionRequired: boolean;
}

interface TrendData {
  period: string;
  patientOutcomes: {
    condition: string;
    successRate: number;
    trend: 'improving' | 'stable' | 'declining';
  }[];
  missedFollowups: {
    department: string;
    count: number;
    percentage: number;
  }[];
  diseasePatterns: {
    disease: string;
    cases: number;
    seasonality: string;
    riskFactors: string[];
  }[];
}

const mockPatientRisks: PatientRisk[] = [
  {
    id: '1',
    name: 'John Mwanza',
    age: 45,
    riskScore: 85,
    riskLevel: 'high',
    conditions: ['Hypertension', 'Diabetes Type 2'],
    lastVisit: '2024-01-10',
    predictedRisks: [
      { condition: 'Cardiovascular Event', probability: 75, timeframe: '6 months' },
      { condition: 'Diabetic Complications', probability: 60, timeframe: '1 year' }
    ],
    recommendations: [
      'Schedule cardiology consultation within 2 weeks',
      'Increase monitoring frequency to monthly',
      'Review medication adherence'
    ]
  },
  {
    id: '2',
    name: 'Mary Phiri',
    age: 32,
    riskScore: 45,
    riskLevel: 'medium',
    conditions: ['Anemia', 'Pregnancy'],
    lastVisit: '2024-01-15',
    predictedRisks: [
      { condition: 'Preterm Labor', probability: 35, timeframe: '3 months' },
      { condition: 'Iron Deficiency Complications', probability: 50, timeframe: '2 months' }
    ],
    recommendations: [
      'Iron supplementation monitoring',
      'Weekly antenatal checkups',
      'Nutritional counseling'
    ]
  }
];

const mockTestRecommendations: TestRecommendation[] = [
  {
    patientId: '1',
    patientName: 'John Mwanza',
    recommendedTests: [
      { test: 'HbA1c', priority: 'urgent', reason: 'Diabetes monitoring overdue', dueDate: '2024-01-25' },
      { test: 'Lipid Panel', priority: 'routine', reason: 'Cardiovascular risk assessment', dueDate: '2024-02-01' },
      { test: 'ECG', priority: 'urgent', reason: 'High cardiovascular risk detected', dueDate: '2024-01-23' }
    ]
  },
  {
    patientId: '2',
    patientName: 'Mary Phiri',
    recommendedTests: [
      { test: 'Complete Blood Count', priority: 'routine', reason: 'Anemia monitoring', dueDate: '2024-01-28' },
      { test: 'Iron Studies', priority: 'urgent', reason: 'Iron deficiency assessment', dueDate: '2024-01-24' }
    ]
  }
];

const mockSmartAlerts: SmartAlert[] = [
  {
    id: '1',
    type: 'patient_risk',
    priority: 'critical',
    title: 'High-Risk Patient Alert',
    description: 'John Mwanza shows 85% risk score with overdue cardiovascular assessment',
    timestamp: new Date(),
    patientId: '1',
    actionRequired: true
  },
  {
    id: '2',
    type: 'resource_shortage',
    priority: 'high',
    title: 'Staff Shortage Alert',
    description: 'Cardiology department understaffed by 30% for next week',
    timestamp: new Date(),
    actionRequired: true
  },
  {
    id: '3',
    type: 'test_overdue',
    priority: 'medium',
    title: 'Overdue Tests',
    description: '15 patients have overdue HbA1c tests',
    timestamp: new Date(),
    actionRequired: true
  }
];

export default function AIAnalytics() {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('risk-analysis');
  const [selectedPatient, setSelectedPatient] = useState<PatientRisk | null>(null);
  const [alerts, setAlerts] = useState<SmartAlert[]>(mockSmartAlerts);
  const [timeRange, setTimeRange] = useState('7d');

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'high': return <AlertCircle className="h-4 w-4 text-orange-600" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'low': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  if (!session || session.role !== 'clinic_admin') {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Brain className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">AI Analytics & Predictive Features</h2>
            <p className="text-muted-foreground mb-4">
              Access restricted to clinic administrators. Please contact your administrator for access.
            </p>
            <Button asChild>
              <Link to="/clinic">Back to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">AI Analytics & Predictive Features</h1>
        <p className="text-muted-foreground">
          Advanced AI-powered insights for patient risk analysis, resource optimization, and predictive healthcare.
        </p>
      </div>

      {/* Smart Alerts Banner */}
      {alerts.length > 0 && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Smart Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-2 bg-white rounded border">
                  <div className="flex items-center gap-2">
                    {getPriorityIcon(alert.priority)}
                    <div>
                      <p className="font-medium text-sm">{alert.title}</p>
                      <p className="text-xs text-muted-foreground">{alert.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => dismissAlert(alert.id)}>
                      Dismiss
                    </Button>
                    {alert.actionRequired && (
                      <Button size="sm">Take Action</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="risk-analysis">Risk Analysis</TabsTrigger>
          <TabsTrigger value="test-recommendations">Test Recommendations</TabsTrigger>
          <TabsTrigger value="resource-allocation">Resource Allocation</TabsTrigger>
          <TabsTrigger value="smart-alerts">Smart Alerts</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="risk-analysis" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockPatientRisks.map((patient) => (
              <Card key={patient.id} className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedPatient(patient)}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{patient.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">Age: {patient.age}</p>
                    </div>
                    <Badge className={getRiskColor(patient.riskLevel)}>
                      {patient.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Risk Score</span>
                        <span className="text-sm font-bold">{patient.riskScore}%</span>
                      </div>
                      <Progress value={patient.riskScore} className="h-2" />
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Conditions:</p>
                      <div className="flex flex-wrap gap-1">
                        {patient.conditions.map((condition, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {condition}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {selectedPatient && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Risk Analysis - {selectedPatient.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h4 className="font-medium mb-3">Predicted Risks</h4>
                    <div className="space-y-3">
                      {selectedPatient.predictedRisks.map((risk, index) => (
                        <div key={index} className="p-3 border rounded">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-sm">{risk.condition}</span>
                            <Badge variant="outline">{risk.timeframe}</Badge>
                          </div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-muted-foreground">Probability</span>
                            <span className="text-xs font-medium">{risk.probability}%</span>
                          </div>
                          <Progress value={risk.probability} className="h-1" />
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">AI Recommendations</h4>
                    <div className="space-y-2">
                      {selectedPatient.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                          <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                          <span className="text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4" onClick={() => setSelectedPatient(null)}>
                  Close Analysis
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="test-recommendations" className="space-y-4">
          <div className="space-y-4">
            {mockTestRecommendations.map((recommendation) => (
              <Card key={recommendation.patientId}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    {recommendation.patientName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendation.recommendedTests.map((test, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded">
                        <div className="flex items-center gap-3">
                          {getPriorityIcon(test.priority)}
                          <div>
                            <p className="font-medium">{test.test}</p>
                            <p className="text-sm text-muted-foreground">{test.reason}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={test.priority === 'urgent' ? 'destructive' : 
                                        test.priority === 'critical' ? 'destructive' : 'secondary'}>
                            {test.priority}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            Due: {new Date(test.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule All Tests
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="resource-allocation">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Staff Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Cardiology</span>
                      <Badge variant="destructive">Understaffed</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Current: 3 staff • Recommended: 5 staff
                    </div>
                    <Progress value={60} className="h-2" />
                    <p className="text-xs mt-1">Efficiency: 60%</p>
                  </div>
                  
                  <div className="p-3 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">General Medicine</span>
                      <Badge variant="default">Optimal</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Current: 8 staff • Recommended: 8 staff
                    </div>
                    <Progress value={95} className="h-2" />
                    <p className="text-xs mt-1">Efficiency: 95%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Equipment Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">ECG Machine</span>
                      <Badge variant="secondary">85% Usage</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Available slots: 9:00 AM, 2:00 PM, 4:30 PM
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  
                  <div className="p-3 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">X-Ray Machine</span>
                      <Badge variant="outline">45% Usage</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Available slots: All day
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="smart-alerts">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getPriorityIcon(alert.priority)}
                      {alert.title}
                    </CardTitle>
                    <Badge variant={alert.priority === 'critical' ? 'destructive' : 
                                  alert.priority === 'high' ? 'destructive' : 'secondary'}>
                      {alert.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{alert.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {alert.timestamp.toLocaleString()}
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => dismissAlert(alert.id)}>
                        Dismiss
                      </Button>
                      {alert.actionRequired && (
                        <Button size="sm">Take Action</Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Patient Outcomes Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-3 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Diabetes Management</span>
                      <Badge variant="default">Improving</Badge>
                    </div>
                    <div className="text-2xl font-bold text-green-600">87%</div>
                    <p className="text-xs text-muted-foreground">Success rate (+5% from last month)</p>
                  </div>
                  
                  <div className="p-3 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Hypertension Control</span>
                      <Badge variant="secondary">Stable</Badge>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">72%</div>
                    <p className="text-xs text-muted-foreground">Success rate (no change)</p>
                  </div>
                  
                  <div className="p-3 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Mental Health</span>
                      <Badge variant="destructive">Declining</Badge>
                    </div>
                    <div className="text-2xl font-bold text-red-600">65%</div>
                    <p className="text-xs text-muted-foreground">Success rate (-3% from last month)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Disease Pattern Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 border rounded">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Respiratory Infections</span>
                      <span className="text-sm text-muted-foreground">+25% this month</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Seasonal pattern detected • Peak: June-August
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs">Cold weather</Badge>
                      <Badge variant="outline" className="text-xs">Air pollution</Badge>
                      <Badge variant="outline" className="text-xs">Crowded spaces</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}