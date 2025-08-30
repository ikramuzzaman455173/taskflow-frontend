
import React, { useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BulkDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmationText: string;
  onConfirm: () => Promise<void>;
  itemCount: number;
  loading?: boolean;
}

export default function BulkDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmationText,
  onConfirm,
  itemCount,
  loading = false
}: BulkDeleteDialogProps) {
  const [inputValue, setInputValue] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const isConfirmationValid = inputValue === confirmationText;

  const handleConfirm = async () => {
    if (!isConfirmationValid) return;
    
    setIsDeleting(true);
    try {
      await onConfirm();
      setInputValue('');
      onOpenChange(false);
    } catch (error) {
      console.error('Bulk delete failed:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!isDeleting) {
      setInputValue('');
      onOpenChange(newOpen);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-left">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-destructive font-medium">
              ⚠️ This will permanently delete {itemCount} item{itemCount !== 1 ? 's' : ''}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This action cannot be undone.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmation">
              Type "{confirmationText}" to confirm:
            </Label>
            <Input
              id="confirmation"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={confirmationText}
              disabled={isDeleting}
              className="font-mono"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={!isConfirmationValid || isDeleting}
              className="min-w-[100px]"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete All'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
