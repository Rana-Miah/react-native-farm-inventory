import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Text } from './ui/text';

type AlertModalProps = {
    title: string;
    description: string;
    cancelBtnLabel?: string;
    confirmBtnLabel?: string;
    isOpen: boolean;
    onConfirm: () => void
    onCancel: () => void
}

const AlertModal = ({
    onCancel,
    onConfirm,
    isOpen,
    title,
    description,
    cancelBtnLabel,
    confirmBtnLabel
}: AlertModalProps) => {
    return (
        <AlertDialog onOpenChange={(v) => !v} open={isOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onPress={onCancel}>
                        <Text>{cancelBtnLabel || 'Cancel'}</Text>
                    </AlertDialogCancel>
                    <AlertDialogAction onPress={onConfirm}>
                        <Text>{confirmBtnLabel || 'Confirm'}</Text>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AlertModal