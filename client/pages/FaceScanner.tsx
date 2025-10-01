import React, { useState, useRef, useCallback, useEffect } from "react";
import { Api } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { CheckCircle, Camera, StopCircle, RotateCcw, User } from "lucide-react";
import type { Resident } from "@shared/api";

export default function FaceScanner() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [foundResident, setFoundResident] = useState<Resident | null>(null);
  
  // Face scanning states
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

  // Start camera for face scanning
  const startCamera = useCallback(async () => {
    try {
      setError(null);
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser or requires HTTPS.');
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (err: any) {
      let errorMessage = 'Failed to access camera.';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera access denied. Please allow camera permissions and try again.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found. Please connect a camera and try again.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Camera access not supported. Please use HTTPS or a supported browser.';
      } else if (err.message.includes('HTTPS')) {
        errorMessage = 'Camera access requires HTTPS. Please use a secure connection.';
      }
      
      setError(errorMessage);
      console.error('Camera access error:', err);
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setCapturedImage(null);
  }, []);

  // Capture face image
  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
  }, []);

  // Simulate face recognition search
  const searchByFace = async () => {
    if (!capturedImage) {
      setError('Please capture an image first');
      return;
    }

    try {
      setLoading(true);
      setFaceScanning(true);
      setError(null);
      
      // Simulate face recognition processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, randomly match with one of our sample residents
      const sampleResidents = [
        { nationalId: 'NRC123456789' },
        { nationalId: 'NRC987654321' },
        { nationalId: 'NRC555666777' }
      ];
      
      // Simulate 70% success rate for face recognition
      const isMatch = Math.random() > 0.3;
      
      if (isMatch) {
        const randomResident = sampleResidents[Math.floor(Math.random() * sampleResidents.length)];
        const res = await Api.searchResident({ nationalId: randomResident.nationalId });
        
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
            title: "Face Recognition Successful!",
            description: `Successfully identified: ${res.resident.firstName} ${res.resident.lastName}`,
            duration: 3000,
            className: "bg-green-50 border-green-200 text-green-800",
          });
        }
      } else {
        setError('No matching resident found in the database. Face not recognized.');
        toast({
          title: "Face Not Recognized",
          description: "No matching resident found in the facial recognition database.",
          variant: "destructive",
          duration: 4000,
          className: "bg-red-50 border-red-200 text-red-800",
        });
      }
    } catch (e: any) {
      const errorMsg = String(e?.message || e);
      setError(errorMsg);
      toast({
        title: "Face Recognition Error",
        className: "bg-red-50 border-red-200 text-red-800",
        description: errorMsg,
        variant: "destructive",
        duration: 4000,
      });
    } finally {
      setLoading(false);
      setFaceScanning(false);
    }
  };

  const resetScanner = () => {
    setCapturedImage(null);
    setFoundResident(null);
    setError(null);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="p-6 flex items-start justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Face Scanner - Facial Recognition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Camera Section */}
          <div className="space-y-4">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
              {isCameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {faceScanning && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                      <div className="text-white text-lg font-semibold animate-pulse">
                        Analyzing Face...
                      </div>
                    </div>
                  )}
                </>
              ) : capturedImage ? (
                <img
                  src={capturedImage}
                  alt="Captured face"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                    <p>Camera preview will appear here</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Camera Controls */}
            <div className="flex gap-2 justify-center">
              {!isCameraActive && !capturedImage && (
                <Button onClick={startCamera} className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Start Camera
                </Button>
              )}
              
              {isCameraActive && !capturedImage && (
                <>
                  <Button onClick={captureImage} className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Capture Face
                  </Button>
                  <Button onClick={stopCamera} variant="outline" className="flex items-center gap-2">
                    <StopCircle className="h-4 w-4" />
                    Stop Camera
                  </Button>
                </>
              )}
              
              {capturedImage && (
                <>
                  <Button 
                    onClick={searchByFace} 
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    {loading ? 'Recognizing...' : 'Recognize Face'}
                  </Button>
                  <Button onClick={resetScanner} variant="outline" className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Retake
                  </Button>
                </>
              )}
            </div>
          </div>
          
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
                  Face Recognition Match
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
                    onClick={resetScanner}
                    className="flex-1"
                  >
                    Scan Another
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
          
          {/* Hidden canvas for image capture */}
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </CardContent>
      </Card>
    </div>
  );
}