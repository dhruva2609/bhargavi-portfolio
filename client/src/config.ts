// Central configuration for the client application
export const API_URL =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? ''
    : (import.meta.env.VITE_API_URL || '');

// Global helper to transform Google Drive / Photos URLs into proxied URLs
export const transformDriveUrl = (url: string) => {
    if (!url) return url;
    
    // If it's already proxied, ensure the correct host prefix
    if (url.includes('image-proxy')) {
        if (url.startsWith('/api') && API_URL) {
            return `${API_URL}${url}`;
        }
        return url;
    }
    
    // Check if it's a Google Drive or Google Photos URL
    if (!url.includes('drive.google.com') && !url.includes('docs.google.com') && !url.includes('lh3.googleusercontent.com')) {
        return url;
    }
    
    const idMatch = url.match(/[?&]id=([^&]+)/) || url.match(/\/d\/([^/]+)/);
    if (idMatch && idMatch[1]) {
        return `${API_URL}/api/content/image-proxy?id=${idMatch[1]}`;
    }
    return url;
};
