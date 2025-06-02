
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Network, Plus, Activity, Shield } from "lucide-react";

const ElasticLoadBalancerDashboard = () => {
  const [loadBalancers] = useState([
    {
      name: "web-app-alb",
      type: "Application Load Balancer",
      scheme: "internet-facing",
      state: "active",
      dnsName: "web-app-alb-123456789.us-east-1.elb.amazonaws.com",
      vpc: "vpc-0987654321fedcba0",
      azs: ["us-east-1a", "us-east-1b"],
      targets: 3,
      healthyTargets: 3
    },
    {
      name: "internal-nlb",
      type: "Network Load Balancer",
      scheme: "internal",
      state: "active",
      dnsName: "internal-nlb-987654321.us-east-1.elb.amazonaws.com",
      vpc: "vpc-0987654321fedcba0",
      azs: ["us-east-1a", "us-east-1c"],
      targets: 2,
      healthyTargets: 1
    }
  ]);

  const [targetGroups] = useState([
    {
      name: "web-servers-tg",
      protocol: "HTTP",
      port: 80,
      healthyTargets: 3,
      totalTargets: 3,
      healthCheck: "/health"
    },
    {
      name: "api-servers-tg",
      protocol: "HTTPS",
      port: 443,
      healthyTargets: 1,
      totalTargets: 2,
      healthCheck: "/api/health"
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Elastic Load Balancer</h1>
          <p className="text-gray-600">Distribute incoming traffic across targets</p>
        </div>
        <Button className="bg-[#FF9900] hover:bg-[#e8890a]">
          <Plus className="h-4 w-4 mr-2" />
          Create Load Balancer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Load Balancers</CardTitle>
            <Network className="h-4 w-4 text-[#FF9900]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadBalancers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target Groups</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{targetGroups.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Targets</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy Targets</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">4</div>
          </CardContent>
        </Card>
      </div>

      {/* Load Balancers */}
      <Card>
        <CardHeader>
          <CardTitle>Load Balancers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Scheme</TableHead>
                <TableHead>State</TableHead>
                <TableHead>DNS Name</TableHead>
                <TableHead>VPC</TableHead>
                <TableHead>Availability Zones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loadBalancers.map((lb, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{lb.name}</TableCell>
                  <TableCell>{lb.type}</TableCell>
                  <TableCell>{lb.scheme}</TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-800">{lb.state}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm max-w-xs truncate">{lb.dnsName}</TableCell>
                  <TableCell className="font-mono text-sm">{lb.vpc}</TableCell>
                  <TableCell>{lb.azs.join(", ")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Target Groups */}
      <Card>
        <CardHeader>
          <CardTitle>Target Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Protocol</TableHead>
                <TableHead>Port</TableHead>
                <TableHead>Health Check Path</TableHead>
                <TableHead>Targets</TableHead>
                <TableHead>Healthy Targets</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {targetGroups.map((tg, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{tg.name}</TableCell>
                  <TableCell>{tg.protocol}</TableCell>
                  <TableCell>{tg.port}</TableCell>
                  <TableCell className="font-mono">{tg.healthCheck}</TableCell>
                  <TableCell>{tg.totalTargets}</TableCell>
                  <TableCell>
                    <span className={tg.healthyTargets === tg.totalTargets ? "text-green-600" : "text-orange-600"}>
                      {tg.healthyTargets}/{tg.totalTargets}
                    </span>
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

export default ElasticLoadBalancerDashboard;
