// Atoms Ninja - Configuration
const CONFIG = {
    // Backend API (Gemini Proxy)
    BACKEND_API_URL: window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3001' 
        : 'https://atoms-dun.vercel.app',
    
    // Kali Linux MCP Server (GCP VM)
    KALI_MCP_ENDPOINT: window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://136.113.58.241:3001'
        : 'https://atoms-dun.vercel.app/api/kali',
    
    // GCP Configuration
    GCP: {
        PROJECT_ID: 'gen-lang-client-0528385692',
        VM_INSTANCE: 'atoms-kali-security',
        VM_IP: '136.113.58.241',
        REGION: 'us-central1'
    },
    
    // Service Accounts
    SERVICE_ACCOUNTS: {
        VERTEX_AI: 'gen-lang-client-0528385692-a54ea848daea.json',
        OWNER: 'gen-lang-client-0528385692-8f8d2551426e.json'
    },
    
    // API Keys
    GEMINI_API_KEY: 'AIzaSyDzGlemhn-AEP5G8F0UrHuD6gWr97RV0YQ'
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
