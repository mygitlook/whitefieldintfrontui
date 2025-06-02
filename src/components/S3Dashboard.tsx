
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
  HardDrive, 
  Plus,
  DollarSign,
  FolderOpen,
  Upload,
  Download,
  Trash2,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface S3Bucket {
  id: string;
  name: string;
  region: string;
  sizeGB: number;
  objectCount: number;
  storageClass: "standard" | "ia" | "glacier" | "deep-archive";
  versioning: boolean;
  encryption: boolean;
  created: string;
  lastModified: string;
}

const S3Dashboard = () => {
  const [buckets, setBuckets] = useState<S3Bucket[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBucketName, setNewBucketName] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("eu-west-1");
  const [selectedStorageClass, setSelectedStorageClass] = useState("standard");
  const { toast } = useToast();

  const regions = [
    { id: "eu-west-1", name: "Europe (Ireland)" },
    { id: "eu-west-2", name: "Europe (London)" },
    { id: "us-east-1", name: "US East (N. Virginia)" },
    { id: "us-west-2", name: "US West (Oregon)" },
    { id: "ap-southeast-1", name: "Asia Pacific (Singapore)" }
  ];

  const storageClasses = [
    { id: "standard", name: "Standard", description: "Frequently accessed data" },
    { id: "ia", name: "Infrequent Access", description: "Less frequently accessed data" },
    { id: "glacier", name: "Glacier", description: "Archive storage" },
    { id: "deep-archive", name: "Deep Archive", description: "Long-term archive" }
  ];

  useEffect(() => {
    loadBuckets();
  }, []);

  const loadBuckets = () => {
    const savedBuckets = localStorage.getItem('s3-buckets');
    if (savedBuckets) {
      setBuckets(JSON.parse(savedBuckets));
    } else {
      const defaultBuckets: S3Bucket[] = [
        {
          id: "bucket-1",
          name: "my-app-assets",
          region: "eu-west-1",
          sizeGB: 125.5,
          objectCount: 2847,
          storageClass: "standard",
          versioning: true,
          encryption: true,
          created: "2024-01-15",
          lastModified: "2024-01-25"
        },
        {
          id: "bucket-2",
          name: "backup-storage",
          region: "eu-west-2",
          sizeGB: 2048.3,
          objectCount: 156,
          storageClass: "ia",
          versioning: false,
          encryption: true,
          created: "2024-01-10",
          lastModified: "2024-01-24"
        },
        {
          id: "bucket-3",
          name: "logs-archive",
          region: "us-east-1",
          sizeGB: 512.7,
          objectCount: 9821,
          storageClass: "glacier",
          versioning: true,
          encryption: false,
          created: "2024-01-05",
          lastModified: "2024-01-23"
        }
      ];
      setBuckets(defaultBuckets);
      saveBuckets(defaultBuckets);
    }
  };

  const saveBuckets = (bucketList: S3Bucket[]) => {
    localStorage.setItem('s3-buckets', JSON.stringify(bucketList));
  };

  const createBucket = () => {
    if (!newBucketName) {
      toast({
        title: "Error",
        description: "Please enter a bucket name",
        variant: "destructive",
      });
      return;
    }

    if (buckets.some(bucket => bucket.name === newBucketName)) {
      toast({
        title: "Error",
        description: "Bucket name already exists",
        variant: "destructive",
      });
      return;
    }

    const newBucket: S3Bucket = {
      id: `bucket-${Date.now()}`,
      name: newBucketName,
      region: selectedRegion,
      sizeGB: 0,
      objectCount: 0,
      storageClass: selectedStorageClass as any,
      versioning: false,
      encryption: true,
      created: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };

    const updatedBuckets = [...buckets, newBucket];
    setBuckets(updatedBuckets);
    saveBuckets(updatedBuckets);

    toast({
      title: "Bucket Created",
      description: `${newBucketName} has been created successfully`,
    });

    setIsCreateDialogOpen(false);
    setNewBucketName("");
    setSelectedRegion("eu-west-1");
    setSelectedStorageClass("standard");
  };

  const deleteBucket = (id: string) => {
    const bucket = buckets.find(b => b.id === id);
    const updatedBuckets = buckets.filter(b => b.id !== id);
    setBuckets(updatedBuckets);
    saveBuckets(updatedBuckets);
    
    toast({
      title: "Bucket Deleted",
      description: `${bucket?.name} has been deleted`,
      variant: "destructive",
    });
  };

  const calculateMonthlyCost = (sizeGB: number, storageClass: string) => {
    const sizeTB = sizeGB / 1024;
    const pricePerTB = 10.00; // £10.00 per TB for standard storage
    const multiplier = storageClass === 'standard' ? 1 : 
                      storageClass === 'ia' ? 0.7 :
                      storageClass === 'glacier' ? 0.3 : 0.1;
    return sizeTB * pricePerTB * multiplier;
  };

  const totalStorageGB = buckets.reduce((sum, bucket) => sum + bucket.sizeGB, 0);
  const totalStorageTB = totalStorageGB / 1024;
  const totalObjects = buckets.reduce((sum, bucket) => sum + bucket.objectCount, 0);
  const totalMonthlyCost = buckets.reduce((sum, bucket) => 
    sum + calculateMonthlyCost(bucket.sizeGB, bucket.storageClass), 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Object Storage (S3)</h1>
          <p className="text-gray-600">Scalable object storage for any amount of data</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2563eb] hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Bucket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Storage Bucket</DialogTitle>
              <DialogDescription>
                Create a new S3 bucket for object storage
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bucket-name">Bucket Name</Label>
                <Input
                  id="bucket-name"
                  value={newBucketName}
                  onChange={(e) => setNewBucketName(e.target.value)}
                  placeholder="Enter bucket name (must be unique)"
                />
              </div>
              <div>
                <Label htmlFor="region">Region</Label>
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((region) => (
                      <SelectItem key={region.id} value={region.id}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="storage-class">Storage Class</Label>
                <Select value={selectedStorageClass} onValueChange={setSelectedStorageClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select storage class" />
                  </SelectTrigger>
                  <SelectContent>
                    {storageClasses.map((storageClass) => (
                      <SelectItem key={storageClass.id} value={storageClass.id}>
                        <div>
                          <div className="font-medium">{storageClass.name}</div>
                          <div className="text-xs text-gray-500">{storageClass.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={createBucket} className="w-full">
                Create Bucket
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Buckets</CardTitle>
            <HardDrive className="h-4 w-4 text-[#2563eb]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buckets.length}</div>
            <p className="text-xs text-muted-foreground">Storage buckets</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
            <FolderOpen className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStorageTB.toFixed(2)} TB</div>
            <p className="text-xs text-muted-foreground">{totalStorageGB.toLocaleString()} GB</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Objects</CardTitle>
            <Upload className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalObjects.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Stored objects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{totalMonthlyCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">£10.00 per TB</p>
          </CardContent>
        </Card>
      </div>

      {/* Buckets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Storage Buckets</CardTitle>
          <CardDescription>Manage your S3 storage buckets</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bucket Name</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Size (TB)</TableHead>
                <TableHead>Objects</TableHead>
                <TableHead>Storage Class</TableHead>
                <TableHead>Versioning</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buckets.map((bucket) => {
                const sizeInTB = bucket.sizeGB / 1024;
                const monthlyCost = calculateMonthlyCost(bucket.sizeGB, bucket.storageClass);
                return (
                  <TableRow key={bucket.id}>
                    <TableCell className="font-medium">{bucket.name}</TableCell>
                    <TableCell>{bucket.region}</TableCell>
                    <TableCell>{sizeInTB.toFixed(3)} TB</TableCell>
                    <TableCell>{bucket.objectCount.toLocaleString()}</TableCell>
                    <TableCell className="capitalize">{bucket.storageClass.replace('-', ' ')}</TableCell>
                    <TableCell>
                      <Badge variant={bucket.versioning ? "default" : "secondary"}>
                        {bucket.versioning ? "Enabled" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell>£{monthlyCost.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Upload className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteBucket(bucket.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default S3Dashboard;
