import { useState } from 'react';
import { Shield, Camera, Upload, Copy, Check, RefreshCw, Image as ImageIcon, Download, Share2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function MyPhotoID() {
    const { session } = useAuth();
    const [loading, setLoading] = useState(false);
    const [photoCode, setPhotoCode] = useState<string | null>('8492015736'); // Mock existing code
    const [photoUrl, setPhotoUrl] = useState<string | null>(null); // In a real app, this would be the user's photo URL
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const generateCode = () => {
        return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!previewUrl) return;

        setLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            const newCode = generateCode();
            setPhotoCode(newCode);
            setPhotoUrl(previewUrl);
            setPreviewUrl(null);
            toast.success('Photo ID updated successfully');
        } catch (error) {
            toast.error('Failed to update photo');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (photoCode) {
            navigator.clipboard.writeText(photoCode);
            toast.success('Code copied to clipboard');
        }
    };

    const handleDownload = () => {
        if (photoUrl) {
            const link = document.createElement('a');
            link.href = photoUrl;
            link.download = `photo-id-${photoCode}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success('Photo downloaded');
        }
    };

    const handleShare = async () => {
        if (photoCode) {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'My Photo ID Code',
                        text: `Here is my unique Photo ID code: ${photoCode}`,
                        url: window.location.href
                    });
                } catch (error) {
                    console.error('Error sharing:', error);
                }
            } else {
                copyToClipboard();
                toast.info('Sharing not supported, code copied instead');
            }
        }
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                <div className="container mx-auto flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                        <Link to="/citizen/dashboard" className="flex items-center gap-2">
                            <Shield className="h-8 w-8 text-primary" />
                            <div>
                                <h1 className="text-2xl font-bold">My Photo ID</h1>
                                <p className="text-sm text-muted-foreground">
                                    Manage your digital passport photo
                                </p>
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <Link to="/citizen/dashboard">Back to Dashboard</Link>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto p-6 space-y-8 max-w-4xl">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Current Photo & Code */}
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Digital Photo ID</CardTitle>
                            <CardDescription>Your current active passport photo</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center space-y-6">
                            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-primary/20 bg-muted flex items-center justify-center">
                                {photoUrl ? (
                                    <img src={photoUrl} alt="Passport Photo" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIconPlaceholder />
                                )}
                            </div>

                            {photoCode && (
                                <div className="w-full max-w-xs space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-center block text-muted-foreground">Unique Photo Code</Label>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-muted p-3 rounded-md text-center font-mono text-xl tracking-widest border">
                                                {photoCode}
                                            </div>
                                            <Button variant="outline" size="icon" onClick={copyToClipboard}>
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 justify-center">
                                        <Button variant="outline" className="flex-1" onClick={handleDownload} disabled={!photoUrl}>
                                            <Download className="h-4 w-4 mr-2" />
                                            Download
                                        </Button>
                                        <Button variant="outline" className="flex-1" onClick={handleShare} disabled={!photoCode}>
                                            <Share2 className="h-4 w-4 mr-2" />
                                            Share
                                        </Button>
                                    </div>

                                    <p className="text-xs text-center text-muted-foreground">
                                        Share this code with authorized agencies to retrieve your photo.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Upload New Photo */}
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Update Photo</CardTitle>
                            <CardDescription>Upload a new passport-size photo</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center min-h-[200px] text-center space-y-4">
                                {previewUrl ? (
                                    <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-primary/20">
                                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute bottom-0 right-0 rounded-full"
                                            onClick={() => setPreviewUrl(null)}
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Upload className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">Click to upload or drag and drop</p>
                                            <p className="text-sm text-muted-foreground">SVG, PNG, JPG or GIF (max. 800x800px)</p>
                                        </div>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            id="photo-upload"
                                            onChange={handleFileChange}
                                        />
                                        <Button variant="secondary" asChild>
                                            <label htmlFor="photo-upload" className="cursor-pointer">
                                                Select Photo
                                            </label>
                                        </Button>
                                    </>
                                )}
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-medium text-sm">Photo Requirements:</h4>
                                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                                    <li>White background</li>
                                    <li>Neutral facial expression</li>
                                    <li>Face clearly visible</li>
                                    <li>No glasses or headwear (unless religious)</li>
                                </ul>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                disabled={!previewUrl || loading}
                                onClick={handleUpload}
                            >
                                {loading ? 'Processing...' : 'Update Photo ID'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function UserIconPlaceholder() {
    return (
        <svg
            className="h-24 w-24 text-muted-foreground/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
        </svg>
    );
}
