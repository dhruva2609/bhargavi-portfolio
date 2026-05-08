import { useState, useEffect } from 'react';
import axios from 'axios';

export const useNarrative = (endpoint: 'stories' | 'snippets') => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/content/${endpoint}`);
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch from the inkwell:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [endpoint]);

    return { data, loading };
};