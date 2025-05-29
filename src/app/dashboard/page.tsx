"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, LineChart, PieChartIcon, TrendingUp, AlertTriangle, ShieldCheck, Users, Edit, Settings, FileDown } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell  } from 'recharts';
import Link from 'next/link';
import { useAppContext } from '@/context/app-context';
import { useEffect, useState } from 'react';

// Mock data
const mockStats = {
  totalIncidentsToday: 5,
  trend: 0.2, // +20%
  highSeverityIncidents: 1,
  activeSites: 3,
  totalOfficers: 12,
};

const mockRecentIncidents = [
  { id: 'INC001', site: 'Downtown Office', officer: 'John Doe', datetime: '2024-07-28 10:00', category: 'Theft', severity: 8, status: 'Open' },
  { id: 'INC002', site: 'Warehouse A', officer: 'Jane Smith', datetime: '2024-07-28 09:30', category: 'Vandalism', severity: 5, status: 'Investigating' },
  { id: 'INC003', site: 'Retail Outlet', officer: 'Mike Brown', datetime: '2024-07-27 18:00', category: 'Suspicious Activity', severity: 3, status: 'Resolved' },
  { id: 'INC004', site: 'Downtown Office', officer: 'Sarah Lee', datetime: '2024-07-27 15:00', category: 'Access Control Breach', severity: 9, status: 'Open' },
  { id: 'INC005', site: 'Healthcare Clinic', officer: 'David Green', datetime: '2024-07-27 12:00', category: 'Medical Emergency', severity: 6, status: 'Closed' },
];

const incidentTrendsData = [
  { name: 'Mon', incidents: 4 }, { name: 'Tue', incidents: 3 },
  { name: 'Wed', incidents: 5 }, { name: 'Thu', incidents: 2 },
  { name: 'Fri', incidents: 6 }, { name: 'Sat', incidents: 7 },
  { name: 'Sun', incidents: 5 },
];

const categoryBreakdownData = [
  { name: 'Theft', value: 400, fill: "var(--color-theft)" },
  { name: 'Vandalism', value: 300, fill: "var(--color-vandalism)" },
  { name: 'Access Breach', value: 300, fill: "var(--color-access)" },
  { name: 'Medical', value: 200, fill: "var(--color-medical)" },
];
const chartConfig = {
  incidents: { label: "Incidents", color: "hsl(var(--primary))" },
  theft: { label: "Theft", color: "hsl(var(--chart-1))" },
  vandalism: { label: "Vandalism", color: "hsl(var(--chart-2))" },
  access: { label: "Access Breach", color: "hsl(var(--chart-3))" },
  medical: { label: "Medical", color: "hsl(var(--chart-4))" },
} satisfies import('@/components/ui/chart').ChartConfig;


export default function DashboardPage() {
  const { isSetupComplete } = useAppContext();
  const [clientStats, setClientStats] = useState(mockStats);
  const [clientIncidents, setClientIncidents] = useState(mockRecentIncidents);

  useEffect(() => {
    // Simulate real-time data refresh
    const intervalId = setInterval(() => {
      // In a real app, fetch data here
      // For mock, slightly change data to show updates
      setClientStats(prev => ({ ...prev, totalIncidentsToday: prev.totalIncidentsToday + Math.floor(Math.random() * 3) -1 || 1 }));
      // Add a new mock incident sometimes
      if (Math.random() > 0.7) {
        const newId = `INC${String(clientIncidents.length + 101).padStart(3, '0')}`;
        const newIncident = { id: newId, site: 'New Site', officer: 'New Officer', datetime: new Date().toISOString().slice(0,16).replace('T',' '), category: 'Alert', severity: Math.ceil(Math.random()*10), status: 'Open' };
        setClientIncidents(prev => [newIncident, ...prev.slice(0,4)]);
      }
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, [clientIncidents.length]);


  if (!isSetupComplete) {
    // This should ideally be handled by the root page redirect or a middleware
    return <div className="p-4 text-center">Setup not complete. Please go to /setup.</div>;
  }

  const getSeverityBadgeVariant = (severity: number) => {
    if (severity >= 7) return 'destructive';
    if (severity >= 4) return 'secondary'; // Using secondary for medium, as 'warning' is not a default badge variant
    return 'default'; // Using default for low
  };


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>

      {/* Header Stats Bar */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientStats.totalIncidentsToday}</div>
            <p className={`text-xs ${clientStats.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {clientStats.trend >= 0 ? '+' : ''}{(clientStats.trend * 100).toFixed(0)}% from yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Severity Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientStats.highSeverityIncidents}</div>
            <p className="text-xs text-muted-foreground">Requiring immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sites</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientStats.activeSites}</div>
            <p className="text-xs text-muted-foreground">Currently monitored locations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Officers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientStats.totalOfficers}</div>
            <p className="text-xs text-muted-foreground">In the system</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Incidents Table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
            <CardDescription>Last {clientIncidents.length} incidents reported.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Severity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientIncidents.map((incident) => (
                  <TableRow key={incident.id} className="hover:bg-muted/50 cursor-pointer">
                    <TableCell className="font-medium">{incident.id}</TableCell>
                    <TableCell>{incident.site}</TableCell>
                    <TableCell>{incident.category}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={getSeverityBadgeVariant(incident.severity)}>{incident.severity}</Badge>
                    </TableCell>
                    <TableCell><Badge variant={incident.status === 'Open' ? 'destructive' : 'outline'}>{incident.status}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/incidents/report"><Edit className="mr-2 h-4 w-4" /> Report New Incident</Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/admin"><Users className="mr-2 h-4 w-4" /> Add Site/Officer</Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" disabled>
              <FileDown className="mr-2 h-4 w-4" /> Export Data
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/setup"><Settings className="mr-2 h-4 w-4" /> System Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold mb-2">Incident Trends (Last 7 Days)</h3>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incidentTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="incidents" fill="var(--color-incidents)" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Category Breakdown</h3>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <Pie data={categoryBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                     {categoryBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                  </Pie>
                   <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
