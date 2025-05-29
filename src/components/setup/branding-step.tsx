"use client";

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, Palette } from 'lucide-react';
import { useAppContext } from '@/context/app-context';
import Image from 'next/image';

// Helper to convert HSL string to hex for color input (simplified)
const hslToHex = (hslString: string): string => {
  const [h, s, l] = hslString.split(' ').map(parseFloat);
  if (isNaN(h) || isNaN(s) || isNaN(l)) return '#000000'; // fallback

  const sNormalized = s / 100;
  const lNormalized = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sNormalized * Math.min(lNormalized, 1 - lNormalized);
  const f = (n: number) =>
    lNormalized - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  
  const toHex = (val: number) => Math.round(255 * val).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
};

// Helper to convert hex to HSL string (simplified)
const hexToHsl = (hex: string): string => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  
  return `${h} ${s}% ${l}%`;
};


export default function BrandingStep() {
  const { brandingConfig, setBrandingConfig } = useAppContext();
  const [companyName, setCompanyName] = useState(brandingConfig.companyName);
  const [logoUrl, setLogoUrl] = useState(brandingConfig.logoUrl); // Placeholder URL
  const [primaryColorHex, setPrimaryColorHex] = useState(hslToHex(brandingConfig.primaryColor));
  const [accentColorHex, setAccentColorHex] = useState(hslToHex(brandingConfig.accentColor));

  const handleSaveChanges = () => {
    setBrandingConfig({
      companyName,
      logoUrl,
      primaryColor: hexToHsl(primaryColorHex),
      accentColor: hexToHsl(accentColorHex),
    });
  };

  useEffect(() => {
    // Auto-save on change
    handleSaveChanges();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyName, logoUrl, primaryColorHex, accentColorHex]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // For demonstration, use a placeholder. In a real app, upload and get URL.
      setLogoUrl(URL.createObjectURL(file)); // Temporary local URL for preview
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">Step 3: Brand Customization</h2>
      <p className="text-muted-foreground">
        Personalize SecureSheet Vision with your company's branding. Changes are saved automatically.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input 
              id="companyName" 
              placeholder="Your Company LLC" 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><UploadCloud className="mr-2 h-5 w-5 text-primary" /> Logo Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="logoUpload">Primary Logo (PNG, JPG, SVG)</Label>
            <Input 
              id="logoUpload" 
              type="file" 
              accept="image/png, image/jpeg, image/svg+xml"
              onChange={handleLogoUpload}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
            />
            {logoUrl && (
              <div className="mt-4 p-4 border rounded-md bg-muted/50 flex items-center justify-center">
                <Image src={logoUrl} alt="Logo Preview" width={150} height={60} className="max-h-[60px] object-contain" data-ai-hint="logo company" />
              </div>
            )}
            {!logoUrl && (
              <div className="mt-4 p-4 border rounded-md bg-muted/50 text-center text-muted-foreground">
                Logo preview will appear here. Use a placeholder if no logo is uploaded.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center"><Palette className="mr-2 h-5 w-5 text-primary" /> Visual Design</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="primaryColor" 
                  type="color" 
                  value={primaryColorHex}
                  onChange={(e) => setPrimaryColorHex(e.target.value)}
                  className="w-16 h-10 p-1"
                />
                <span className="text-sm text-muted-foreground">{primaryColorHex.toUpperCase()}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex items-center gap-2">
                <Input 
                  id="accentColor" 
                  type="color" 
                  value={accentColorHex}
                  onChange={(e) => setAccentColorHex(e.target.value)}
                  className="w-16 h-10 p-1"
                />
                 <span className="text-sm text-muted-foreground">{accentColorHex.toUpperCase()}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            These colors will be applied throughout the application. Your changes update the theme in real-time.
          </p>
        </CardContent>
      </Card>

       <div className="mt-6 p-4 border rounded-md bg-muted/30">
          <h3 className="text-lg font-medium text-foreground mb-2">Live Preview (Example)</h3>
          <div className="flex flex-col gap-2">
             <Button style={{ backgroundColor: primaryColorHex, color: 'white' }}>Primary Button</Button>
             <Button style={{ backgroundColor: accentColorHex, color: 'white' }}>Accent Button</Button>
             <div className="p-3 rounded" style={{ border: `2px solid ${primaryColorHex}` }}>
                <p style={{ color: primaryColorHex }}>This text uses primary color.</p>
                <p style={{ color: accentColorHex }}>This text uses accent color.</p>
             </div>
          </div>
       </div>
    </div>
  );
}
