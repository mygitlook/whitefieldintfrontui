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
import { 
  Database, 
  Plus, 
  Play, 
  Square, 
  RotateCcw, 
  Trash2,
  Activity,
  HardDrive,
  Cpu,
  Clock
} from "lucide-react";

const RDSDashboard = () => {
  const [databases, setDatabases] = useState([
    {
      id: "myapp-prod-db",
      engine: "MySQL",
      version: "8.0.35",
      class: "db.t3.medium",
      status: "available",
      az: "us-east-1a",
      storage: "100 GiB",
      endpoint: "myapp-prod-db.c1abc123def4.us-east-1.rds.amazonaws.com",
      port: 3306,
      created: "2024-01-10 14:30",
      multiAZ: true,
      backupRetention: 7
    },
    {
      id: "analytics-db",
      engine: "PostgreSQL", 
      version: "15.4",
      class: "db.r5.large",
      status: "available",
      az: "us-east-1b",
      storage: "500 GiB",
      endpoint: "analytics-db.c1abc123def4.us-east-1.rds.amazonaws.com",
      port: 5432,
      created: "2024-01-08 09:15",
      multiAZ: false,
      backupRetention: 14
    },
    {
      id: "test-database",
      engine: "MySQL",
      version: "8.0.35", 
      class: "db.t3.micro",
      status: "stopped",
      az: "us-east-1a",
      storage: "20 GiB",
      endpoint: "test-database.c1abc123def4.us-east-1.rds.amazonaws.com",
      port: 3306,
      created: "2024-01-15 11:45",
      multiAZ: false,
      backupRetention: 1
    }
  ]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newDatabase, setNewDatabase] = useState({
    identifier: "",
    engine: "",
    version: "",
    instanceClass: "",
    username: "",
    password: "",
    storage: "20",
    multiAZ: false,
    backupRetention: 7
  });

  const engines = [
    { value: "mysql", label: "MySQL", versions: ["8.0.35", "8.0.34", "5.7.44"] },
    { value: "postgres", label: "PostgreSQL", versions: ["15.4", "14.9", "13.13"] },
    { value: "mariadb", label: "MariaDB", versions: ["10.11.5", "10.6.14", "10.5.21"] },
    { value: "oracle", label: "Oracle", versions: ["19.0.0.0.ru-2023-07.rur-2023-07.r1"] },
    { value: "sqlserver", label: "SQL Server", versions: ["15.00.4316.3.v1", "14.00.3401.7.v1"] }
  ];

  const instanceClasses = [
    { value: "db.t3.micro", label: "db.t3.micro (1 vCPU, 1 GiB RAM) - $0.017/hour", specs: "1 vCPU, 1 GiB", hourlyRate: 0.017 },
    { value: "db.t3.small", label: "db.t3.small (2 vCPUs, 2 GiB RAM) - $0.034/hour", specs: "2 vCPUs, 2 GiB", hourlyRate: 0.034 },
    { value: "db.t3.medium", label: "db.t3.medium (2 vCPUs, 4 GiB RAM) - $0.068/hour", specs: "2 vCPUs, 4 GiB", hourlyRate: 0.068 },
    { value: "db.r5.large", label: "db.r5.large (2 vCPUs, 16 GiB RAM) - $0.24/hour", specs: "2 vCPUs, 16 GiB", hourlyRate: 0.24 },
    { value: "db.r5.xlarge", label: "db.r5.xlarge (4 vCPUs, 32 GiB RAM) - $0.48/hour", specs: "4 vCPUs, 32 GiB", hourlyRate: 0.48 }
  ];

  const handleCreateDatabase = () => {
    const newDatabaseData = {
      id: newDatabase.identifier,
      engine: newDatabase.engine.charAt(0).toUpperCase() + newDatabase.engine.slice(1),
      version: newDatabase.version,
      class: newDatabase.instanceClass,
      status: "creating",
      az: "us-east-1a",
      storage: `${newDatabase.storage} GiB`,
      endpoint: `${newDatabase.identifier}.c1abc123def4.us-east-1.rds.amazonaws.com`,
      port: newDatabase.engine === "postgres" ? 5432 : 3306,
      created: new Date().toLocaleString(),
      multiAZ: newDatabase.multiAZ,
      backupRetention: newDatabase.backupRetention
    };

    setDatabases([...databases, newDatabaseData]);
    setShowCreateDialog(false);
    setNewDatabase({
      identifier: "",
      engine: "",
      version: "",
      instanceClass: "",
      username: "",
      password: "",
      storage: "20",
      multiAZ: false,
      backupRetention: 7
    });

    // Simulate database creation
    setTimeout(() => {
      setDatabases(prev => prev.map(db => 
        db.id === newDatabaseData.id 
          ? { ...db, status: "available" }
          : db
      ));
    }, 5000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800";
      case "stopped": return "bg-red-100 text-red-800";
      case "creating": return "bg-yellow-100 text-yellow-800";
      case "deleting": return "bg-orange-100 text-orange-800";
      case "backing-up": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const availableDatabases = databases.filter(db => db.status === "available").length;
  const stoppedDatabases = databases.filter(db => db.status === "stopped").length;
  const totalDatabases = databases.length;
  const monthlyCost = databases.reduce((sum, db) => {
    const hourlyRates: { [key: string]: number } = {
      "db.t3.micro": 0.017,
      "db.t3.small": 0.034, 
      "db.t3.medium": 0.068,
      "db.r5.large": 0.24,
      "db.r5.xlarge": 0.48
    };
    const rate = hourlyRates[db.class] || 0;
    return sum + (rate * 24 * 30);
  }, 0);

  const getEstimatedMonthlyCost = () => {
    if (!newDatabase.instanceClass) return 0;
    const selectedInstance = instanceClasses.find(ic => ic.value === newDatabase.instanceClass);
    return selectedInstance ? selectedInstance.hourlyRate * 24 * 30 : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">RDS Dashboard</h1>
          <p className="text-gray-600">Amazon Relational Database Service</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-[#FF9900] hover:bg-[#e8890a]">
              <Plus className="h-4 w-4 mr-2" />
              Create Database
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Database</DialogTitle>
              <DialogDescription>
                Create a new RDS database instance
              </DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="engine" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="engine">Engine</TabsTrigger>
                <TabsTrigger value="instance">Instance</TabsTrigger>
                <TabsTrigger value="credentials">Credentials</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="engine" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="identifier">DB Instance Identifier</Label>
                  <Input
                    id="identifier"
                    placeholder="Enter database identifier"
                    value={newDatabase.identifier}
                    onChange={(e) => setNewDatabase({...newDatabase, identifier: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="engine">Engine Type</Label>
                    <Select onValueChange={(value) => setNewDatabase({...newDatabase, engine: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select database engine" />
                      </SelectTrigger>
                      <SelectContent>
                        {engines.map((engine) => (
                          <SelectItem key={engine.value} value={engine.value}>
                            {engine.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="version">Engine Version</Label>
                    <Select 
                      onValueChange={(value) => setNewDatabase({...newDatabase, version: value})}
                      disabled={!newDatabase.engine}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                      <SelectContent>
                        {newDatabase.engine && engines.find(e => e.value === newDatabase.engine)?.versions.map((version) => (
                          <SelectItem key={version} value={version}>
                            {version}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="instance" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="instanceClass">DB Instance Class</Label>
                  <Select onValueChange={(value) => setNewDatabase({...newDatabase, instanceClass: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select instance class" />
                    </SelectTrigger>
                    <SelectContent>
                      {instanceClasses.map((instanceClass) => (
                        <SelectItem key={instanceClass.value} value={instanceClass.value}>
                          <div>
                            <div className="font-medium">{instanceClass.value}</div>
                            <div className="text-xs text-gray-500">{instanceClass.specs}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storage">Allocated Storage (GiB)</Label>
                  <Input
                    id="storage"
                    type="number"
                    placeholder="20"
                    value={newDatabase.storage}
                    onChange={(e) => setNewDatabase({...newDatabase, storage: e.target.value})}
                  />
                  <p className="text-xs text-gray-500">Minimum 20 GiB, maximum 65536 GiB</p>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="multiAZ"
                    checked={newDatabase.multiAZ}
                    onChange={(e) => setNewDatabase({...newDatabase, multiAZ: e.target.checked})}
                  />
                  <Label htmlFor="multiAZ">Multi-AZ deployment</Label>
                  <span className="text-xs text-gray-500">(Recommended for production)</span>
                </div>
              </TabsContent>

              <TabsContent value="credentials" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Master Username</Label>
                  <Input
                    id="username"
                    placeholder="Enter master username"
                    value={newDatabase.username}
                    onChange={(e) => setNewDatabase({...newDatabase, username: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Master Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter master password"
                    value={newDatabase.password}
                    onChange={(e) => setNewDatabase({...newDatabase, password: e.target.value})}
                  />
                  <p className="text-xs text-gray-500">
                    Password must be at least 8 characters and contain at least one uppercase letter, lowercase letter, and number
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="backupRetention">Backup Retention Period (days)</Label>
                  <Select 
                    onValueChange={(value) => setNewDatabase({...newDatabase, backupRetention: parseInt(value)})}
                    defaultValue="7"
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 7, 14, 21, 30, 35].map((days) => (
                        <SelectItem key={days} value={days.toString()}>
                          {days} days
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Estimated Monthly Cost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${getEstimatedMonthlyCost().toFixed(2)}/month
                    </div>
                    <p className="text-xs text-gray-500">
                      Based on {newDatabase.instanceClass || "selected instance class"} running 24/7
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateDatabase}
                className="bg-[#FF9900] hover:bg-[#e8890a]"
                disabled={!newDatabase.identifier || !newDatabase.engine || !newDatabase.instanceClass || !newDatabase.username || !newDatabase.password}
              >
                Create Database
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Databases</CardTitle>
            <Database className="h-4 w-4 text-[#FF9900]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDatabases}</div>
            <p className="text-xs text-muted-foreground">Across all regions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{availableDatabases}</div>
            <p className="text-xs text-muted-foreground">Ready for connections</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stopped</CardTitle>
            <Square className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stoppedDatabases}</div>
            <p className="text-xs text-muted-foreground">Not running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <Cpu className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Estimated</p>
          </CardContent>
        </Card>
      </div>

      {/* Databases Table */}
      <Card>
        <CardHeader>
          <CardTitle>DB Instances</CardTitle>
          <CardDescription>Manage your RDS database instances</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DB Identifier</TableHead>
                <TableHead>Engine</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Multi-AZ</TableHead>
                <TableHead>Storage</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {databases.map((database) => (
                <TableRow key={database.id}>
                  <TableCell className="font-medium">{database.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{database.engine}</div>
                      <div className="text-xs text-gray-500">{database.version}</div>
                    </div>
                  </TableCell>
                  <TableCell>{database.class}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(database.status)}>
                      {database.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={database.multiAZ ? "default" : "outline"}>
                      {database.multiAZ ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell>{database.storage}</TableCell>
                  <TableCell className="font-mono text-xs max-w-xs truncate">
                    {database.endpoint}:{database.port}
                  </TableCell>
                  <TableCell>{database.created}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Play className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Square className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <RotateCcw className="h-3 w-3" />
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

export default RDSDashboard;
