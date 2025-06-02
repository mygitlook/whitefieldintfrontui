
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Zap, 
  Plus, 
  Play, 
  Square, 
  Trash2,
  Clock,
  Activity,
  DollarSign,
  FileText,
  Settings
} from "lucide-react";

const LambdaDashboard = () => {
  const [functions, setFunctions] = useState([
    {
      name: "data-processor",
      runtime: "python3.9",
      memory: 512,
      timeout: 30,
      status: "active",
      lastModified: "2024-01-20 10:30 AM",
      invocations: 24567,
      avgDuration: "150ms",
      errorRate: "0.02%"
    },
    {
      name: "image-resizer",
      runtime: "nodejs18.x",
      memory: 1024,
      timeout: 60,
      status: "active",
      lastModified: "2024-01-19 03:45 PM",
      invocations: 8934,
      avgDuration: "85ms",
      errorRate: "0.01%"
    },
    {
      name: "email-sender",
      runtime: "python3.9",
      memory: 256,
      timeout: 15,
      status: "inactive",
      lastModified: "2024-01-18 11:20 AM",
      invocations: 1203,
      avgDuration: "45ms",
      errorRate: "0.00%"
    }
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newFunction, setNewFunction] = useState({
    name: "",
    runtime: "",
    memory: 128,
    timeout: 3,
    code: "",
    handler: "",
    description: "",
    environment: ""
  });

  const runtimes = [
    { value: "python3.9", label: "Python 3.9" },
    { value: "python3.8", label: "Python 3.8" },
    { value: "nodejs18.x", label: "Node.js 18.x" },
    { value: "nodejs16.x", label: "Node.js 16.x" },
    { value: "java11", label: "Java 11" },
    { value: "dotnet6", label: ".NET 6" },
    { value: "go1.x", label: "Go 1.x" },
    { value: "ruby2.7", label: "Ruby 2.7" }
  ];

  const memoryOptions = [128, 256, 512, 1024, 1536, 2048, 3008];

  const handleCreateFunction = () => {
    const newFunctionData = {
      name: newFunction.name,
      runtime: newFunction.runtime,
      memory: newFunction.memory,
      timeout: newFunction.timeout,
      status: "active",
      lastModified: new Date().toLocaleString(),
      invocations: 0,
      avgDuration: "0ms",
      errorRate: "0.00%"
    };

    setFunctions([...functions, newFunctionData]);
    setShowCreateDialog(false);
    setNewFunction({
      name: "",
      runtime: "",
      memory: 128,
      timeout: 3,
      code: "",
      handler: "",
      description: "",
      environment: ""
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "error": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const activeFunctions = functions.filter(f => f.status === "active").length;
  const totalInvocations = functions.reduce((sum, f) => sum + f.invocations, 0);
  const monthlyCost = functions.reduce((sum, f) => {
    const memoryCostPer100ms = (f.memory / 1024) * 0.0000166667;
    const requestCost = 0.0000002;
    const estimatedInvocations = f.invocations * 30;
    const estimatedDuration = 150; // ms
    return sum + (memoryCostPer100ms * estimatedDuration / 100 * estimatedInvocations) + (requestCost * estimatedInvocations);
  }, 0);

  const getEstimatedMonthlyCost = () => {
    const memoryCostPer100ms = (newFunction.memory / 1024) * 0.0000166667;
    const requestCost = 0.0000002;
    const estimatedInvocations = 10000; // Assume 10k invocations per month for estimate
    const estimatedDuration = newFunction.timeout * 1000; // Convert to ms
    return (memoryCostPer100ms * estimatedDuration / 100 * estimatedInvocations) + (requestCost * estimatedInvocations);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Lambda Dashboard</h1>
          <p className="text-gray-600">AWS Lambda Serverless Computing</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF9900] hover:bg-[#e8890a]">
              <Plus className="h-4 w-4 mr-2" />
              Create Function
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Function</DialogTitle>
              <DialogDescription>
                Create a new Lambda function from scratch
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
                <TabsTrigger value="config">Configuration</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="functionName">Function Name</Label>
                    <Input
                      id="functionName"
                      placeholder="my-function"
                      value={newFunction.name}
                      onChange={(e) => setNewFunction({...newFunction, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="runtime">Runtime</Label>
                    <Select onValueChange={(value) => setNewFunction({...newFunction, runtime: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select runtime" />
                      </SelectTrigger>
                      <SelectContent>
                        {runtimes.map((runtime) => (
                          <SelectItem key={runtime.value} value={runtime.value}>
                            {runtime.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Function description"
                    value={newFunction.description}
                    onChange={(e) => setNewFunction({...newFunction, description: e.target.value})}
                  />
                </div>
              </TabsContent>

              <TabsContent value="code" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="handler">Handler</Label>
                  <Input
                    id="handler"
                    placeholder="index.handler"
                    value={newFunction.handler}
                    onChange={(e) => setNewFunction({...newFunction, handler: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Function Code</Label>
                  <Textarea
                    id="code"
                    placeholder="def lambda_handler(event, context):&#10;    return {&#10;        'statusCode': 200,&#10;        'body': 'Hello from Lambda!'&#10;    }"
                    className="h-40 font-mono"
                    value={newFunction.code}
                    onChange={(e) => setNewFunction({...newFunction, code: e.target.value})}
                  />
                </div>
              </TabsContent>

              <TabsContent value="config" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="memory">Memory (MB)</Label>
                    <Select onValueChange={(value) => setNewFunction({...newFunction, memory: parseInt(value)})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select memory" />
                      </SelectTrigger>
                      <SelectContent>
                        {memoryOptions.map((memory) => (
                          <SelectItem key={memory} value={memory.toString()}>
                            {memory} MB
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeout">Timeout (seconds)</Label>
                    <Input
                      id="timeout"
                      type="number"
                      min="1"
                      max="900"
                      value={newFunction.timeout}
                      onChange={(e) => setNewFunction({...newFunction, timeout: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="environment">Environment Variables</Label>
                  <Textarea
                    id="environment"
                    placeholder="KEY1=value1&#10;KEY2=value2"
                    value={newFunction.environment}
                    onChange={(e) => setNewFunction({...newFunction, environment: e.target.value})}
                  />
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Estimated Monthly Cost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${getEstimatedMonthlyCost().toFixed(4)}/month
                    </div>
                    <p className="text-xs text-gray-500">
                      Based on 10,000 invocations/month with {newFunction.timeout}s duration
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="permissions" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Execution Role</h3>
                    <Select defaultValue="lambda-execution-role">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lambda-execution-role">lambda-execution-role</SelectItem>
                        <SelectItem value="create-new">Create new role</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Resource-based Policies</h3>
                    <p className="text-sm text-gray-600 mb-2">Configure which services can invoke this function</p>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="apigateway" />
                        <label htmlFor="apigateway">API Gateway</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="s3" />
                        <label htmlFor="s3">S3</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="cloudwatch" />
                        <label htmlFor="cloudwatch">CloudWatch Events</label>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateFunction}
                className="bg-[#FF9900] hover:bg-[#e8890a]"
                disabled={!newFunction.name || !newFunction.runtime}
              >
                Create Function
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Functions</CardTitle>
            <Zap className="h-4 w-4 text-[#FF9900]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{functions.length}</div>
            <p className="text-xs text-muted-foreground">Serverless functions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Functions</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeFunctions}</div>
            <p className="text-xs text-muted-foreground">Ready to execute</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invocations</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvocations.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Estimated</p>
          </CardContent>
        </Card>
      </div>

      {/* Functions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Functions</CardTitle>
          <CardDescription>Manage your Lambda functions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Runtime</TableHead>
                <TableHead>Memory</TableHead>
                <TableHead>Timeout</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invocations</TableHead>
                <TableHead>Avg Duration</TableHead>
                <TableHead>Error Rate</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {functions.map((func, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{func.name}</TableCell>
                  <TableCell>{func.runtime}</TableCell>
                  <TableCell>{func.memory} MB</TableCell>
                  <TableCell>{func.timeout}s</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(func.status)}>
                      {func.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{func.invocations.toLocaleString()}</TableCell>
                  <TableCell>{func.avgDuration}</TableCell>
                  <TableCell>{func.errorRate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Play className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
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

export default LambdaDashboard;
