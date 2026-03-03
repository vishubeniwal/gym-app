import { addDays, isBefore, isAfter, startOfDay, parseISO } from 'date-fns';

export function isExpiringSoon(expiryDateStr: string, daysThreshold = 7): boolean {
    if (!expiryDateStr) return false;

    const today = startOfDay(new Date());
    const expiryDate = startOfDay(parseISO(expiryDateStr));
    const thresholdDate = addDays(today, daysThreshold);

    // Expiring soon if expiry is after today (or equal) and before/equal to threshold
    return (isBefore(expiryDate, thresholdDate) || expiryDate.getTime() === thresholdDate.getTime()) &&
        (isAfter(expiryDate, today) || expiryDate.getTime() === today.getTime());
}

export function isExpired(expiryDateStr: string): boolean {
    if (!expiryDateStr) return true;
    const today = startOfDay(new Date());
    const expiryDate = startOfDay(parseISO(expiryDateStr));
    return isBefore(expiryDate, today);
}
