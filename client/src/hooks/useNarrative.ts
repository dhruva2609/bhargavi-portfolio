import { useState, useEffect } from 'react';
import axios from 'axios';

import { API_URL, transformDriveUrl } from '../config';

const SAMPLE_DATA = {
    snippets: [
        {
            _id: 's1',
            content: "The moon doesn't ask for permission to shine. It simply waits for the world to grow quiet enough to notice.",
            date: "May 8",
            createdAt: new Date().toISOString()
        },
        {
            _id: 's2',
            content: "Architecture is not just about the lines we draw on paper, but the shadows we allow to dance between them.",
            date: "May 7",
            createdAt: new Date().toISOString()
        },
        {
            _id: 's3',
            content: "We are all just echoes of a song we haven't written yet.",
            date: "May 5",
            createdAt: new Date().toISOString()
        },
        {
            _id: 's4',
            content: "Silence is the most expensive luxury in a world that profits from your noise.",
            date: "May 3",
            createdAt: new Date().toISOString()
        },
        {
            _id: 's5',
            content: "Cherry blossoms don't compete with the roses. They just bloom when it's their time.",
            date: "May 1",
            createdAt: new Date().toISOString()
        },
        {
            _id: 's6',
            content: "The best stories are the ones found in the margins of old notebooks, written in a handwriting we no longer recognize.",
            date: "April 28",
            createdAt: new Date().toISOString()
        }
    ],
    stories: [
        {
            _id: 'w1',
            title: "The Glass Observatory",
            description: "A narrative exploration of transparency and the human condition, set in a fictional city of crystal.",
            createdAt: new Date().toISOString()
        },
        {
            _id: 'w2',
            title: "Echoes of Purple",
            description: "A collection of poetry centered around the transition from dawn to dusk, and the colors that define our emotions.",
            createdAt: new Date().toISOString()
        }
    ],
    instagram: [
        {
            _id: 'i1',
            url: 'https://www.instagram.com/p/C69A1-yS6f5/',
            label: 'Architectural Fragment 01',
            image: 'https://drive.google.com/uc?export=view&id=1v0R8_Z5Y9X2W3V4U5T6S7R8Q9P0O1N2M'
        },
        {
            _id: 'i2',
            url: 'https://www.instagram.com/p/C6_A1-yS6f5/',
            label: 'Silent Spaces',
            image: 'https://drive.google.com/uc?export=view&id=1v0R8_Z5Y9X2W3V4U5T6S7R8Q9P0O1N2M_1'
        },
        {
            _id: 'i3',
            url: 'https://www.instagram.com/p/C7BA1-yS6f5/',
            label: 'Light Study',
            image: 'https://drive.google.com/uc?export=view&id=1v0R8_Z5Y9X2W3V4U5T6S7R8Q9P0O1N2M_2'
        }
    ]
};

export const useNarrative = (endpoint: 'stories' | 'snippets' | 'instagram', limit?: number) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const url = limit 
                    ? `${API_URL}/api/content/${endpoint}?limit=${limit}`
                    : `${API_URL}/api/content/${endpoint}`;
                const res = await axios.get(url);
                
                if (res.data && res.data.length > 0) {
                    const transformedData = res.data.map((item: any) => ({
                        ...item,
                        image: item.image ? transformDriveUrl(item.image) : item.image,
                        coverImage: item.coverImage ? transformDriveUrl(item.coverImage) : item.coverImage
                    }));
                    setData(transformedData);
                } else {
                    const sample = SAMPLE_DATA[endpoint];
                    setData(limit ? sample.slice(0, limit) : sample);
                }
            } catch (err) {
                console.error("Failed to fetch from the inkwell, using archive samples:", err);
                setError("Archive connection weak. Displaying cached snapshots.");
                const sample = SAMPLE_DATA[endpoint];
                setData(limit ? sample.slice(0, limit) : sample);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [endpoint, limit]);

    return { data, loading, error };
};

