export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                pearl: '#FFFBF2',
                blush: '#FFE4E1',
                rosegold: '#E7C1B1',
                sage: '#B2AC88',
                charcoal: '#333333',
            },
            fontFamily: {
                serif: ['Cormorant Garamond', 'serif'],
                sans: ['Montserrat', 'sans-serif'],
            },
        },
    },
    plugins: [],
}