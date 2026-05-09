import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import featherSvg from '../assets/Feather.svg';

const Creator = () => {
    const [type, setType] = useState<'snippet' | 'story'>('snippet');
    const [formData, setFormData] = useState({ title: '', body: '', passphrase: '' });

    const handlePublish = async () => {
        try {
            if (!formData.passphrase) {
                alert("Passphrase required.");
                return;
            }
            const endpoint = type === 'snippet' ? '/api/content/snippet' : '/api/content/work';
            await axios.post(`http://localhost:5000${endpoint}`, formData);
            alert('The archive has been updated.');
            setFormData({ title: '', body: '', passphrase: '' });
        } catch (err) {
            console.error("The quill broke:", err);
        }
    };

    return (
        <div className="min-h-screen pt-48 pb-32 px-6 bg-transparent">
            
            <motion.div 
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-2xl mx-auto editorial-card p-6 md:p-20 relative z-10"
            >
                <div className="text-center mb-16 relative">
                    <img src={featherSvg} alt="Feather" className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-16 md:w-24 opacity-20 pointer-events-none" />
                    <span className="metadata-precise text-muted-rosegold mb-6 block relative z-10">The Studio</span>
                    <h2 className="font-serif text-[clamp(3rem,6vw,6rem)] text-dream-purple italic font-light tracking-tighter leading-none relative z-10">New Creation</h2>
                </div>
                
                <div className="flex gap-6 mb-16 justify-center">
                    {['snippet', 'story'].map((t) => (
                        <button
                            key={t}
                            onClick={() => setType(t as any)}
                            className={`px-10 py-3 rounded-full metadata-precise transition-all duration-500 ${
                                type === t 
                                ? 'bg-dream-purple text-white shadow-editorial' 
                                : 'bg-dream-purple/5 text-dream-purple hover:bg-dream-purple/10'
                            }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div className="space-y-12">
                    {type === 'story' && (
                        <motion.input
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            type="text"
                            placeholder="Title of the Work"
                            className="w-full bg-transparent border-b border-dream-purple/10 p-6 font-serif text-4xl outline-none placeholder:text-dream-purple/20 focus:border-dream-purple/30 transition-colors"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    )}
                    <textarea
                        className="w-full bg-transparent border border-dream-purple/10 rounded-[2rem] p-6 md:p-12 font-serif text-xl md:text-2xl outline-none focus:border-dream-purple/30 transition-all min-h-[250px] md:min-h-[400px] placeholder:text-dream-purple/20 leading-relaxed custom-scrollbar"
                        placeholder={type === 'snippet' ? "Write a fragment..." : "Write the narrative..."}
                        value={formData.body}
                        onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                    />

                    <input
                        type="password"
                        placeholder="Creator Passphrase"
                        className="w-full bg-transparent border-b border-dream-purple/10 p-4 font-serif text-xl outline-none focus:border-dream-purple/30 transition-all placeholder:text-dream-purple/20"
                        value={formData.passphrase}
                        onChange={(e) => setFormData({ ...formData, passphrase: e.target.value })}
                    />
                    
                    <button 
                        onClick={handlePublish} 
                        className="group relative w-full py-6 bg-dream-purple text-white rounded-[1.5rem] overflow-hidden transition-all duration-700 hover:shadow-editorial active:scale-[0.98]"
                    >
                        <span className="relative z-10 font-serif text-2xl italic">Publish to Archive</span>
                        <div className="absolute inset-0 bg-cherry scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700 ease-editorial" />
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Creator;