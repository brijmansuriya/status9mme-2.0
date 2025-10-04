import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
    message: string;
    className?: string;
}

export default function ErrorMessage({ message, className }: ErrorMessageProps) {
    if (!message) {
        return null;
    }

    return (
        <Alert className={`border-red-200 bg-red-50 text-red-800 ${className || ''}`}>
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription>{message}</AlertDescription>
        </Alert>
    );
}
