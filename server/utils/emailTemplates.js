const COLORS = {
    purple: '#6B4E71',
    cherry: '#FF4D8D',
    rosegold: '#B76E79',
    offWhite: '#FDF6F5',
    charcoal: '#4A4A4A'
};

export const welcomeTemplate = (source) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; padding: 0; background-color: ${COLORS.offWhite}; }
        .container { 
            max-width: 600px; 
            margin: 40px auto; 
            background: white; 
            border: 1px solid rgba(107, 78, 113, 0.1);
            padding: 60px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.02);
        }
        .header { text-align: center; margin-bottom: 50px; }
        .metadata { 
            font-family: sans-serif; 
            font-size: 8px; 
            text-transform: uppercase; 
            letter-spacing: 0.5em; 
            color: ${COLORS.rosegold};
            margin-bottom: 20px;
            display: block;
        }
        .title { 
            font-family: Georgia, serif; 
            font-size: 36px; 
            font-style: italic; 
            color: ${COLORS.purple}; 
            margin: 0;
            line-height: 1.2;
        }
        .content { 
            font-family: Georgia, serif; 
            font-size: 18px; 
            color: ${COLORS.charcoal}; 
            line-height: 1.8;
            margin-bottom: 40px;
        }
        .footer { 
            border-top: 1px solid rgba(107, 78, 113, 0.05);
            padding-top: 30px;
            text-align: center;
        }
        .feather {
            font-size: 24px;
            opacity: 0.3;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 15px 40px;
            background-color: ${COLORS.purple};
            color: white !important;
            text-decoration: none;
            border-radius: 50px;
            font-family: serif;
            font-style: italic;
            font-size: 18px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span class="metadata">Subscription Confirmed</span>
            <h1 class="title">The Midnight Bulletin</h1>
        </div>
        
        <div class="content">
            ${source === 'Archive Muse' ? `
                <p>Your name has been etched into the ledger of the <strong>Archive Muse</strong>.</p>
                <p>From now on, you will be the first to know when a new story begins, a chapter closes, or a secret narrative is unearthed from the bookshelf.</p>
            ` : source === 'Melodies' ? `
                <p>The rhythm of your interest has been recorded in the <strong>Melodies</strong> collection.</p>
                <p>Whenever a new song is composed or a lyric is whispered into the silence, the resonance will find its way directly to you.</p>
            ` : source === 'Archive (Echoes)' ? `
                <p>You are now tuned to the <strong>Recent Echoes</strong> of the archive.</p>
                <p>Prepare to receive short fragments, fleeting whispers, and the raw poetry of the moment as they are etched into the digital walls.</p>
            ` : `
                <p>You have been successfully added to the silent archive.</p>
                <p>Whether you joined from the <em>${source || 'sanctuary'}</em> or found your way through the shadows, your presence is appreciated.</p>
                <p>From now on, whenever a new narrative is etched or a melody is composed, a fragment will find its way to your inbox.</p>
            `}
            
            <div style="text-align: center;">
                <a href="https://bhargavi-portfolio.vercel.app" class="button">Visit the Archive</a>
            </div>
        </div>
        
        <div class="footer">
            <div class="feather">🪶</div>
            <span class="metadata" style="letter-spacing: 0.2em; font-size: 7px;">Bhargavi &mdash; Writer & Storyteller</span>
        </div>
    </div>
</body>
</html>
`;

export const inquiryTemplate = (name, email, message, source) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; padding: 0; background-color: ${COLORS.offWhite}; }
        .container { 
            max-width: 600px; 
            margin: 40px auto; 
            background: white; 
            border-left: 4px solid ${COLORS.cherry};
            padding: 40px;
        }
        .header { margin-bottom: 30px; }
        .label { 
            font-family: sans-serif; 
            font-size: 9px; 
            text-transform: uppercase; 
            letter-spacing: 0.3em; 
            color: ${COLORS.cherry};
            font-weight: bold;
        }
        .field {
            margin-bottom: 20px;
        }
        .field-label {
            font-family: sans-serif;
            font-size: 10px;
            color: #999;
            display: block;
            margin-bottom: 5px;
        }
        .field-value {
            font-family: 'Georgia', serif;
            font-size: 16px;
            color: ${COLORS.charcoal};
        }
        .message-box {
            background: #FDF9F9;
            padding: 25px;
            border-radius: 8px;
            font-family: 'Georgia', serif;
            font-style: italic;
            font-size: 18px;
            line-height: 1.6;
            color: ${COLORS.purple};
            margin-top: 30px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span class="label">New Collaboration Inquiry</span>
        </div>
        
        <div class="field">
            <span class="field-label">From</span>
            <span class="field-value">${name} (${email})</span>
        </div>
        
        <div class="field">
            <span class="field-label">Source Context</span>
            <span class="field-value">${source || 'General Portfolio'}</span>
        </div>
        
        <div class="message-box">
            "${message}"
        </div>
        
        <div style="margin-top: 40px; font-family: sans-serif; font-size: 10px; color: #ccc;">
            Sent from Bhargavi's Editorial Studio
        </div>
    </div>
</body>
</html>
`;

export const broadcastTemplate = (type, title, summary, link) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { margin: 0; padding: 0; background-color: ${COLORS.offWhite}; }
        .container { 
            max-width: 600px; 
            margin: 40px auto; 
            background: white; 
            border: 1px solid rgba(107, 78, 113, 0.1);
            padding: 60px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.02);
        }
        .header { text-align: center; margin-bottom: 50px; }
        .metadata { 
            font-family: sans-serif; 
            font-size: 8px; 
            text-transform: uppercase; 
            letter-spacing: 0.5em; 
            color: ${COLORS.rosegold};
            margin-bottom: 20px;
            display: block;
        }
        .type-label {
            display: inline-block;
            padding: 4px 12px;
            background-color: ${COLORS.purple}10;
            color: ${COLORS.purple};
            font-family: sans-serif;
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.2em;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .title { 
            font-family: Georgia, serif; 
            font-size: 32px; 
            font-style: italic; 
            color: ${COLORS.purple}; 
            margin: 0;
            line-height: 1.2;
        }
        .content { 
            font-family: Georgia, serif; 
            font-size: 18px; 
            color: ${COLORS.charcoal}; 
            line-height: 1.8;
            margin-bottom: 40px;
        }
        .summary {
            font-style: italic;
            border-left: 2px solid ${COLORS.rosegold}30;
            padding-left: 20px;
            margin: 30px 0;
            color: ${COLORS.charcoal}90;
        }
        .footer { 
            border-top: 1px solid rgba(107, 78, 113, 0.05);
            padding-top: 30px;
            text-align: center;
        }
        .feather {
            font-size: 24px;
            opacity: 0.3;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 15px 40px;
            background-color: ${COLORS.purple};
            color: white !important;
            text-decoration: none;
            border-radius: 50px;
            font-family: serif;
            font-style: italic;
            font-size: 18px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span class="metadata">A New Fragment Has Surfaced</span>
            <div class="type-label">${type}</div>
            <h1 class="title">${title}</h1>
        </div>
        
        <div class="content">
            <p>The archive has expanded. A new piece of narrative has been etched into the collection, and as a subscriber, you are among the first to witness it.</p>
            
            <div class="summary">
                "${summary}"
            </div>
            
            <div style="text-align: center;">
                <a href="${link || 'https://bhargavi-portfolio.vercel.app'}" class="button">Read the Full Echo</a>
            </div>
        </div>
        
        <div class="footer">
            <div class="feather">🪶</div>
            <span class="metadata" style="letter-spacing: 0.2em; font-size: 7px;">Bhargavi &mdash; Writer & Storyteller</span>
        </div>
    </div>
</body>
</html>
`;
