export const trackingUpdateKey = 'english-tracking-updated';
export function notifyTrackingUpdate() {
    try {
        localStorage.setItem(trackingUpdateKey, crypto.randomUUID());
    } catch {
        // Dashboard also refreshes on focus, visibility and restored navigation.
    }
}
