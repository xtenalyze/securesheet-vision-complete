"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PlusCircle, Edit2, Trash2, Building, User, ListChecks, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useState } from "react";
import { useForm, Controller } from "react-hook-form"; // For forms

// Mock data - replace with actual data fetching
const mockSites = [{ id: "S001", name: "Main Office", address: "123 Main St", type: "Office", risk: "Medium" }];
const mockOfficers = [{ id: "O001", name: "John Doe", email: "john@example.com", phone: "555-1234", hireDate: "2023-01-15" }];
const mockCategories = [{ id: "C001", name: "Theft", severity: 7, notification: "Yes" }];
const mockShifts = [{ id: "SH001", site: "Main Office", name: "Morning Shift", time: "08:00-16:00", days: "Mon-Fri" }];


interface AdminSectionProps {
  title: string;
  description: string;
  formFields: { name: string; label: string; type: string; options?: string[]; required?: boolean; placeholder?: string }[];
  tableHeaders: string[];
  tableData: any[]; // Use specific types in real app
  icon: React.ElementType;
}

const AdminSectionContent = ({ title, description, formFields, tableHeaders, tableData, icon: Icon }: AdminSectionProps) => {
  const { control, handleSubmit, reset } = useForm();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const onSubmit = (data: any) => {
    console.log(`Submitting ${title}:`, data);
    // Add logic to save data (e.g., API call)
    reset();
    setShowForm(false);
    setEditingItem(null);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    reset(item); // Pre-fill form with item data
    setShowForm(true);
  };

  const handleDelete = (itemId: string) => {
    console.log(`Deleting ${title} item ID:`, itemId);
    // Add logic to delete data
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Icon className="h-6 w-6 mr-2 text-primary" />
            <CardTitle>{title} Management</CardTitle>
          </div>
          <Button onClick={() => { setShowForm(!showForm); setEditingItem(null); reset(); }} variant="outline" size="sm">
            <PlusCircle className="h-4 w-4 mr-2" /> {showForm ? `Cancel` : `Add New ${title.slice(0,-1)}`}
          </Button>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {showForm && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6 p-4 border rounded-md bg-muted/30">
            <h3 className="text-lg font-semibold">{editingItem ? `Edit ${title.slice(0,-1)}` : `Add New ${title.slice(0,-1)}`}</h3>
            {formFields.map(field => (
              <div key={field.name} className="space-y-1">
                <Label htmlFor={field.name}>{field.label} {field.required && "*"}</Label>
                <Controller
                  name={field.name}
                  control={control}
                  rules={{ required: field.required }}
                  render={({ field: controllerField }) => {
                    if (field.type === "select") {
                      return (
                        <Select onValueChange={controllerField.onChange} defaultValue={controllerField.value}>
                          <SelectTrigger id={field.name}><SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} /></SelectTrigger>
                          <SelectContent>{field.options?.map(opt => <SelectItem key={opt} value={opt.toLowerCase()}>{opt}</SelectItem>)}</SelectContent>
                        </Select>
                      );
                    }
                    if (field.type === "textarea") {
                      return <Textarea id={field.name} placeholder={field.placeholder} {...controllerField} />;
                    }
                    if (field.type === "checkbox_group") { // For Days of Week
                       return (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                          {field.options?.map(opt => (
                            <div key={opt} className="flex items-center space-x-2">
                               <Checkbox 
                                id={`${field.name}-${opt}`} 
                                checked={controllerField.value?.includes(opt)}
                                onCheckedChange={(checked) => {
                                  const currentValues = controllerField.value || [];
                                  if (checked) {
                                    controllerField.onChange([...currentValues, opt]);
                                  } else {
                                    controllerField.onChange(currentValues.filter((val: string) => val !== opt));
                                  }
                                }}
                               />
                               <Label htmlFor={`${field.name}-${opt}`} className="font-normal">{opt}</Label>
                            </div>
                          ))}
                        </div>
                       );
                    }
                    if (field.type === "radio_group") {
                       return (
                        <RadioGroup onValueChange={controllerField.onChange} defaultValue={controllerField.value} className="flex space-x-4">
                          {field.options?.map(opt => (
                            <div key={opt} className="flex items-center space-x-2">
                              <RadioGroupItem value={opt.toLowerCase()} id={`${field.name}-${opt.toLowerCase()}`} />
                              <Label htmlFor={`${field.name}-${opt.toLowerCase()}`} className="font-normal">{opt}</Label>
                            </div>
                          ))}
                        </RadioGroup>
                       );
                    }
                    return <Input id={field.name} type={field.type} placeholder={field.placeholder} {...controllerField} />;
                  }}
                />
              </div>
            ))}
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">{editingItem ? "Save Changes" : "Add Item"}</Button>
          </form>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              {tableHeaders.map(header => <TableHead key={header}>{header}</TableHead>)}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((item) => (
              <TableRow key={item.id}>
                {Object.values(item).map((value: any, index) => <TableCell key={index}>{Array.isArray(value) ? value.join(', ') : value}</TableCell>)}
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}><Edit2 className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
            {tableData.length === 0 && (
              <TableRow><TableCell colSpan={tableHeaders.length + 1} className="text-center">No data available.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};


export default function AdminPage() {
  const siteFormFields = [
    { name: "site_name", label: "Site Name", type: "text", required: true, placeholder: "e.g., Corporate HQ" },
    { name: "site_address", label: "Site Address", type: "text", required: true, placeholder: "e.g., 123 Business Rd, City" },
    { name: "site_type", label: "Site Type", type: "select", options: ["Office", "Retail", "Warehouse", "Healthcare", "Educational", "Industrial", "Government", "Residential", "Other"], required: true },
    { name: "contact_email", label: "Primary Contact Email", type: "email", required: true, placeholder: "contact@example.com" },
    { name: "supervisor_email", label: "Supervisor Email", type: "email", placeholder: "supervisor@example.com" },
    { name: "risk_level", label: "Risk Level", type: "select", options: ["Low", "Medium", "High"], required: true },
    { name: "operating_hours", label: "Operating Hours", type: "text", placeholder: "e.g., 9 AM - 5 PM, Mon-Fri" },
  ];

  const officerFormFields = [
    { name: "first_name", label: "First Name", type: "text", required: true },
    { name: "last_name", label: "Last Name", type: "text", required: true },
    { name: "email", label: "Email Address", type: "email", required: true },
    { name: "phone", label: "Phone Number", type: "tel", required: true },
    { name: "badge_number", label: "Badge/ID Number", type: "text" },
    { name: "hire_date", label: "Hire Date", type: "date", required: true },
    { name: "certifications", label: "Certifications/Training", type: "textarea", placeholder: "List qualifications..." },
  ];

  const categoryFormFields = [
    { name: "category_name", label: "Category Name", type: "text", required: true, placeholder: "e.g., Unauthorized Access" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "default_severity", label: "Default Severity (1-10)", type: "number", required: true, placeholder: "5" },
    { name: "requires_notification", label: "Requires Immediate Notification?", type: "radio_group", options: ["Yes", "No"], required: true },
    { name: "response_protocol", label: "Response Protocol", type: "textarea", placeholder: "Standard procedures..." },
  ];

  const shiftFormFields = [
    { name: "site_location", label: "Site Location", type: "select", options: mockSites.map(s => s.name), required: true, placeholder: "Select site" },
    { name: "shift_name", label: "Shift Name", type: "select", options: ["Morning", "Afternoon", "Evening", "Night", "Weekend", "Holiday", "Custom"], required: true },
    { name: "start_time", label: "Start Time", type: "time", required: true },
    { name: "end_time", label: "End Time", type: "time", required: true },
    { name: "days_of_week", label: "Days of Week", type: "checkbox_group", options: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], required: true },
    { name: "assigned_officer", label: "Assigned Officer", type: "select", options: mockOfficers.map(o => o.name), placeholder: "Select officer" },
    { name: "backup_officer", label: "Backup Officer", type: "select", options: mockOfficers.map(o => o.name), placeholder: "Select officer" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Admin Configuration</h1>
      <Tabs defaultValue="sites" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="sites"><Building className="inline-block h-4 w-4 mr-1 sm:mr-2" />Sites</TabsTrigger>
          <TabsTrigger value="officers"><User className="inline-block h-4 w-4 mr-1 sm:mr-2" />Officers</TabsTrigger>
          <TabsTrigger value="categories"><ListChecks className="inline-block h-4 w-4 mr-1 sm:mr-2" />Categories</TabsTrigger>
          <TabsTrigger value="shifts"><Clock className="inline-block h-4 w-4 mr-1 sm:mr-2" />Shifts</TabsTrigger>
        </TabsList>
        <TabsContent value="sites">
          <AdminSectionContent 
            title="Sites" 
            description="Manage site locations where incidents can occur."
            formFields={siteFormFields}
            tableHeaders={["ID", "Name", "Address", "Type", "Risk Level"]}
            tableData={mockSites.map(s => ({ id: s.id, name: s.name, address: s.address, type: s.type, risk: s.risk }))}
            icon={Building}
          />
        </TabsContent>
        <TabsContent value="officers">
          <AdminSectionContent 
            title="Security Officers"
            description="Manage security officer profiles and contact information."
            formFields={officerFormFields}
            tableHeaders={["ID", "Name", "Email", "Phone", "Hire Date"]}
            tableData={mockOfficers.map(o => ({ id: o.id, name: o.name, email: o.email, phone: o.phone, hireDate: o.hireDate }))}
            icon={User}
          />
        </TabsContent>
        <TabsContent value="categories">
          <AdminSectionContent 
            title="Incident Categories"
            description="Define types of incidents and their default properties."
            formFields={categoryFormFields}
            tableHeaders={["ID", "Name", "Default Severity", "Immediate Notification?"]}
            tableData={mockCategories.map(c => ({ id: c.id, name: c.name, severity: c.severity, notification: c.notification }))}
            icon={ListChecks}
          />
        </TabsContent>
        <TabsContent value="shifts">
          <AdminSectionContent 
            title="Shift Schedules"
            description="Manage shift schedules for different sites and officers."
            formFields={shiftFormFields}
            tableHeaders={["ID", "Site", "Shift Name", "Time", "Days"]}
            tableData={mockShifts.map(s => ({ id: s.id, site: s.site, name: s.name, time: s.time, days: s.days }))}
            icon={Clock}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
