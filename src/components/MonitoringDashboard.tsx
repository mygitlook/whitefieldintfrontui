
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
  Eye, 
  Plus,
  DollarSign,
  Activity,
  AlertTriangle,
  Settings,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MonitoringInstance {
  id: string;
  name: string;
  resourceType: "ec2" | "s3" | "database" | "application" | "network";
  resourceName: string;
  status: "active" | "inactive" | "alerting";
  metricsCount: number;
  alertsCount: number;
  logsGB: number;
  createdDate: string;
}

const MonitoringDashboard = () => {
  const [instances, setInstances] = useState<MonitoringInstance[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newInstanceName, setNewInstanceName] = useState("");
  const [selectedResourceType, setSelectedResourceType] = useState("");
  const [selectedResource, setSelectedResource] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadInstances();
  }, []);

  const loadInstances = () => {
    const savedInstances = localStorage.getItem('monitoring-instances');
    if (savedInstances) {
      setInstances(JSON.parse(savedInstances));
    } else {
      const defaultInstances: MonitoringInstance[] = Array.from({ length: 39 }, (_, i) => ({
        id: `monitor-${i + 1}`,
        name: `monitoring-${i + 1}`,
        resourceType: ["ec2", "s3", "database", "application", "network"][Math.floor(Math.random() * 5)] as any,
        resourceName: `resource-${i + 1}`,
        status: Math.random() > 0.1 ? "active" : Math.random() > 0.5 ? "alerting" : "inactive",
        metricsCount: Math.floor(Math.random() * 50) + 10,
        alertsCount: Math.floor(Math.random() * 5),
        logsGB: Math.random() * 10 + 1,
        createdDate: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`
      }));
      setInstances(defaultInstances);
      saveInstances(defaultInstances);
    }
  };

  const saveInstances = (instanceList: MonitoringInstance[]) => {
    localStorage.setItem('monitoring-instances', JSON.stringify(instanceList));
  };

  const createInstance = () => {
    if (!newInstanceName || !selectedResourceType || !selectedResource) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newInstance: MonitoringInstance = {
      id: `monitor-${Date.now()}`,
      name: newInstanceName,
      resourceType: selectedResourceType as any,
      resourceName: selectedResource,
      status: "active",
      metricsCount: 15,
      alertsCount: 0,
      logsGB: 0,
      createdDate: new Date().toISOString().split('T')[0]
    };

    const updatedInstances = [...instances, newInstance];
    setInstances(updatedInstances);
    saveInstances(updatedInstances);

    toast({
      title: "Monitoring Instance Created",
      description: `${newInstanceName} monitoring has been activated`,
    });

    setIsCreateDialogOpen(false);
    setNewInstanceName("");
    setSelectedResourceType("");
    setSelectedResource("");
  };

  const totalInstances = instances.length;
  const activeInstances = instances.filter(i => i.status === "active").length;
  const alertingInstances = instances.filter(i => i.status === "alerting").length;
  const totalAlerts = instances.reduce((sum, instance) => sum + instance.alertsCount, 0);
  const monthlyCost = totalInstances * 40.20; // £40.20 per instance

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Monitoring & Logging</h1>
          <p className="text-gray-600">Monitor your infrastructure and applications with real-time insights</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2563eb] hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Monitoring
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Monitoring Instance</DialogTitle>
              <DialogDescription>
                Set up monitoring for your resources
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="instance-name">Monitoring Name</Label>
                <Input
                  id="instance-name"
                  value={newInstanceName}
                  onChange={(e) => setNewInstanceName(e.target.value)}
                  placeholder="Enter monitoring instance name"
                />
              </div>
              <div>
                <Label htmlFor="resource-type">Resource Type</Label>
                <Select value={selectedResourceType} onValueChange={setSelectedResourceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select resource type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ec2">EC2 Instance</SelectItem>
                    <SelectItem value="s3">S3 Bucket</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="application">Application</SelectItem>
                    <SelectItem value="network">Network</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="resource-name">Resource Name</Label>
                <Input
                  id="resource-name"
                  value={selectedResource}
                  onChange={(e) => setSelectedResource(e.target.value)}
                  placeholder="Enter resource name to monitor"
                />
              </div>
              <Button onClick={createInstance} className="w-full">
                Enable Monitoring
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitoring Instances</CardTitle>
            <Eye className="h-4 w-4 text-[#2563eb]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInstances}</div>
            <p className="text-xs text-muted-foreground">{activeInstances} active, {alertingInstances} alerting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAlerts}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{monthlyCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">£40.20 per instance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((activeInstances / totalInstances) * 100).toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground">Overall system health</p>
          </CardContent>
        </Card>
      </div>

      {/* Monitoring Instances Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monitoring Instances</CardTitle>
          <CardDescription>Manage your monitoring and logging instances</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Resource Type</TableHead>
                <TableHead>Resource</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Metrics</TableHead>
                <TableHead>Alerts</TableHead>
                <TableHead>Logs (GB)</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instances.slice(0, 10).map((instance) => (
                <TableRow key={instance.id}>
                  <TableCell className="font-medium">{instance.name}</TableCell>
                  <TableCell className="capitalize">{instance.resourceType}</TableCell>
                  <TableCell>{instance.resourceName}</TableCell>
                  <TableCell>
                    <Badge variant={
                      instance.status === "active" ? "default" :
                      instance.status === "alerting" ? "destructive" : "secondary"
                    }>
                      {instance.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{instance.metricsCount}</TableCell>
                  <TableCell>
                    {instance.alertsCount > 0 ? (
                      <Badge variant="destructive">{instance.alertsCount}</Badge>
                    ) : (
                      <span className="text-muted-foreground">0</span>
                    )}
                  </TableCell>
                  <TableCell>{instance.logsGB.toFixed(2)} GB</TableCell>
                  <TableCell>£40.20</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <BarChart3 className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {instances.length > 10 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Showing 10 of {instances.length} monitoring instances
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MonitoringDashboard;
