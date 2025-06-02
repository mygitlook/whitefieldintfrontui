
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
  Save, 
  Plus,
  DollarSign,
  HardDrive,
  Clock,
  Settings,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BackupJob {
  id: string;
  name: string;
  sourceType: "ec2" | "s3" | "database" | "filesystem";
  sourceName: string;
  storageTB: number;
  frequency: "daily" | "weekly" | "monthly";
  status: "active" | "inactive" | "running" | "failed";
  lastBackup: string;
  nextBackup: string;
  retentionDays: number;
}

const BackupStorageDashboard = () => {
  const [backupJobs, setBackupJobs] = useState<BackupJob[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newJobName, setNewJobName] = useState("");
  const [selectedSourceType, setSelectedSourceType] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedFrequency, setSelectedFrequency] = useState("daily");
  const [retentionDays, setRetentionDays] = useState("30");
  const { toast } = useToast();

  useEffect(() => {
    loadBackupJobs();
  }, []);

  const loadBackupJobs = () => {
    const savedJobs = localStorage.getItem('backup-jobs');
    if (savedJobs) {
      setBackupJobs(JSON.parse(savedJobs));
    } else {
      const defaultJobs: BackupJob[] = Array.from({ length: 45 }, (_, i) => ({
        id: `backup-${i + 1}`,
        name: `backup-job-${i + 1}`,
        sourceType: ["ec2", "s3", "database", "filesystem"][Math.floor(Math.random() * 4)] as any,
        sourceName: `resource-${i + 1}`,
        storageTB: Math.random() * 2 + 0.1,
        frequency: ["daily", "weekly", "monthly"][Math.floor(Math.random() * 3)] as any,
        status: Math.random() > 0.1 ? "active" : "inactive",
        lastBackup: `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        nextBackup: `2024-02-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        retentionDays: [30, 60, 90, 180][Math.floor(Math.random() * 4)]
      }));
      setBackupJobs(defaultJobs);
      saveBackupJobs(defaultJobs);
    }
  };

  const saveBackupJobs = (jobList: BackupJob[]) => {
    localStorage.setItem('backup-jobs', JSON.stringify(jobList));
  };

  const createBackupJob = () => {
    if (!newJobName || !selectedSourceType || !selectedSource) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newJob: BackupJob = {
      id: `backup-${Date.now()}`,
      name: newJobName,
      sourceType: selectedSourceType as any,
      sourceName: selectedSource,
      storageTB: 0,
      frequency: selectedFrequency as any,
      status: "active",
      lastBackup: "Not yet",
      nextBackup: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      retentionDays: parseInt(retentionDays)
    };

    const updatedJobs = [...backupJobs, newJob];
    setBackupJobs(updatedJobs);
    saveBackupJobs(updatedJobs);

    toast({
      title: "Backup Job Created",
      description: `${newJobName} has been created successfully`,
    });

    setIsCreateDialogOpen(false);
    setNewJobName("");
    setSelectedSourceType("");
    setSelectedSource("");
    setSelectedFrequency("daily");
    setRetentionDays("30");
  };

  const totalStorageTB = backupJobs.reduce((sum, job) => sum + job.storageTB, 0);
  const monthlyCost = totalStorageTB * 8.00; // £8.00 per TB
  const activeJobs = backupJobs.filter(job => job.status === "active").length;
  const runningJobs = backupJobs.filter(job => job.status === "running").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Backup Storage</h1>
          <p className="text-gray-600">Automated backup and disaster recovery for your critical data</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2563eb] hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Backup Job
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Backup Job</DialogTitle>
              <DialogDescription>
                Set up automated backups for your resources
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="job-name">Job Name</Label>
                <Input
                  id="job-name"
                  value={newJobName}
                  onChange={(e) => setNewJobName(e.target.value)}
                  placeholder="Enter backup job name"
                />
              </div>
              <div>
                <Label htmlFor="source-type">Source Type</Label>
                <Select value={selectedSourceType} onValueChange={setSelectedSourceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ec2">EC2 Instance</SelectItem>
                    <SelectItem value="s3">S3 Bucket</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="filesystem">File System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="source-name">Source Name</Label>
                <Input
                  id="source-name"
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  placeholder="Enter source resource name"
                />
              </div>
              <div>
                <Label htmlFor="frequency">Backup Frequency</Label>
                <Select value={selectedFrequency} onValueChange={setSelectedFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="retention">Retention (Days)</Label>
                <Select value={retentionDays} onValueChange={setRetentionDays}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select retention period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="180">180 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={createBackupJob} className="w-full">
                Create Backup Job
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Backup Jobs</CardTitle>
            <Save className="h-4 w-4 text-[#2563eb]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{backupJobs.length}</div>
            <p className="text-xs text-muted-foreground">{activeJobs} active, {runningJobs} running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStorageTB.toFixed(1)} TB</div>
            <p className="text-xs text-muted-foreground">Backup storage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{monthlyCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">£8.00 per TB</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last 24h Backups</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(activeJobs * 0.8)}</div>
            <p className="text-xs text-muted-foreground">Successful backups</p>
          </CardContent>
        </Card>
      </div>

      {/* Backup Jobs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Backup Jobs</CardTitle>
          <CardDescription>Manage your automated backup jobs</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Name</TableHead>
                <TableHead>Source Type</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Storage (TB)</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Backup</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {backupJobs.slice(0, 10).map((job) => {
                const jobCost = job.storageTB * 8.00;
                return (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.name}</TableCell>
                    <TableCell className="capitalize">{job.sourceType}</TableCell>
                    <TableCell>{job.sourceName}</TableCell>
                    <TableCell>{job.storageTB.toFixed(2)} TB</TableCell>
                    <TableCell className="capitalize">{job.frequency}</TableCell>
                    <TableCell>
                      <Badge variant={
                        job.status === "active" ? "default" :
                        job.status === "running" ? "secondary" :
                        job.status === "failed" ? "destructive" : "outline"
                      }>
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{job.lastBackup}</TableCell>
                    <TableCell>£{jobCost.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <RefreshCw className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {backupJobs.length > 10 && (
            <div className="mt-4 text-center text-sm text-gray-500">
              Showing 10 of {backupJobs.length} backup jobs
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BackupStorageDashboard;
