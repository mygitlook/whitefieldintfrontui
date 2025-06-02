
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  LifeBuoy, 
  Plus,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SupportPlan {
  id: string;
  planName: string;
  status: "active" | "inactive";
  supportLevel: "basic" | "business" | "enterprise";
  responseTime: string;
  casesThisMonth: number;
  monthlyCost: number;
  activatedDate: string;
}

interface SupportCase {
  id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  status: "open" | "in-progress" | "resolved" | "closed";
  createdDate: string;
  responseTime: string;
}

const PremiumSupportDashboard = () => {
  const [plans, setPlans] = useState<SupportPlan[]>([]);
  const [cases, setCases] = useState<SupportCase[]>([]);
  const [isCreateCaseDialogOpen, setIsCreateCaseDialogOpen] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState("");
  const [newCaseDescription, setNewCaseDescription] = useState("");
  const [newCaseSeverity, setNewCaseSeverity] = useState("medium");
  const { toast } = useToast();

  useEffect(() => {
    loadPlans();
    loadCases();
  }, []);

  const loadPlans = () => {
    const savedPlans = localStorage.getItem('support-plans');
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    } else {
      const defaultPlans: SupportPlan[] = [
        {
          id: "plan-1",
          planName: "Enterprise Support Plan",
          status: "active",
          supportLevel: "enterprise",
          responseTime: "< 1 hour",
          casesThisMonth: 12,
          monthlyCost: 3500.00,
          activatedDate: "2024-01-01"
        },
        {
          id: "plan-2",
          planName: "Business Support Plan",
          status: "active",
          supportLevel: "business",
          responseTime: "< 4 hours",
          casesThisMonth: 8,
          monthlyCost: 3500.00,
          activatedDate: "2024-01-15"
        }
      ];
      setPlans(defaultPlans);
      savePlans(defaultPlans);
    }
  };

  const loadCases = () => {
    const savedCases = localStorage.getItem('support-cases');
    if (savedCases) {
      setCases(JSON.parse(savedCases));
    } else {
      const defaultCases: SupportCase[] = [
        {
          id: "case-1",
          title: "VM Instance Performance Issues",
          severity: "high",
          status: "in-progress",
          createdDate: "2024-01-25",
          responseTime: "45 minutes"
        },
        {
          id: "case-2",
          title: "Storage Bucket Access Configuration",
          severity: "medium",
          status: "resolved",
          createdDate: "2024-01-24",
          responseTime: "2 hours"
        },
        {
          id: "case-3",
          title: "Database Connection Timeout",
          severity: "critical",
          status: "open",
          createdDate: "2024-01-26",
          responseTime: "15 minutes"
        }
      ];
      setCases(defaultCases);
      saveCases(defaultCases);
    }
  };

  const savePlans = (planList: SupportPlan[]) => {
    localStorage.setItem('support-plans', JSON.stringify(planList));
  };

  const saveCases = (caseList: SupportCase[]) => {
    localStorage.setItem('support-cases', JSON.stringify(caseList));
  };

  const createCase = () => {
    if (!newCaseTitle || !newCaseDescription) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newCase: SupportCase = {
      id: `case-${Date.now()}`,
      title: newCaseTitle,
      severity: newCaseSeverity as "low" | "medium" | "high" | "critical",
      status: "open",
      createdDate: new Date().toISOString().split('T')[0],
      responseTime: "Pending"
    };

    const updatedCases = [...cases, newCase];
    setCases(updatedCases);
    saveCases(updatedCases);

    toast({
      title: "Support Case Created",
      description: `Case ${newCase.id} has been created successfully`,
    });

    setIsCreateCaseDialogOpen(false);
    setNewCaseTitle("");
    setNewCaseDescription("");
    setNewCaseSeverity("medium");
  };

  const totalPlans = plans.length;
  const activePlans = plans.filter(p => p.status === "active").length;
  const totalMonthlyCost = plans.reduce((sum, plan) => sum + plan.monthlyCost, 0);
  const openCases = cases.filter(c => c.status === "open" || c.status === "in-progress").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Premium Support</h1>
          <p className="text-gray-600">24/7 expert support with guaranteed response times</p>
        </div>
        <Dialog open={isCreateCaseDialogOpen} onOpenChange={setIsCreateCaseDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2563eb] hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Support Case
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Support Case</DialogTitle>
              <DialogDescription>
                Submit a new support case to our expert team
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="case-title">Case Title</Label>
                <Input
                  id="case-title"
                  value={newCaseTitle}
                  onChange={(e) => setNewCaseTitle(e.target.value)}
                  placeholder="Brief description of the issue"
                />
              </div>
              <div>
                <Label htmlFor="case-description">Description</Label>
                <Textarea
                  id="case-description"
                  value={newCaseDescription}
                  onChange={(e) => setNewCaseDescription(e.target.value)}
                  placeholder="Detailed description of the problem"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="case-severity">Severity</Label>
                <Select value={newCaseSeverity} onValueChange={setNewCaseSeverity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - General questions</SelectItem>
                    <SelectItem value="medium">Medium - System issue affecting functionality</SelectItem>
                    <SelectItem value="high">High - Production system degraded</SelectItem>
                    <SelectItem value="critical">Critical - Production system down</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={createCase} className="w-full">
                Submit Case
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Support Plans</CardTitle>
            <LifeBuoy className="h-4 w-4 text-[#2563eb]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlans}</div>
            <p className="text-xs text-muted-foreground">{activePlans} active plans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Cases</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openCases}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{totalMonthlyCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">£3,500 per plan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{"< 1hr"}</div>
            <p className="text-xs text-muted-foreground">Average response time</p>
          </CardContent>
        </Card>
      </div>

      {/* Support Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Support Plans</CardTitle>
          <CardDescription>Your active premium support subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Plan Name</TableHead>
                <TableHead>Support Level</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Cases This Month</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Activated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.planName}</TableCell>
                  <TableCell className="capitalize">{plan.supportLevel}</TableCell>
                  <TableCell>{plan.responseTime}</TableCell>
                  <TableCell>{plan.casesThisMonth}</TableCell>
                  <TableCell>
                    <Badge variant={plan.status === "active" ? "default" : "secondary"}>
                      {plan.status}
                    </Badge>
                  </TableCell>
                  <TableCell>£{plan.monthlyCost.toLocaleString()}</TableCell>
                  <TableCell>{plan.activatedDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Support Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Support Cases</CardTitle>
          <CardDescription>Track your support requests and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((supportCase) => (
                <TableRow key={supportCase.id}>
                  <TableCell className="font-medium">{supportCase.id}</TableCell>
                  <TableCell>{supportCase.title}</TableCell>
                  <TableCell>
                    <Badge variant={
                      supportCase.severity === "critical" ? "destructive" :
                      supportCase.severity === "high" ? "destructive" :
                      supportCase.severity === "medium" ? "default" : "secondary"
                    }>
                      {supportCase.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      supportCase.status === "resolved" ? "default" :
                      supportCase.status === "closed" ? "secondary" : "outline"
                    }>
                      {supportCase.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{supportCase.createdDate}</TableCell>
                  <TableCell>{supportCase.responseTime}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumSupportDashboard;
