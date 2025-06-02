
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
  Users, 
  Plus, 
  Shield, 
  Key,
  UserPlus,
  Settings,
  Trash2,
  Lock
} from "lucide-react";

const IAMDashboard = () => {
  const [users, setUsers] = useState([
    {
      username: "john.doe",
      email: "john.doe@company.com",
      status: "active",
      created: "2024-01-10",
      lastActivity: "2024-01-20 14:30",
      mfaEnabled: true,
      groups: ["Developers", "S3ReadOnly"]
    },
    {
      username: "jane.smith",
      email: "jane.smith@company.com", 
      status: "active",
      created: "2024-01-12",
      lastActivity: "2024-01-20 10:15",
      mfaEnabled: false,
      groups: ["Administrators"]
    },
    {
      username: "bob.wilson",
      email: "bob.wilson@company.com",
      status: "inactive",
      created: "2024-01-08",
      lastActivity: "2024-01-18 16:45",
      mfaEnabled: true,
      groups: ["ReadOnly"]
    }
  ]);

  const [policies, setPolicies] = useState([
    {
      name: "S3FullAccess",
      type: "AWS Managed",
      description: "Provides full access to all S3 resources",
      attachedTo: 2,
      created: "AWS",
      version: "v1"
    },
    {
      name: "EC2ReadOnlyAccess",
      type: "AWS Managed", 
      description: "Provides read-only access to EC2 resources",
      attachedTo: 1,
      created: "AWS",
      version: "v1"
    },
    {
      name: "CustomDeveloperPolicy",
      type: "Customer Managed",
      description: "Custom policy for developer access",
      attachedTo: 3,
      created: "2024-01-15",
      version: "v2"
    }
  ]);

  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [showCreatePolicyDialog, setShowCreatePolicyDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    groups: [],
    policies: [],
    accessType: "console"
  });

  const [newPolicy, setNewPolicy] = useState({
    name: "",
    description: "",
    document: "",
    effect: "Allow",
    actions: "",
    resources: ""
  });

  const accessTypes = [
    { value: "console", label: "AWS Management Console access" },
    { value: "programmatic", label: "Programmatic access" },
    { value: "both", label: "Both console and programmatic access" }
  ];

  const groups = ["Administrators", "Developers", "ReadOnly", "S3ReadOnly", "EC2ReadOnly"];

  const handleCreateUser = () => {
    const newUserData = {
      username: newUser.username,
      email: newUser.email,
      status: "active",
      created: new Date().toISOString().split('T')[0],
      lastActivity: "Never",
      mfaEnabled: false,
      groups: newUser.groups
    };

    setUsers([...users, newUserData]);
    setShowCreateUserDialog(false);
    setNewUser({
      username: "",
      email: "",
      password: "",
      groups: [],
      policies: [],
      accessType: "console"
    });
  };

  const handleCreatePolicy = () => {
    const newPolicyData = {
      name: newPolicy.name,
      type: "Customer Managed",
      description: newPolicy.description,
      attachedTo: 0,
      created: new Date().toISOString().split('T')[0],
      version: "v1"
    };

    setPolicies([...policies, newPolicyData]);
    setShowCreatePolicyDialog(false);
    setNewPolicy({
      name: "",
      description: "",
      document: "",
      effect: "Allow",
      actions: "",
      resources: ""
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const activeUsers = users.filter(u => u.status === "active").length;
  const totalPolicies = policies.length;
  const mfaEnabledUsers = users.filter(u => u.mfaEnabled).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">IAM Dashboard</h1>
          <p className="text-gray-600">Identity and Access Management</p>
        </div>
        <div className="flex space-x-2">
          <Dialog open={showCreateUserDialog} onOpenChange={setShowCreateUserDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#FF9900] hover:bg-[#e8890a]">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add User</DialogTitle>
                <DialogDescription>
                  Create a new IAM user with specific permissions
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">User Details</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                  <TabsTrigger value="review">Review</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        placeholder="Enter username"
                        value={newUser.username}
                        onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="user@company.com"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accessType">Access Type</Label>
                    <Select onValueChange={(value) => setNewUser({...newUser, accessType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select access type" />
                      </SelectTrigger>
                      <SelectContent>
                        {accessTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {(newUser.accessType === "console" || newUser.accessType === "both") && (
                    <div className="space-y-2">
                      <Label htmlFor="password">Console Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="permissions" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Add user to groups</h3>
                      <div className="space-y-2">
                        {groups.map((group) => (
                          <div key={group} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={group}
                              checked={newUser.groups.includes(group)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewUser({...newUser, groups: [...newUser.groups, group]});
                                } else {
                                  setNewUser({...newUser, groups: newUser.groups.filter(g => g !== group)});
                                }
                              }}
                            />
                            <label htmlFor={group} className="text-sm">{group}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="review" className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">User Details</h3>
                      <p className="text-sm text-gray-600">Username: {newUser.username}</p>
                      <p className="text-sm text-gray-600">Email: {newUser.email}</p>
                      <p className="text-sm text-gray-600">Access Type: {newUser.accessType}</p>
                    </div>
                    <div>
                      <h3 className="font-medium">Groups</h3>
                      <p className="text-sm text-gray-600">{newUser.groups.join(", ") || "None"}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreateUserDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateUser}
                  className="bg-[#FF9900] hover:bg-[#e8890a]"
                  disabled={!newUser.username || !newUser.email}
                >
                  Create User
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreatePolicyDialog} onOpenChange={setShowCreatePolicyDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Create Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create Policy</DialogTitle>
                <DialogDescription>
                  Create a custom IAM policy with specific permissions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policyName">Policy Name</Label>
                    <Input
                      id="policyName"
                      placeholder="MyCustomPolicy"
                      value={newPolicy.name}
                      onChange={(e) => setNewPolicy({...newPolicy, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="effect">Effect</Label>
                    <Select onValueChange={(value) => setNewPolicy({...newPolicy, effect: value})} defaultValue="Allow">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Allow">Allow</SelectItem>
                        <SelectItem value="Deny">Deny</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Policy description"
                    value={newPolicy.description}
                    onChange={(e) => setNewPolicy({...newPolicy, description: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actions">Actions</Label>
                  <Input
                    id="actions"
                    placeholder="s3:GetObject, s3:PutObject"
                    value={newPolicy.actions}
                    onChange={(e) => setNewPolicy({...newPolicy, actions: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resources">Resources</Label>
                  <Input
                    id="resources"
                    placeholder="arn:aws:s3:::my-bucket/*"
                    value={newPolicy.resources}
                    onChange={(e) => setNewPolicy({...newPolicy, resources: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="policyDocument">Policy Document (JSON)</Label>
                  <Textarea
                    id="policyDocument"
                    className="h-32 font-mono"
                    placeholder='{&#10;  "Version": "2012-10-17",&#10;  "Statement": [&#10;    {&#10;      "Effect": "Allow",&#10;      "Action": "s3:GetObject",&#10;      "Resource": "*"&#10;    }&#10;  ]&#10;}'
                    value={newPolicy.document}
                    onChange={(e) => setNewPolicy({...newPolicy, document: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setShowCreatePolicyDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreatePolicy}
                  className="bg-[#FF9900] hover:bg-[#e8890a]"
                  disabled={!newPolicy.name}
                >
                  Create Policy
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-[#FF9900]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">IAM users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MFA Enabled</CardTitle>
            <Lock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mfaEnabledUsers}</div>
            <p className="text-xs text-muted-foreground">Multi-factor auth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Policies</CardTitle>
            <Key className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPolicies}</div>
            <p className="text-xs text-muted-foreground">Total policies</p>
          </CardContent>
        </Card>
      </div>

      {/* Users and Policies Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage IAM users</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>MFA</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.mfaEnabled ? "default" : "outline"}>
                        {user.mfaEnabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
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

        <Card>
          <CardHeader>
            <CardTitle>Policies</CardTitle>
            <CardDescription>Manage IAM policies</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Attached</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {policies.map((policy, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{policy.name}</TableCell>
                    <TableCell>
                      <Badge variant={policy.type === "AWS Managed" ? "default" : "secondary"}>
                        {policy.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{policy.attachedTo}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                        {policy.type === "Customer Managed" && (
                          <Button size="sm" variant="outline" className="text-red-600">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IAMDashboard;
