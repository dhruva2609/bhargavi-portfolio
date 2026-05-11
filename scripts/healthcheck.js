import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.PRODUCTION_URL || 'http://localhost:5000';

async function verifySanctuary() {
    console.log(`🌸 Starting Production Health Audit: ${API_URL}`);
    console.log("---------------------------------------------------");

    const endpoints = [
        { name: 'Echoes (Snippets)', url: '/api/content/snippets' },
        { name: 'Volumes (Stories)', url: '/api/content/stories' },
        { name: 'Melodies (Songs)', url: '/api/content/songs' }
    ];

    for (const endpoint of endpoints) {
        try {
            const start = Date.now();
            const res = await axios.get(`${API_URL}${endpoint.url}`);
            const duration = Date.now() - start;
            
            if (res.status === 200) {
                console.log(`✅ ${endpoint.name}: Connected (${duration}ms) - [${res.data.length} entries found]`);
            } else {
                console.log(`⚠️ ${endpoint.name}: Unexpected Status ${res.status}`);
            }
        } catch (err) {
            console.log(`❌ ${endpoint.name}: FAILED - ${err.message}`);
        }
    }

    console.log("---------------------------------------------------");
    console.log("✨ Health Audit Complete.");
}

verifySanctuary();
