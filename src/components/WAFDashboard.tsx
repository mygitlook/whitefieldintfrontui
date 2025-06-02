
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  Plus,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WAFInstance {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "configuring";
  protectedResources: number;
  rulesCount: number;
  threatsBlocked: number;
  createdDate: string;
}

const WAFDashboard = () => {
  const [instances, setInstances] = useState<WAFInstance[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState("");
  const [newInstanceDescription, setNewInstanceDescription] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadInstances();
  }, []);

  const loadInstances = () => {
    const savedInstances = localStorage.getItem('waf-instances');
    if (savedInstances) {
      setInstances(JSON.parse(savedInstances));
    } else {
      const defaultInstances: WAFInstance[] = Array.from({ length: 41 }, (_, i) => ({
        id: `waf-${i + 1}`,
        name: `waf-instance-${i + 1}`,
        description: `Web Application Firewall ${i + 1}`,
        status: Math.random() > 0.1 ? "active" : "inactive",
        protectedResources: Math.floor(Math.random() * 10) + 1,
        rulesCount: Math.floor(Math.random() * 50) + 10,
        threatsBlocked: Math.floor(Math.random() * 1000) + 100,
        createdDate: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
      }));
      setInstances(defaultInstances);
      saveInstances(defaultInstances);
    }
  };

  const saveInstances = (instanceList: WAFInstance[]) => {
    localStorage.setItem('waf-instances', JSON.stringify(instanceList));
  };

  const createInstance = () => {
    if (!newInstanceName || !newInstanceDescription) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newInstance: WAFInstance = {
      id: `waf-${Date.now()}`,
      name: newInstanceName,
      description: newInstanceDescription,
      status: "configuring",
      protectedResources: 0,
      rulesCount: 15, // Default rule set
      threatsBlocked: 0,
      createdDate: new Date().toISOString().split('T')[0]
    };

    const updatedInstances = [...instances, newInstance];
    setInstances(updatedInstances);
    saveInstances(updatedInstances);

    toast({
      title: "WAF Instance Created",
      description: `${newInstanceName} has been created successfully`,
    });

    setIsCreateDialogOpen(false);
    setNewInstanceName("");
    setNewInstanceDescription("");

    // Simulate instance becoming active after configuration
    setTimeout(() => {
      const finalInstances = updatedInstances.map(i => 
        i.id === newInstance.id ? { ...i, status: "active" as const } : i
      );
      setInstances(finalInstances);
      saveInstances(finalInstances);
    }, 3000);
  };

  const totalInstances = instances.length;
  const activeInstances = instances.filter(i => i.status === "active").length;
  const totalThreatsBlocked = instances.reduce((sum, instance) => sum + instance.threatsBlocked, 0);
  const monthlyCost = totalInstances * 80.00; // £80.00 per instance

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Web Application Firewall</h1>
          <p className="text-gray-600">Protect your web applications from common web exploits and attacks</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2563eb] hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create WAF Instance
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create WAF Instance</DialogTitle>
              <DialogDescription>
                Create a new Web Application Firewall instance
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="instance-name">Instance Name</Label>
                <Input
                  id="instance-name"
                  value={newInstanceName}
                  onChange={(e) => setNewInstanceName(e.target.value)}
                  placeholder="Enter instance name"
                />
              </div>
              <div>
                <Label htmlFor="instance-description">Description</Label>
                <Input
                  id="instance-description"
                  value={newInstanceDescription}
                  onChange={(e) => setNewInstanceDescription(e.target.value)}
                  placeholder="Enter instance description"
                />
              </div>
              <Button onClick={createInstance} className="w-full">
                Create Instance
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Instances</CardTitle>
            <Shield className="h-4 w-4 text-[#2563eb]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInstances}</div>
            <p className="text-xs text-muted-foreground">{activeInstances} active instances</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threats Blocked</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalThreatsBlocked.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{monthlyCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">£80.00 per instance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protection Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((activeInstances / totalInstances) * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Active protection</p>
          </CardContent>
        </Card>
      </div>

      {/* Instances Table */}
      <Card>
        <CardHeader>
          <CardTitle>WAF Instances</CardTitle>
          <CardDescription>Manage your Web Application Firewall instances</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Protected Resources</TableHead>
                <TableHead>Rules</TableHead>
                <TableHead>Threats Blocked</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instances.slice(0, 10).map((instance) => (
                <TableRow key={instance.id}>
                  <TableCell className="font-medium">{instance.name}</TableCell>
                  <TableCell>{instance.description}</TableCell>
                  <TableCell>
                    <Badge variant={instance.status === "active" ? "default" : "secondary"}>
                      {instance.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{instance.protectedResources}</TableCell>
                  <TableCell>{instance.rulesCount}</TableCell>
                  <TableCell>{instance.threatsBlocked.toLocaleString()}</TableCell>
                  <TableCell>£80.00</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      <Settings className="h-3 w-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {instances.length > 10 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Showing 10 of {instances.length} instances
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WAFDashboard;
