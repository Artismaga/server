export default function() {
    if (typeof window === 'undefined') {
        return false; // Assume PC if being rendered on server
    } else {
        return window.screen.width <= 425;
    }
}