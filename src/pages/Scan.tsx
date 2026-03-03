import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Button } from '../components/ui/Button';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

export function Scan() {
    const navigate = useNavigate();
    const { workspace, members, markAttendance } = useApp();
    const [result, setResult] = useState<{ success: boolean; message: string; memberName?: string } | null>(null);
    const [isScanning, setIsScanning] = useState(true);
    const scannerId = "qr-reader";

    useEffect(() => {
        if (!isScanning) return;

        const html5QrcodeScanner = new Html5QrcodeScanner(
            scannerId,
            { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
        );

        html5QrcodeScanner.render(
            async (decodedText: string) => {
                // Stop scanning to prevent multiple scans
                html5QrcodeScanner.clear().catch(console.error);
                setIsScanning(false);

                if (workspace) {
                    try {
                        const parsed = JSON.parse(decodedText);

                        if (parsed.workspace_id !== workspace.id) {
                            setResult({ success: false, message: 'Invalid QR Code for this Workspace.' });
                            return;
                        }

                        const member = members.find(m => m.id === parsed.member_id);
                        if (!member) {
                            setResult({ success: false, message: 'Member not found.' });
                            return;
                        }

                        if (!member.active) {
                            setResult({ success: false, message: 'Member is inactive or expired.' });
                            return;
                        }

                        const res = await markAttendance(member.id);
                        setResult({ ...res, memberName: member.full_name });
                    } catch (err) {
                        setResult({ success: false, message: 'Invalid QR Code format.' });
                    }
                }
            },
            () => {
                // Ignored, just looking for valid scans
            }
        );

        return () => {
            html5QrcodeScanner.clear().catch(console.error);
        };
    }, [isScanning, members, workspace, markAttendance]);

    const resetScan = () => {
        setResult(null);
        setIsScanning(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold">Scan QR</h2>
                </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-surface-100 dark:bg-black aspect-square flex items-center justify-center border-4 border-surface-200 dark:border-surface-800 shadow-xl p-2">
                {isScanning ? (
                    <div id={scannerId} className="w-full h-full [&_video]:rounded-2xl [&_video]:object-cover" />
                ) : (
                    <div className="text-center p-6 bg-white dark:bg-surface-900 w-full h-full flex flex-col items-center justify-center space-y-4">
                        {result?.success ? (
                            <CheckCircle2 className="w-20 h-20 text-success-500" />
                        ) : (
                            <XCircle className="w-20 h-20 text-danger-500" />
                        )}

                        <h3 className="text-2xl font-bold">
                            {result?.success ? 'Check-in Successful!' : 'Check-in Failed'}
                        </h3>

                        <p className="text-surface-500 text-lg">
                            {result?.success ? (
                                <>
                                    <span className="font-semibold text-surface-900 dark:text-surface-100">{result.memberName}</span> has been marked present.
                                </>
                            ) : (
                                result?.message
                            )}
                        </p>

                        <Button onClick={resetScan} size="lg" className="mt-8">
                            Scan Next Member
                        </Button>
                    </div>
                )}
            </div>

            {isScanning && (
                <p className="text-surface-500 text-center text-sm">
                    Point the camera at the member's QR code.
                </p>
            )}
        </div>
    );
}
