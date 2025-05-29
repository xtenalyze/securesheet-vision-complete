"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Camera, MapPin, Mic, UploadCloud, Users, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const incidentSchema = z.object({
  site: z.string().min(1, "Site is required"),
  reportingOfficer: z.string().min(1, "Reporting officer is required"),
  incidentDateTime: z.string().min(1, "Date and time are required"), // Should be date
  shift: z.string().min(1, "Shift is required"),
  incidentType: z.string().min(1, "Incident type is required"),
  severityLevel: z.number().min(1).max(10),
  specificLocation: z.string().min(1, "Specific location is required"),
  detailedDescription: z.string().min(10, "Description must be at least 10 characters"),
  clientNotified: z.enum(["yes", "no", "not_required"]),
  authoritiesContacted: z.string(), // Could be enum: police, fire, medical, other, none
  authorityDetails: z.string().optional(),
  immediateActionsTaken: z.string().min(1, "Actions taken are required"),
  photosVideos: z.any().optional(), // File upload
  gpsCoordinates: z.string().optional(),
  witnessesPresent: z.enum(["yes", "no"]),
  witnessDetails: z.string().optional(),
  relatedToPreviousIncident: z.enum(["yes", "no"]),
  previousIncidentRef: z.string().optional(),
  followUpRequired: z.enum(["yes", "no"]),
  followUpDetails: z.string().optional(),
});

type IncidentFormData = z.infer<typeof incidentSchema>;

// Mock data for dropdowns
const mockSites = ["Downtown Office", "Warehouse A", "Retail Outlet", "Healthcare Clinic"];
const mockOfficers = ["John Doe", "Jane Smith", "Mike Brown", "Sarah Lee"];
const mockShifts = ["Morning (0600-1400)", "Afternoon (1400-2200)", "Night (2200-0600)"];
const mockIncidentTypes = ["Theft", "Vandalism", "Suspicious Activity", "Access Control Breach", "Medical Emergency", "Fire Alarm"];

const TOTAL_SECTIONS = 4;

