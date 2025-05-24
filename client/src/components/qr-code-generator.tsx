import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRCodeGeneratorProps {
  menuUrl?: string;
}

export function QRCodeGenerator({ menuUrl }: QRCodeGeneratorProps) {
  const { toast } = useToast();
  
  const currentUrl = menuUrl || window.location.origin;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;

  const handleDownload = async () => {
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'menu-qr-code.png';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "QR Code Downloaded",
        description: "The QR code has been saved to your device.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download QR code. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Gujarat Thali Express - Menu',
          text: 'Check out our delicious Gujarati thali menu!',
          url: currentUrl,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to copying URL
      try {
        await navigator.clipboard.writeText(currentUrl);
        toast({
          title: "Link Copied",
          description: "Menu link has been copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Share Failed",
          description: "Failed to copy link. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardContent className="pt-6">
        <div className="text-center space-y-4">
          <div className="mx-auto w-48 h-48 bg-white rounded-xl shadow-lg p-4 flex items-center justify-center">
            <img 
              src={qrCodeUrl} 
              alt="Menu QR Code" 
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback if QR service fails
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `
                  <div class="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
                    <div class="text-center">
                      <div class="text-4xl mb-2">📱</div>
                      <div class="text-sm text-gray-600">QR Code</div>
                    </div>
                  </div>
                `;
              }}
            />
          </div>
          
          <div>
            <h3 className="font-semibold text-dark-brown mb-2">Scan for Menu Access</h3>
            <p className="text-sm text-gray-600 mb-4">Share this QR code with customers</p>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button 
              onClick={handleDownload}
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button 
              onClick={handleShare}
              variant="outline" 
              size="sm"
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
