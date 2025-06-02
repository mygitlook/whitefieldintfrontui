
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
  Archive, 
  Plus,
  DollarSign,
  HardDrive,
  Download,
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ArchiveVault {
  id: string;
  name: string;
  description: string;
  sizeGB: number;
  createdDate: string;
  retrievalTier: "standard" | "bulk" | "expedited";
  status: "active" | "creating" | "deleting";
}

const ArchiveStorageDashboard = () => {
  const [vaults, setVaults] = useState<ArchiveVault[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newVaultName, setNewVaultName] = useState("");
  const [newVaultDescription, setNewVaultDescription] = useState("");
  const [selectedTier, setSelectedTier] = useState("standard");
  const { toast } = useToast();

  useEffect(() => {
    loadVaults();
  }, []);

  const loadVaults = () => {
    const savedVaults = localStorage.getItem('archive-vaults');
    if (savedVaults) {
      setVaults(JSON.parse(savedVaults));
    } else {
      const defaultVaults: ArchiveVault[] = [
        {
          id: "vault-1",
          name: "backup-vault-2024",
          description: "Long-term backup storage",
          sizeGB: 1024,
          createdDate: "2024-01-15",
          retrievalTier: "standard",
          status: "active"
        },
        {
          id: "vault-2",
          name: "compliance-archives",
          description: "Regulatory compliance data",
          sizeGB: 2048,
          createdDate: "2024-01-10",
          retrievalTier: "bulk",
          status: "active"
        }
      ];
      setVaults(defaultVaults);
      saveVaults(defaultVaults);
    }
  };

  const saveVaults = (vaultList: ArchiveVault[]) => {
    localStorage.setItem('archive-vaults', JSON.stringify(vaultList));
  };

  const createVault = () => {
    if (!newVaultName || !newVaultDescription) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const newVault: ArchiveVault = {
      id: `vault-${Date.now()}`,
      name: newVaultName,
      description: newVaultDescription,
      sizeGB: 0,
      createdDate: new Date().toISOString().split('T')[0],
      retrievalTier: selectedTier as "standard" | "bulk" | "expedited",
      status: "creating"
    };

    const updatedVaults = [...vaults, newVault];
    setVaults(updatedVaults);
    saveVaults(updatedVaults);

    toast({
      title: "Vault Created",
      description: `${newVaultName} has been created successfully`,
    });

    setIsCreateDialogOpen(false);
    setNewVaultName("");
    setNewVaultDescription("");
    setSelectedTier("standard");

    // Simulate vault becoming active after creation
    setTimeout(() => {
      const finalVaults = updatedVaults.map(v => 
        v.id === newVault.id ? { ...v, status: "active" as const } : v
      );
      setVaults(finalVaults);
      saveVaults(finalVaults);
    }, 2000);
  };

  const deleteVault = (id: string) => {
    const vault = vaults.find(v => v.id === id);
    const updatedVaults = vaults.filter(v => v.id !== id);
    setVaults(updatedVaults);
    saveVaults(updatedVaults);
    
    toast({
      title: "Vault Deleted",
      description: `${vault?.name} has been deleted`,
      variant: "destructive",
    });
  };

  const totalStorageGB = vaults.reduce((sum, vault) => sum + vault.sizeGB, 0);
  const totalStorageTB = totalStorageGB / 1024;
  const monthlyCost = totalStorageTB * 3.01; // £3.01 per TB

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Archive Storage</h1>
          <p className="text-gray-600">Long-term data archival with secure, durable storage</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#2563eb] hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Vault
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Archive Vault</DialogTitle>
              <DialogDescription>
                Create a new vault for long-term data archival
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="vault-name">Vault Name</Label>
                <Input
                  id="vault-name"
                  value={newVaultName}
                  onChange={(e) => setNewVaultName(e.target.value)}
                  placeholder="Enter vault name"
                />
              </div>
              <div>
                <Label htmlFor="vault-description">Description</Label>
                <Input
                  id="vault-description"
                  value={newVaultDescription}
                  onChange={(e) => setNewVaultDescription(e.target.value)}
                  placeholder="Enter vault description"
                />
              </div>
              <div>
                <Label htmlFor="retrieval-tier">Retrieval Tier</Label>
                <Select value={selectedTier} onValueChange={setSelectedTier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select retrieval tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard (3-5 hours)</SelectItem>
                    <SelectItem value="bulk">Bulk (5-12 hours)</SelectItem>
                    <SelectItem value="expedited">Expedited (1-5 minutes)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={createVault} className="w-full">
                Create Vault
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vaults</CardTitle>
            <Archive className="h-4 w-4 text-[#2563eb]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vaults.length}</div>
            <p className="text-xs text-muted-foreground">Active archive vaults</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Storage</CardTitle>
            <HardDrive className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStorageTB.toFixed(2)} TB</div>
            <p className="text-xs text-muted-foreground">{totalStorageGB.toLocaleString()} GB total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{monthlyCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">£3.01 per TB</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Vaults</CardTitle>
            <Archive className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vaults.filter(v => v.status === "active").length}</div>
            <p className="text-xs text-muted-foreground">Ready for storage</p>
          </CardContent>
        </Card>
      </div>

      {/* Vaults Table */}
      <Card>
        <CardHeader>
          <CardTitle>Archive Vaults</CardTitle>
          <CardDescription>Manage your long-term storage vaults</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vault Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Size (TB)</TableHead>
                <TableHead>Retrieval Tier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Monthly Cost</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vaults.map((vault) => {
                const sizeInTB = vault.sizeGB / 1024;
                const vaultCost = sizeInTB * 3.01;
                return (
                  <TableRow key={vault.id}>
                    <TableCell className="font-medium">{vault.name}</TableCell>
                    <TableCell>{vault.description}</TableCell>
                    <TableCell>{sizeInTB.toFixed(2)} TB</TableCell>
                    <TableCell className="capitalize">{vault.retrievalTier}</TableCell>
                    <TableCell>
                      <Badge variant={vault.status === "active" ? "default" : "secondary"}>
                        {vault.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{vault.createdDate}</TableCell>
                    <TableCell>£{vaultCost.toFixed(2)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteVault(vault.id)}
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

export default ArchiveStorageDashboard;
