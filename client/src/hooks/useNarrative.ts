import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
    ]
};

export const useNarrative = (endpoint: 'stories' | 'snippets') => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await axios.get(`${API_URL}/api/content/${endpoint}`);
                
                if (res.data && res.data.length > 0) {
                    setData(res.data);
                } else {
                    setData(SAMPLE_DATA[endpoint]);
                }
            } catch (err) {
                console.error("Failed to fetch from the inkwell, using archive samples:", err);
                setError("Archive connection weak. Displaying cached snapshots.");
                setData(SAMPLE_DATA[endpoint]);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [endpoint]);

    return { data, loading, error };
};