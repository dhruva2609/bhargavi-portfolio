const SnippetCard = ({ content, date }) => {
    return (
        <div className="bg-white/40 backdrop-blur-lg border border-white/60 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300">
            <p className="font-sans text-charcoal leading-relaxed italic">"{content}"</p>
            <div className="mt-4 flex justify-between items-center text-xs text-sage font-medium tracking-widest uppercase">
                <span>{date}</span>
                <span className="text-rosegold">● Bhargavi</span>
            </div>
        </div>
    );
};

export default SnippetCard;