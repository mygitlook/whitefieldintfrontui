
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Network, 
  DollarSign,
  TrendingUp,
  Globe,
  Download,
  Upload
} from "lucide-react";

interface DataTransferRecord {
  id: string;
  type: "outbound" | "inbound";
  region: string;
  transferredTB: number;
  date: string;
  cost: number;
}

const DataTransferDashboard = () => {
  const [transfers, setTransfers] = useState<DataTransferRecord[]>([]);

  useEffect(() => {
    loadTransfers();
  }, []);

  const loadTransfers = () => {
    const savedTransfers = localStorage.getItem('data-transfers');
    if (savedTransfers) {
      setTransfers(JSON.parse(savedTransfers));
    } else {
      const defaultTransfers: DataTransferRecord[] = [
        {
          id: "dt-1",
          type: "outbound",
          region: "eu-west-1",
          transferredTB: 5.2,
          date: "2024-01-25",
          cost: 0.31
        },
        {
          id: "dt-2",
          type: "outbound",
          region: "us-east-1",
          transferredTB: 3.8,
          date: "2024-01-24",
          cost: 0.23
        },
        {
          id: "dt-3",
          type: "outbound",
          region: "eu-west-2",
          transferredTB: 2.1,
          date: "2024-01-23",
          cost: 0.13
        },
        {
          id: "dt-4",
          type: "outbound",
          region: "ap-southeast-1",
          transferredTB: 4.9,
          date: "2024-01-22",
          cost: 0.29
        }
      ];
      setTransfers(defaultTransfers);
      saveTransfers(defaultTransfers);
    }
  };

  const saveTransfers = (transferList: DataTransferRecord[]) => {
    localStorage.setItem('data-transfers', JSON.stringify(transferList));
  };

  const totalTransferTB = transfers.reduce((sum, transfer) => sum + transfer.transferredTB, 0);
  const totalCost = transfers.reduce((sum, transfer) => sum + transfer.cost, 0);
  const outboundTransfers = transfers.filter(t => t.type === "outbound");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Data Transfer</h1>
        <p className="text-gray-600">Monitor outbound data transfer usage and costs</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transfer</CardTitle>
            <Network className="h-4 w-4 text-[#2563eb]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransferTB.toFixed(1)} TB</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outbound Transfer</CardTitle>
            <Upload className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{outboundTransfers.reduce((sum, t) => sum + t.transferredTB, 0).toFixed(1)} TB</div>
            <p className="text-xs text-muted-foreground">Data sent out</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{totalCost.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">£0.06 per TB</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regions</CardTitle>
            <Globe className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(transfers.map(t => t.region)).size}</div>
            <p className="text-xs text-muted-foreground">Active regions</p>
          </CardContent>
        </Card>
      </div>

      {/* Transfer Records */}
      <Card>
        <CardHeader>
          <CardTitle>Data Transfer Records</CardTitle>
          <CardDescription>Monitor your data transfer usage by region</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Transfer (TB)</TableHead>
                <TableHead>Cost (£)</TableHead>
                <TableHead>Rate per TB</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>{transfer.date}</TableCell>
                  <TableCell>
                    <Badge variant={transfer.type === "outbound" ? "default" : "secondary"}>
                      {transfer.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{transfer.region}</TableCell>
                  <TableCell>{transfer.transferredTB.toFixed(2)} TB</TableCell>
                  <TableCell>£{transfer.cost.toFixed(2)}</TableCell>
                  <TableCell>£0.06</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataTransferDashboard;
