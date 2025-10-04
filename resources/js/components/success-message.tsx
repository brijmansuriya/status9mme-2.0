import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

interface SuccessMessageProps {
    message: string;
    className?: string;
}

export default function SuccessMessage({ message, className }: SuccessMessageProps) {
    if (!message) {
        return null;
    }

    return (
        <Alert className={`border-green-200 bg-green-50 text-green-800 ${className || ''}`}>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}