export default function IncidentReportPage() {
  const [currentSection, setCurrentSection] = useState(1);
  const { toast } = useToast();
  const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<IncidentFormData>({
    resolver: zodResolver(incidentSchema),
    defaultValues: {
      incidentDateTime: new Date().toISOString().slice(0, 16),
      severityLevel: 5,
      clientNotified: "not_required",
      authoritiesContacted: "none",
      witnessesPresent: "no",
      relatedToPreviousIncident: "no",
      followUpRequired: "no",
    },
  });

  const authoritiesContacted = watch("authoritiesContacted");
  const witnessesPresent = watch("witnessesPresent");
  const relatedToPrevious = watch("relatedToPreviousIncident");
  const followUpRequired = watch("followUpRequired");

  const nextSection = () => setCurrentSection(prev => Math.min(prev + 1, TOTAL_SECTIONS));
  const prevSection = () => setCurrentSection(prev => Math.max(prev - 1, 1));

  const onSubmit: SubmitHandler<IncidentFormData> = (data) => {
    console.log(data);
    toast({
      title: "Incident Reported Successfully!",
      description: `Incident at ${data.site} has been logged.`,
    });
    // Reset form or redirect
  };
  
  // GPS and Voice-to-text are browser specific and need useEffect
  const [gpsCoords, setGpsCoords] = useState<string>("");
  useEffect(() => {
    if (currentSection === 4 && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = `${position.coords.latitude.toFixed(5)}, ${position.coords.longitude.toFixed(5)}`;
          setGpsCoords(coords);
          setValue("gpsCoordinates", coords);
        },
        () => { setGpsCoords("Unable to retrieve GPS."); }
      );
    }
  }, [currentSection, setValue]);


  const Section1 = () => (
    <CardContent className="space-y-4">
      <FormField name="site" label="Site" error={errors.site?.message}>
        <Controller
          name="site"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger><SelectValue placeholder="Select site" /></SelectTrigger>
              <SelectContent>{mockSites.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          )}
        />
      </FormField>
      <FormField name="reportingOfficer" label="Reporting Officer" error={errors.reportingOfficer?.message}>
         <Controller
          name="reportingOfficer"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger><SelectValue placeholder="Select officer" /></SelectTrigger>
              <SelectContent>{mockOfficers.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
            </Select>
          )}
        />
      </FormField>
      <FormField name="incidentDateTime" label="Date & Time of Incident" error={errors.incidentDateTime?.message}>
        <Controller name="incidentDateTime" control={control} render={({ field }) => <Input type="datetime-local" {...field} />} />
      </FormField>
      <FormField name="shift" label="Shift" error={errors.shift?.message}>
        <Controller
          name="shift"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger><SelectValue placeholder="Select shift" /></SelectTrigger>
              <SelectContent>{mockShifts.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          )}
        />
      </FormField>
    </CardContent>
  );

  const Section2 = () => (
    <CardContent className="space-y-4">
      <FormField name="incidentType" label="Incident Type" error={errors.incidentType?.message}>
         <Controller
          name="incidentType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger><SelectValue placeholder="Select incident type" /></SelectTrigger>
              <SelectContent>{mockIncidentTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          )}
        />
      </FormField>
      <FormField name="severityLevel" label="Severity Level (1-10)" error={errors.severityLevel?.message}>
        <Controller
          name="severityLevel"
          control={control}
          render={({ field: { onChange, value } }) => (
            <>
              <Slider defaultValue={[value]} min={1} max={10} step={1} onValueChange={(val) => onChange(val[0])} />
              <div className="text-center font-semibold text-primary">{value}</div>
            </>
          )}
        />
      </FormField>
      <FormField name="specificLocation" label="Specific Location on Site" error={errors.specificLocation?.message}>
        <Controller name="specificLocation" control={control} render={({ field }) => <Input placeholder="e.g., North Entrance, Parking Lot B2" {...field} />} />
      </FormField>
      <FormField name="detailedDescription" label="Detailed Description" error={errors.detailedDescription?.message}>
        <Controller name="detailedDescription" control={control} render={({ field }) => <Textarea rows={5} placeholder="Describe the incident in detail..." {...field} />} />
        <Button variant="outline" size="sm" className="mt-2 w-full sm:w-auto" disabled><Mic className="mr-2 h-4 w-4" /> Voice-to-Text (Not Implemented)</Button>
      </FormField>
    </CardContent>
  );
  
  const Section3 = () => (
    <CardContent className="space-y-4">
      <FormField name="clientNotified" label="Client Notified?" error={errors.clientNotified?.message}>
        <Controller name="clientNotified" control={control} render={({ field }) => (
          <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
            <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="cn_yes" /><Label htmlFor="cn_yes">Yes</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="cn_no" /><Label htmlFor="cn_no">No</Label></div>
            <div className="flex items-center space-x-2"><RadioGroupItem value="not_required" id="cn_nr" /><Label htmlFor="cn_nr">Not Required</Label></div>
          </RadioGroup>
        )} />
      </FormField>
      <FormField name="authoritiesContacted" label="Authorities Contacted?" error={errors.authoritiesContacted?.message}>
        <Controller name="authoritiesContacted" control={control} render={({ field }) => (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger><SelectValue placeholder="Select authority type" /></SelectTrigger>
            <SelectContent>
              {["None", "Police", "Fire", "Medical", "Other"].map(a => <SelectItem key={a} value={a.toLowerCase()}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
        )} />
      </FormField>
      {authoritiesContacted && authoritiesContacted !== "none" && (
        <FormField name="authorityDetails" label="Authority Details" error={errors.authorityDetails?.message}>
          <Controller name="authorityDetails" control={control} render={({ field }) => <Input placeholder="e.g., Officer Name, Case Number" {...field} />} />
        </FormField>
      )}
      <FormField name="immediateActionsTaken" label="Immediate Actions Taken" error={errors.immediateActionsTaken?.message}>
        <Controller name="immediateActionsTaken" control={control} render={({ field }) => <Textarea rows={3} placeholder="Describe actions taken..." {...field} />} />
      </FormField>
    </CardContent>
  );

  const Section4 = () => (
     <CardContent className="space-y-4">
        <FormField name="photosVideos" label="Photos/Videos" error={errors.photosVideos?.message}>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input type="file" multiple className="flex-grow file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
            <Button variant="outline" size="sm" className="w-full sm:w-auto" disabled><Camera className="mr-2 h-4 w-4" /> Capture Photo (Not Implemented)</Button>
          </div>
           <p className="text-xs text-muted-foreground mt-1">Uploads will go to Google Drive (simulated).</p>
        </FormField>
         <FormField name="gpsCoordinates" label="GPS Coordinates" error={errors.gpsCoordinates?.message}>
            <div className="flex items-center gap-2">
              <Controller name="gpsCoordinates" control={control} render={({ field }) => <Input placeholder="Auto-captured or manual entry" {...field} value={gpsCoords || field.value} onChange={(e)=>{field.onChange(e); setGpsCoords(e.target.value);}} />} />
              <Button variant="outline" size="icon" onClick={() => { /* re-trigger GPS */ }} disabled={!navigator.geolocation}><MapPin className="h-4 w-4" /></Button>
            </div>
         </FormField>
        <FormField name="witnessesPresent" label="Witnesses Present?" error={errors.witnessesPresent?.message}>
           <Controller name="witnessesPresent" control={control} render={({ field }) => (
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="wp_yes" /><Label htmlFor="wp_yes">Yes</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="wp_no" /><Label htmlFor="wp_no">No</Label></div>
            </RadioGroup>
          )} />
        </FormField>
        {witnessesPresent === "yes" && (
          <FormField name="witnessDetails" label="Witness Details" error={errors.witnessDetails?.message}>
            <Controller name="witnessDetails" control={control} render={({ field }) => <Textarea rows={2} placeholder="Names, contact info..." {...field} />} />
          </FormField>
        )}
        <FormField name="relatedToPreviousIncident" label="Related to Previous Incident?" error={errors.relatedToPreviousIncident?.message}>
          <Controller name="relatedToPreviousIncident" control={control} render={({ field }) => (
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="rpi_yes" /><Label htmlFor="rpi_yes">Yes</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="rpi_no" /><Label htmlFor="rpi_no">No</Label></div>
            </RadioGroup>
          )} />
        </FormField>
        {relatedToPrevious === "yes" && (
          <FormField name="previousIncidentRef" label="Previous Incident Reference ID" error={errors.previousIncidentRef?.message}>
            <Controller name="previousIncidentRef" control={control} render={({ field }) => <Input placeholder="e.g., INC042" {...field} />} />
          </FormField>
        )}
        <FormField name="followUpRequired" label="Follow-up Required?" error={errors.followUpRequired?.message}>
          <Controller name="followUpRequired" control={control} render={({ field }) => (
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="yes" id="fur_yes" /><Label htmlFor="fur_yes">Yes</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="no" id="fur_no" /><Label htmlFor="fur_no">No</Label></div>
            </RadioGroup>
          )} />
        </FormField>
        {followUpRequired === "yes" && (
          <FormField name="followUpDetails" label="Follow-up Details" error={errors.followUpDetails?.message}>
            <Controller name="followUpDetails" control={control} render={({ field }) => <Textarea rows={2} placeholder="Actions needed, assigned to..." {...field} />} />
          </FormField>
        )}
     </CardContent>
  );

  const sectionTitles = ["Basic Information", "Incident Details", "Response Actions", "Additional Information"];
  
  return (
    <div className="max-w-2xl mx-auto p-2 sm:p-4">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl sm:text-3xl text-center">Report New Incident</CardTitle>
          <CardDescription className="text-center">
            Section {currentSection} of {TOTAL_SECTIONS}: {sectionTitles[currentSection-1]}
          </CardDescription>
          <Progress value={(currentSection / TOTAL_SECTIONS) * 100} className="mt-2 h-2" />
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          {currentSection === 1 && <Section1 />}
          {currentSection === 2 && <Section2 />}
          {currentSection === 3 && <Section3 />}
          {currentSection === 4 && <Section4 />}

          <CardContent className="border-t pt-6">
            <div className="flex justify-between items-center">
              <Button type="button" variant="outline" onClick={prevSection} disabled={currentSection === 1} className="flex items-center">
                <ChevronLeft className="mr-1 h-5 w-5" /> Previous
              </Button>
              {currentSection < TOTAL_SECTIONS ? (
                <Button type="button" onClick={nextSection} className="flex items-center bg-primary hover:bg-primary/90 text-primary-foreground">
                  Next <ChevronRight className="ml-1 h-5 w-5" />
                </Button>
              ) : (
                <Button type="submit" className="flex items-center bg-accent hover:bg-accent/90 text-accent-foreground">
                  Submit Report <Send className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}

// Helper component for form fields
interface FormFieldProps {
  name: string;
  label: string;
  children: React.ReactNode;
  error?: string;
}
const FormField = ({ name, label, children, error }: FormFieldProps) => (
  <div className="space-y-1.5">
    <Label htmlFor={name} className={error ? "text-destructive" : ""}>{label}</Label>
    {children}
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

