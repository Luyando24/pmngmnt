import React, { useState, useRef, useCallback, useEffect } from "react";
import { Api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Search, User, CreditCard, Camera, StopCircle, QrCode } from "lucide-react";
import type { Resident } from "@shared/api";

export default function IDScanner() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [nationalId, setNationalId] = useState("");
  const [passportNumber, setPassportNumber] = useState("");
  const [foundResident, setFoundResident] = useState<Resident | null>(null);
  
  // QR scanning states
  const [isQRCameraActive, setIsQRCameraActive] = useState(false);
  const [qrScanning, setQrScanning] = useState(false);
  const [scannedQRData, setScannedQRData] = useState<string | null>(null);
  const qrVideoRef = useRef<HTMLVideoElement>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const qrStreamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Face scanning states (keeping for compatibility)
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [faceScanning, setFaceScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const playSuccessSound = () => {
    // Create a simple success sound using Web Audio API
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  // QR Camera functions
  const startQRCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera if available
      });
      
      qrStreamRef.current = stream;
      
      if (qrVideoRef.current) {
        qrVideoRef.current.srcObject = stream;
        await qrVideoRef.current.play();
        setIsQRCameraActive(true);
        startQRScanning();
      }
    } catch (err: any) {
      let errorMessage = 'Failed to access camera';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access and try again.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Camera is not supported in this browser.';
      }
      
      setError(errorMessage);
      toast({
        title: "Camera Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const stopQRCamera = () => {
    if (qrStreamRef.current) {
      qrStreamRef.current.getTracks().forEach(track => track.stop());
      qrStreamRef.current = null;
    }
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    setIsQRCameraActive(false);
    setQrScanning(false);
    setScannedQRData(null);
  };

  const startQRScanning = () => {
    setQrScanning(true);
    
    // Simple QR scanning simulation - in a real app, you'd use a QR code library
    scanIntervalRef.current = setInterval(() => {
      if (qrVideoRef.current && qrCanvasRef.current) {
        // Simulate QR code detection
         const simulatedQRCodes = [
           'ID:123456/78/9',
           'PASSPORT:ZN1234567',
           'RESIDENT:654321/89/0'
         ];
        
        // Random chance of "detecting" a QR code
        if (Math.random() < 0.1) { // 10% chance per scan
          const randomQR = simulatedQRCodes[Math.floor(Math.random() * simulatedQRCodes.length)];
          handleQRDetected(randomQR);
        }
      }
    }, 500); // Scan every 500ms
  };

  const handleQRDetected = async (qrData: string) => {
    setScannedQRData(qrData);
    setQrScanning(false);
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    playSuccessSound();
    
    // Parse QR data and search for resident
    const [type, value] = qrData.split(':');
    
    if (type === 'ID' && value) {
      setNationalId(value);
      await handleSearch('nationalId', value);
    } else if (type === 'PASSPORT' && value) {
      setPassportNumber(value);
      await handleSearch('passport', value);
    } else {
      toast({
        title: "QR Code Scanned",
        description: `Detected: ${qrData}`,
        variant: "default",
      });
    }
  };

  const handleSearch = async (searchType: 'nationalId' | 'passport', qrValue?: string) => {
    const searchValue = qrValue || (searchType === 'nationalId' ? nationalId : passportNumber);
    
    if (!searchValue.trim()) {
      setError(`Please enter a ${searchType === 'nationalId' ? 'National ID' : 'Passport Number'}`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setFoundResident(null);
      
      const searchParams = searchType === 'nationalId' 
        ? { nationalId: searchValue }
        : { passportNumber: searchValue };
      
      const res = await Api.searchResident(searchParams);
      
      if (res.resident) {
        // Play success sound
        try {
          playSuccessSound();
        } catch (soundError) {
          console.log('Could not play sound:', soundError);
        }
        
        setFoundResident(res.resident);
        
        // Show success toast
        toast({
          title: "Resident Found!",
          description: `Successfully found resident: ${res.resident.firstName} ${res.resident.lastName}`,
          duration: 3000,
          className: "bg-green-50 border-green-200 text-green-800",
        });
      } else {
        setError(`No resident found with this ${searchType === 'nationalId' ? 'National ID' : 'Passport Number'}`);
        toast({
          title: "Resident Not Found",
          description: `No resident record matches the provided ${searchType === 'nationalId' ? 'National ID' : 'Passport Number'}.`,
          variant: "destructive",
          duration: 4000,
          className: "bg-red-50 border-red-200 text-red-800",
        });
      }
    } catch (e: any) {
      const errorMsg = String(e?.message || e);
      setError(errorMsg);
      toast({
        title: "Search Error",
        className: "bg-red-50 border-red-200 text-red-800",
        description: errorMsg,
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setNationalId("");
    setPassportNumber("");
    setFoundResident(null);
    setError(null);
    setScannedQRData(null);
    stopQRCamera();
  };

  // Cleanup QR camera on unmount
  useEffect(() => {
    return () => {
      stopQRCamera();
    };
  }, []);

  return (
    <div className="p-6 flex items-start justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            ID Scanner - Resident Lookup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="nationalId" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="nationalId" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                National ID
              </TabsTrigger>
              <TabsTrigger value="passport" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Passport
              </TabsTrigger>
              <TabsTrigger value="qrcode" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="nationalId" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nationalId">National ID Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="nationalId"
                    placeholder="Enter National ID (e.g., 123456/78/9)"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch('nationalId')}
                    disabled={loading}
                  />
                  <Button 
                    onClick={() => handleSearch('nationalId')} 
                    disabled={loading || !nationalId.trim()}
                    className="min-w-[100px]"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="passport" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="passportNumber">Passport Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="passportNumber"
                    placeholder="Enter Passport Number (e.g., ZN1234567)"
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch('passport')}
                    disabled={loading}
                  />
                  <Button 
                    onClick={() => handleSearch('passport')} 
                    disabled={loading || !passportNumber.trim()}
                    className="min-w-[100px]"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="qrcode" className="space-y-4">
              <div className="space-y-4">
                <div className="text-center">
                  <Label className="text-base font-medium">QR Code Scanner</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Point your camera at a QR code containing ID or passport information
                  </p>
                </div>
                
                {!isQRCameraActive ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-full max-w-md aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                      <div className="text-center">
                        <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Camera not active</p>
                      </div>
                    </div>
                    <Button onClick={startQRCamera} className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Start QR Scanner
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative w-full max-w-md mx-auto">
                      <video
                        ref={qrVideoRef}
                        className="w-full aspect-square object-cover rounded-lg border"
                        autoPlay
                        playsInline
                        muted
                      />
                      {qrScanning && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-48 h-48 border-2 border-blue-500 rounded-lg animate-pulse">
                            <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-500"></div>
                            <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-500"></div>
                            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-500"></div>
                            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-500"></div>
                          </div>
                        </div>
                      )}
                      {scannedQRData && (
                        <div className="absolute top-2 left-2 right-2 bg-green-500 text-white px-3 py-2 rounded text-sm">
                          QR Code Detected: {scannedQRData}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 justify-center">
                      <Button 
                        onClick={stopQRCamera} 
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <StopCircle className="h-4 w-4" />
                        Stop Scanner
                      </Button>
                      {scannedQRData && (
                        <Button 
                          onClick={() => {
                            setScannedQRData(null);
                            startQRScanning();
                          }}
                          className="flex items-center gap-2"
                        >
                          <QrCode className="h-4 w-4" />
                          Scan Again
                        </Button>
                      )}
                    </div>
                  </div>
                )}
                
                <canvas ref={qrCanvasRef} className="hidden" />
              </div>
            </TabsContent>
          </Tabs>
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="text-sm text-red-600">{error}</div>
            </div>
          )}
          
          {foundResident && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  Resident Found
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-green-700">Name:</span>
                    <p className="text-green-800">{foundResident.firstName} {foundResident.lastName}</p>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">National ID:</span>
                    <p className="text-green-800 font-mono">{foundResident.nationalId}</p>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Date of Birth:</span>
                    <p className="text-green-800">{foundResident.dateOfBirth}</p>
                  </div>
                  <div>
                    <span className="font-medium text-green-700">Nationality:</span>
                    <p className="text-green-800">{foundResident.nationality}</p>
                  </div>
                  {foundResident.passportNumber && (
                    <div>
                      <span className="font-medium text-green-700">Passport:</span>
                      <p className="text-green-800 font-mono">{foundResident.passportNumber}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-green-700">Status:</span>
                    <p className="text-green-800 capitalize">{foundResident.residencyStatus}</p>
                  </div>
                  {foundResident.address && (
                    <div className="col-span-2">
                      <span className="font-medium text-green-700">Address:</span>
                      <p className="text-green-800">{foundResident.address}</p>
                    </div>
                  )}
                  {foundResident.phoneNumber && (
                    <div>
                      <span className="font-medium text-green-700">Phone:</span>
                      <p className="text-green-800">{foundResident.phoneNumber}</p>
                    </div>
                  )}
                  {foundResident.occupation && (
                    <div>
                      <span className="font-medium text-green-700">Occupation:</span>
                      <p className="text-green-800">{foundResident.occupation}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-3">
                  <Button 
                    variant="outline" 
                    onClick={clearSearch}
                    className="flex-1"
                  >
                    Search Another
                  </Button>
                  <Button 
                    onClick={() => navigate('/police/cases/new', { state: { resident: foundResident } })}
                    className="flex-1"
                  >
                    Create Case
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
