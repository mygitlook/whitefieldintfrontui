
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Globe, Plus, Shield, Network } from "lucide-react";

const VPCDashboard = () => {
  const [vpcs] = useState([
    {
      id: "vpc-0123456789abcdef0",
      name: "Default VPC",
      cidr: "172.31.0.0/16",
      state: "available",
      subnets: 6,
      routeTables: 1,
      internetGateways: 1,
      region: "us-east-1"
    },
    {
      id: "vpc-0987654321fedcba0",
      name: "Production VPC",
      cidr: "10.0.0.0/16",
      state: "available",
      subnets: 4,
      routeTables: 3,
      internetGateways: 1,
      region: "us-east-1"
    }
  ]);

  const [subnets] = useState([
    {
      id: "subnet-0123456789abcdef0",
      name: "Public Subnet 1",
      vpcId: "vpc-0123456789abcdef0",
      cidr: "172.31.0.0/20",
      az: "us-east-1a",
      type: "public",
      availableIps: 4091
    },
    {
      id: "subnet-0987654321fedcba0",
      name: "Private Subnet 1",
      vpcId: "vpc-0987654321fedcba0",
      cidr: "10.0.1.0/24",
      az: "us-east-1a",
      type: "private",
      availableIps: 251
    },
    {
      id: "subnet-0246813579bdfeca0",
      name: "Private Subnet 2",
      vpcId: "vpc-0987654321fedcba0",
      cidr: "10.0.2.0/24",
      az: "us-east-1b",
      type: "private",
      availableIps: 251
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">VPC Dashboard</h1>
          <p className="text-gray-600">Virtual Private Cloud</p>
        </div>
        <Button className="bg-[#FF9900] hover:bg-[#e8890a]">
          <Plus className="h-4 w-4 mr-2" />
          Create VPC
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total VPCs</CardTitle>
            <Globe className="h-4 w-4 text-[#FF9900]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vpcs.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subnets</CardTitle>
            <Network className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subnets.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Internet Gateways</CardTitle>
            <Globe className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Groups</CardTitle>
            <Shield className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
      </div>

      {/* VPCs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your VPCs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>VPC ID</TableHead>
                <TableHead>State</TableHead>
                <TableHead>IPv4 CIDR</TableHead>
                <TableHead>Subnets</TableHead>
                <TableHead>Route Tables</TableHead>
                <TableHead>Internet Gateways</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vpcs.map((vpc) => (
                <TableRow key={vpc.id}>
                  <TableCell className="font-medium">{vpc.name}</TableCell>
                  <TableCell className="font-mono text-sm">{vpc.id}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">{vpc.state}</Badge>
                  </TableCell>
                  <TableCell className="font-mono">{vpc.cidr}</TableCell>
                  <TableCell>{vpc.subnets}</TableCell>
                  <TableCell>{vpc.routeTables}</TableCell>
                  <TableCell>{vpc.internetGateways}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Subnets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Subnets</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Subnet ID</TableHead>
                <TableHead>VPC</TableHead>
                <TableHead>IPv4 CIDR</TableHead>
                <TableHead>Availability Zone</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Available IPs</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subnets.map((subnet) => (
                <TableRow key={subnet.id}>
                  <TableCell className="font-medium">{subnet.name}</TableCell>
                  <TableCell className="font-mono text-sm">{subnet.id}</TableCell>
                  <TableCell className="font-mono text-sm">{subnet.vpcId}</TableCell>
                  <TableCell className="font-mono">{subnet.cidr}</TableCell>
                  <TableCell>{subnet.az}</TableCell>
                  <TableCell>
                    <Badge 
                      className={subnet.type === 'public' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}
                    >
                      {subnet.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{subnet.availableIps}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VPCDashboard;
