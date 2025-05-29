
"use client";

import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link as LinkIcon, Users, CheckSquare, Send, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useToast } from '@/hooks/use-toast';

export default function SharingStep() {
  const { toast } = useToast();
  const appBaseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://app.securesheet.vision';
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const adminUrl = `${appBaseUrl}/admin`;
  const reportUrl = `${appBaseUrl}/incidents/report`;
  const dashboardUrl = `${appBaseUrl}/dashboard`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: "Copied to Clipboard", description: `${label} URL copied.` });
    }).catch(err => {
      toast({ title: "Copy Failed", description: `Could not copy ${label} URL.`, variant: "destructive" });
      console.error('Failed to copy to clipboard:', err);
    });
  };

  const handlePrintQr = () => {
    const qrElement = qrCodeRef.current;
    if (qrElement) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Print QR Code</title>');
        printWindow.document.write('<style>body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; } svg { width: 80mm; height: 80mm; }</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(qrElement.innerHTML);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
      } else {
        toast({ title: "Print Error", description: "Could not open print window. Please check your browser's pop-up settings.", variant: "destructive" });
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">Step 5: Team Sharing & Launch</h2>
      <p className="text-muted-foreground">
        Your SecureSheet Vision system is ready! Share access with your team and start managing incidents.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><LinkIcon className="mr-2 h-5 w-5 text-primary" /> Access URLs</CardTitle>
          <CardDescription>Share these URLs with the relevant team members.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'Admin Setup URL', url: adminUrl, forWho: 'For managers and administrators.' },
            { label: 'Incident Reporting URL', url: reportUrl, forWho: 'For security officers in the field.' },
            { label: 'Dashboard URL', url: dashboardUrl, forWho: 'For monitoring and real-time status.' },
          ].map(item => (
            <div key={item.label} className="space-y-1">
              <Label htmlFor={item.label.toLowerCase().replace(' ', '-')}>{item.label}</Label>
              <div className="flex items-center gap-2">
                <Input id={item.label.toLowerCase().replace(' ', '-')} value={item.url} readOnly />
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(item.url, item.label)}>Copy</Button>
              </div>
              <p className="text-xs text-muted-foreground">{item.forWho}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          {/* Updated icon to reflect QR Code is now generated */}
          <CardTitle className="flex items-center"> 
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-5 w-5 text-primary"><path d="M5 5h3v3H5zM5 16h3v3H5zM16 5h3v3h-3zM16 16h3v3h-3zM5 10h3v3H5zM10 5h3v3h-3zM10 10h3v3h-3zM10 16h3v3h-3zM16 10h3v3h-3z"/></svg>
             Mobile Access QR Code
          </CardTitle>
          <CardDescription>Quick access for mobile users, especially for incident reporting.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">Scan this QR Code for the Incident Reporting URL:</p>
          <div ref={qrCodeRef} className="mx-auto w-fit p-4 border rounded-md inline-block">
            <QRCodeSVG value={reportUrl} size={160} bgColor={"#ffffff"} fgColor={"#000000"} level={"L"} />
          </div>
          <div>
            <Button variant="outline" onClick={handlePrintQr}>
              <Printer className="mr-2 h-4 w-4" /> Print QR Code Card
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Instruct users to scan this QR code and add the page to their home screen for app-like access.</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5 text-primary" /> Optional Utilities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground mb-3">
            The following utilities are future enhancements and are not required to finalize the setup. Setup is completed using the "Finish Setup" button in the main navigation controls at the bottom of the wizard.
          </p>
          <p className="text-muted-foreground">Use the email template below to inform your team about the new system.</p>
          <Button variant="outline" disabled>
            <Send className="mr-2 h-4 w-4" />
            Open Email Template (Not Implemented)
          </Button>
          <Button variant="outline" disabled>Generate Setup Summary PDF (Not Implemented)</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><CheckSquare className="mr-2 h-5 w-5 text-primary" /> System Testing (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
           <p className="text-sm text-muted-foreground mb-3">
            This is an optional step and not required to finalize the setup.
          </p>
          <p className="text-muted-foreground">It's recommended to perform a quick test to ensure everything is working as expected.</p>
          <Button variant="default" disabled>Add Sample Data & Test (Not Implemented)</Button>
          <p className="text-sm text-muted-foreground">Refer to the troubleshooting checklist in the documentation if you encounter any issues.</p>
        </CardContent>
      </Card>
    </div>
  );
}
