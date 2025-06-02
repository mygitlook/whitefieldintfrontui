
import { useState } from "react";
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
  FileText, 
  Plus, 
  Play, 
  Square, 
  Trash2,
  Upload,
  Download,
  Eye,
  RefreshCw
} from "lucide-react";

const CloudFormationDashboard = () => {
  const [stacks, setStacks] = useState([
    {
      name: "production-vpc",
      status: "CREATE_COMPLETE",
      created: "2024-01-15 10:30 AM",
      updated: "2024-01-18 14:45 PM",
      resources: 12,
      parameters: 4,
      outputs: 3,
      templateSize: "2.4 KB"
    },
    {
      name: "webapp-infrastructure",
      status: "UPDATE_IN_PROGRESS",
      created: "2024-01-12 09:15 AM", 
      updated: "2024-01-20 11:30 AM",
      resources: 25,
      parameters: 8,
      outputs: 6,
      templateSize: "15.7 KB"
    },
    {
      name: "database-stack",
      status: "CREATE_FAILED",
      created: "2024-01-20 16:20 PM",
      updated: "2024-01-20 16:35 PM",
      resources: 0,
      parameters: 3,
      outputs: 0,
      templateSize: "3.2 KB"
    }
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newStack, setNewStack] = useState({
    name: "",
    template: "",
    parameters: "",
    tags: "",
    capabilities: [],
    rollbackOnFailure: true
  });

  const templates = [
    { value: "vpc", label: "VPC with Public/Private Subnets", description: "Creates a VPC with public and private subnets" },
    { value: "webserver", label: "Web Server with Auto Scaling", description: "EC2 instances with load balancer and auto scaling" },
    { value: "database", label: "RDS Database with Backup", description: "RDS instance with automated backups" },
    { value: "serverless", label: "Serverless Application", description: "Lambda functions with API Gateway" },
    { value: "custom", label: "Upload Custom Template", description: "Upload your own CloudFormation template" }
  ];

  const capabilities = [
    { value: "CAPABILITY_IAM", label: "CAPABILITY_IAM", description: "Required if template creates IAM resources" },
    { value: "CAPABILITY_NAMED_IAM", label: "CAPABILITY_NAMED_IAM", description: "Required if template creates named IAM resources" },
    { value: "CAPABILITY_AUTO_EXPAND", label: "CAPABILITY_AUTO_EXPAND", description: "Required if template contains transforms" }
  ];

  const handleCreateStack = () => {
    const newStackData = {
      name: newStack.name,
      status: "CREATE_IN_PROGRESS",
      created: new Date().toLocaleString(),
      updated: new Date().toLocaleString(),
      resources: 0,
      parameters: newStack.parameters.split('\n').filter(p => p.trim()).length,
      outputs: 0,
      templateSize: "0 KB"
    };

    setStacks([...stacks, newStackData]);
    setShowCreateDialog(false);
    setNewStack({
      name: "",
      template: "",
      parameters: "",
      tags: "",
      capabilities: [],
      rollbackOnFailure: true
    });

    // Simulate stack creation
    setTimeout(() => {
      setStacks(prev => prev.map(stack => 
        stack.name === newStackData.name 
          ? { ...stack, status: "CREATE_COMPLETE", resources: Math.floor(Math.random() * 20) + 5 }
          : stack
      ));
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    if (status.includes("COMPLETE")) return "bg-green-100 text-green-800";
    if (status.includes("FAILED")) return "bg-red-100 text-red-800";
    if (status.includes("IN_PROGRESS")) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const completeStacks = stacks.filter(s => s.status.includes("COMPLETE")).length;
  const totalResources = stacks.reduce((sum, stack) => sum + stack.resources, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">CloudFormation Dashboard</h1>
          <p className="text-gray-600">Infrastructure as Code</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF9900] hover:bg-[#e8890a]">
              <Plus className="h-4 w-4 mr-2" />
              Create Stack
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Stack</DialogTitle>
              <DialogDescription>
                Create a new CloudFormation stack from a template
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="stackName">Stack Name</Label>
                <Input
                  id="stackName"
                  placeholder="my-infrastructure-stack"
                  value={newStack.name}
                  onChange={(e) => setNewStack({...newStack, name: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="template">Template</Label>
                <Select onValueChange={(value) => setNewStack({...newStack, template: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a template or upload custom" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.value} value={template.value}>
                        <div>
                          <div className="font-medium">{template.label}</div>
                          <div className="text-xs text-gray-500">{template.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {newStack.template === "custom" && (
                <div className="space-y-2">
                  <Label htmlFor="templateFile">Template File</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Drag and drop your CloudFormation template file here, or click to browse
                    </p>
                    <Button variant="outline" className="mt-2">
                      Choose File
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="parameters">Parameters</Label>
                <Textarea
                  id="parameters"
                  placeholder="ParameterName1=Value1&#10;ParameterName2=Value2"
                  value={newStack.parameters}
                  onChange={(e) => setNewStack({...newStack, parameters: e.target.value})}
                  className="h-24"
                />
                <p className="text-xs text-gray-500">Enter parameters in key=value format, one per line</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Textarea
                  id="tags"
                  placeholder="Environment=Production&#10;Project=WebApp"
                  value={newStack.tags}
                  onChange={(e) => setNewStack({...newStack, tags: e.target.value})}
                  className="h-20"
                />
              </div>

              <div className="space-y-2">
                <Label>Capabilities</Label>
                <div className="space-y-2">
                  {capabilities.map((capability) => (
                    <div key={capability.value} className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id={capability.value}
                        checked={newStack.capabilities.includes(capability.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewStack({...newStack, capabilities: [...newStack.capabilities, capability.value]});
                          } else {
                            setNewStack({...newStack, capabilities: newStack.capabilities.filter(c => c !== capability.value)});
                          }
                        }}
                        className="mt-1"
                      />
                      <div>
                        <label htmlFor={capability.value} className="text-sm font-medium">{capability.label}</label>
                        <p className="text-xs text-gray-500">{capability.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="rollbackOnFailure"
                  checked={newStack.rollbackOnFailure}
                  onChange={(e) => setNewStack({...newStack, rollbackOnFailure: e.target.checked})}
                />
                <Label htmlFor="rollbackOnFailure">Rollback on failure</Label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateStack}
                className="bg-[#FF9900] hover:bg-[#e8890a]"
                disabled={!newStack.name || !newStack.template}
              >
                Create Stack
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stacks</CardTitle>
            <FileText className="h-4 w-4 text-[#FF9900]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stacks.length}</div>
            <p className="text-xs text-muted-foreground">CloudFormation stacks</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Complete</CardTitle>
            <Play className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completeStacks}</div>
            <p className="text-xs text-muted-foreground">Successfully deployed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resources</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalResources}</div>
            <p className="text-xs text-muted-foreground">Managed resources</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <Square className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$0.00</div>
            <p className="text-xs text-muted-foreground">CloudFormation is free</p>
          </CardContent>
        </Card>
      </div>

      {/* Stacks Table */}
      <Card>
        <CardHeader>
          <CardTitle>Stacks</CardTitle>
          <CardDescription>Manage your CloudFormation stacks</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stack Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Resources</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Template Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stacks.map((stack, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{stack.name}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(stack.status)}>
                      {stack.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{stack.resources}</TableCell>
                  <TableCell>{stack.created}</TableCell>
                  <TableCell>{stack.updated}</TableCell>
                  <TableCell>{stack.templateSize}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-3 w-3" />
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

export default CloudFormationDashboard;
