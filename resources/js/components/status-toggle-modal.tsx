import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ToggleLeft, ToggleRight, Info } from 'lucide-react';

interface StatusToggleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    currentStatus: 'active' | 'inactive';
    isLoading?: boolean;
}

export default function StatusToggleModal({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    currentStatus,
    isLoading = false,
}: StatusToggleModalProps) {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const isActivating = newStatus === 'active';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${isActivating ? 'bg-green-100' : 'bg-orange-100'
                            }`}>
                            {isActivating ? (
                                <ToggleRight className="h-6 w-6 text-green-600" />
                            ) : (
                                <ToggleLeft className="h-6 w-6 text-orange-600" />
                            )}
                        </div>
                        <div>
                            <DialogTitle className="text-left">
                                {isActivating ? 'Activate' : 'Deactivate'} Category
                            </DialogTitle>
                            <DialogDescription className="text-left">
                                {isActivating
                                    ? 'This will make the category visible and available for use.'
                                    : 'This will hide the category from public view.'
                                }
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    <div className={`rounded-lg p-4 ${isActivating ? 'bg-green-50' : 'bg-orange-50'
                        }`}>
                        <div className="flex items-start gap-3">
                            <Info className={`h-5 w-5 mt-0.5 ${isActivating ? 'text-green-600' : 'text-orange-600'
                                }`} />
                            <div>
                                <h4 className={`font-medium ${isActivating ? 'text-green-900' : 'text-orange-900'
                                    }`}>
                                    {isActivating ? 'Activate' : 'Deactivate'} "{itemName}"
                                </h4>
                                <p className={`text-sm mt-1 ${isActivating ? 'text-green-700' : 'text-orange-700'
                                    }`}>
                                    {isActivating
                                        ? 'The category will become active and visible to users.'
                                        : 'The category will be hidden from users but can be reactivated later.'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`${isActivating
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-orange-600 hover:bg-orange-700'
                            }`}
                    >
                        {isLoading ? (
                            <>
                                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                {isActivating ? 'Activating...' : 'Deactivating...'}
                            </>
                        ) : (
                            <>
                                {isActivating ? (
                                    <ToggleRight className="mr-2 h-4 w-4" />
                                ) : (
                                    <ToggleLeft className="mr-2 h-4 w-4" />
                                )}
                                {isActivating ? 'Activate' : 'Deactivate'}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
