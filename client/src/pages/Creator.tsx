import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Creator = () => {
    const [type, setType] = useState<'snippet' | 'story'>('snippet');
    const [formData, setFormData] = useState({ title: '', body: '' });

    const handlePublish = async () => {
        try {
            const endpoint = type === 'snippet' ? '/api/content/snippet' : '/api/content/work';
            await axios.post(`http://localhost:5000${endpoint}`, formData);
            alert('The archive has been updated.');
            setFormData({ title: '', body: '' });
        } catch (err) {
            console.error("The quill broke:", err);
        }
    };

    return (
        <div className="min-h-screen pt-32 px-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="max-w-2xl mx-auto dream-glass p-12 shadow-soft"
            >
                <h2 className="font-serif text-5xl mb-10 text-dream-purple italic text-center">New Creation</h2>
                
                <div className="flex gap-4 mb-12 justify-center">
                    {['snippet', 'story'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setType(t as any)}
                            className={`px-8 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${type === t ? 'bg-dream-purple text-white shadow-lg' : 'bg-dream-purple/10 text-dream-purple hover:bg-dream-purple/20'}`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div className="space-y-8">
                    {type === 'story' && (
                        <motion.input
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            type="text"
                            placeholder="Title of the Work"
                            className="w-full bg-transparent border-b border-dream-purple/20 p-4 font-serif text-3xl outline-none placeholder:text-dream-purple/30 focus:border-dream-purple/50 transition-colors"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    )}
                    <textarea
                        className="w-full bg-transparent border border-dream-purple/20 rounded-[2rem] p-8 font-serif text-xl outline-none focus:border-dream-purple/50 transition-all min-h-[300px] placeholder:text-dream-purple/30"
                        placeholder={type === 'snippet' ? "Write a fragment..." : "Write the narrative..."}
                        value={formData.body}
                        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    />
                    <button 
                        onClick={handlePublish} 
                        className="w-full py-5 bg-dream-purple text-white rounded-[1.5rem] font-serif text-2xl hover:bg-dream-purple/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
                    >
                        Publish to Archive
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Creator;