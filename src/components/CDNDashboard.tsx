
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
  Globe, 
  Plus,
  DollarSign,
  Activity,
  TrendingUp,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CDNDistribution {
  id: string;
  domain: string;
  origin: string;
  status: "deployed" | "pending" | "disabled";
  dataTransferTB: number;
  createdDate: string;
  cacheHitRatio: number;
}

const CDNDashboard = () => {
  const [distributions, setDistributions] = useState<CDNDistribution[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("");
  const [newOrigin, setNewOrigin] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadDistributions();
  }, []);

  const loadDistributions = () => {
    const savedDistributions = localStorage.getItem('cdn-distributions');
    if (savedDistributions) {
      setDistributions(JSON.parse(savedDistributions));
    } else {
      const defaultDistributions: CDNDistribution[] = [
        {
          id: "cdn-1",
          domain: "d1234567890.cloudfront.net",
          origin: "my-app.example.com",
          status: "deployed",
          dataTransferTB: 5.2,
          createdDate: "2024-01-15",
          cacheHitRatio: 89.5
        },
        {
          id: "cdn-2",
          domain: "d0987654321.cloudfront.net",
          origin: "api.example.com",
          status: "deployed",
          dataTransferTB: 3.8,
          createdDate: "2024-01-12",
          cacheHitRatio: 92.1
        },
        {
          id: "cdn-3",
          domain: "d1122334455.cloudfront.net",
          origin: "assets.example.com",
          status: "deployed",
          dataTransferTB: 8.0,
          createdDate: "2024-01-08",
          cacheHitRatio: 95.3
        }
      ];
      setDistributions(defaultDistributions);
      saveDistributions(defaultDistributions);
    }
  };

  const saveDistributions = (distributionList: CDNDistribution[]) => {
    localStorage.setItem('cdn-distributions', JSON.stringify(distributionList));
  };

  const createDistribution = () => {
    if (!newDomain || !newOrigin) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newDistribution: CDNDistribution = {
      id: `cdn-${Date.now()}`,
      domain: `d${Math.random().toString(36).substr(2, 10)}.cloudfront.net`,
      origin: newOrigin,
      status: "pending",
      dataTransferTB: 0,
      createdDate: new Date().toISOString().split('T')[0],
      cacheHitRatio: 0
    };

    const updatedDistributions = [...distributions, newDistribution];
    setDistributions(updatedDistributions);
    saveDistributions(updatedDistributions);

    toast({
      title: "Distribution Created",
      description: `CDN distribution for ${newOrigin} has been created`,
    });

    setIsCreateDialogOpen(false);
    setNewDomain("");
    setNewOrigin("");

    // Simulate distribution becoming deployed after creation
    setTimeout(() => {
      const finalDistributions = updatedDistributions.map(d => 
        d.id === newDistribution.id ? { ...d, status: "deployed" as const } : d
      );
      setDistributions(finalDistributions);
      saveDistributions(finalDistributions);
    }, 3000);
  };

  const totalDataTransfer = distributions.reduce((sum, dist) => sum + dist.dataTransferTB, 0);
  const monthlyCost = totalDataTransfer * 15.00; // £15.00 per TB
  const averageCacheHitRatio = distributions.length > 0 
    ? distributions.reduce((sum, dist) => sum + dist.cacheHitRatio, 0) / distributions.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Content Delivery Network</h1>
          <p className="text-gray-600">Global content delivery with low latency and high performance</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2563eb] hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Distribution
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create CDN Distribution</DialogTitle>
              <DialogDescription>
                Create a new content delivery network distribution
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="origin">Origin Domain</Label>
                <Input
                  id="origin"
                  value={newOrigin}
                  onChange={(e) => setNewOrigin(e.target.value)}
                  placeholder="example.com"
                />
              </div>
              <div>
                <Label htmlFor="domain">Custom Domain (Optional)</Label>
                <Input
                  id="domain"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  placeholder="cdn.example.com"
                />
              </div>
              <Button onClick={createDistribution} className="w-full">
                Create Distribution
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distributions</CardTitle>
            <Globe className="h-4 w-4 text-[#2563eb]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{distributions.length}</div>
            <p className="text-xs text-muted-foreground">Active CDN distributions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Transfer</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDataTransfer.toFixed(1)} TB</div>
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
            <p className="text-xs text-muted-foreground">£15.00 per TB</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Ratio</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageCacheHitRatio.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average across all distributions</p>
          </CardContent>
        </Card>
      </div>

      {/* Distributions Table */}
      <Card>
        <CardHeader>
          <CardTitle>CDN Distributions</CardTitle>
          <CardDescription>Manage your content delivery network distributions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data Transfer (TB)</TableHead>
                <TableHead>Cache Hit Ratio</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {distributions.map((distribution) => {
                const distributionCost = distribution.dataTransferTB * 15.00;
                return (
                  <TableRow key={distribution.id}>
                    <TableCell className="font-medium">{distribution.domain}</TableCell>
                    <TableCell>{distribution.origin}</TableCell>
                    <TableCell>
                      <Badge variant={distribution.status === "deployed" ? "default" : "secondary"}>
                        {distribution.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{distribution.dataTransferTB.toFixed(2)} TB</TableCell>
                    <TableCell>{distribution.cacheHitRatio.toFixed(1)}%</TableCell>
                    <TableCell>£{distributionCost.toFixed(2)}</TableCell>
                    <TableCell>{distribution.createdDate}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3" />
                      </Button>
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

export default CDNDashboard;
