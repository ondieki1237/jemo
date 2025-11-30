// API Configuration
// This file centralizes the backend API URL configuration

export const API_CONFIG = {
    // Backend API base URL
    BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://jemo.codewithseth.co.ke',

    // API endpoints
    endpoints: {
        blog: '/api/blog',
        services: '/api/services',
        events: '/api/events',
        requests: '/api/requests',
        quotations: '/api/quotations',
        invoices: '/api/invoices',
        upload: '/api/upload',
        analytics: '/api/analytics',
    }
}

// Helper function to get full API URL
export function getApiUrl(endpoint: string): string {
    return `${API_CONFIG.BACKEND_URL}${endpoint}`
}

// Example usage:
// const response = await fetch(getApiUrl(API_CONFIG.endpoints.blog))
