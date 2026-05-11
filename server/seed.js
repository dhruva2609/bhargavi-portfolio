import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Work from './models/Work.js';

dotenv.config();

const stories = [
  {
    title: "The Architecture of Silence",
    body: "In the quiet corridors of the mind, words are not merely spoken; they are sculpted. Urdu calligraphy, with its sweeping curves and precise dots, is more than an art form—it is a breath captured on paper. Each stroke of the qalam carries the weight of a thousand years, a lineage of poets who found solace in the geometry of the soul. When the ink meets the vellum, the world outside ceases to exist. There is only the rhythm of the heart and the graceful arc of the 'Seen', as it stretches towards infinity. To write is to acknowledge the void and to fill it with beauty. It is the architecture of silence, built one syllable at a time.",
    category: "Poetic Essay",
    readTime: 4
  },
  {
    title: "Petrichor & Paper",
    body: "There is a specific kind of magic that occurs when the first raindrops of the monsoon hit the parched earth. It is a scent that cannot be bottled, only remembered. For Bhargavi, this fragrance—the petrichor—is always inextricably linked to the smell of old, yellowed book pages. In her study, the windows are thrown wide, letting in the cool, damp air that smells of the forest and the sky. She sits with a worn copy of Ghalib's Diwan, the leather cover soft against her palms. The rain drums a rhythmic pattern on the tin roof, a celestial percussion that accompanies the turning of every page. Here, in this intersection of nature and literature, the world feels complete.",
    category: "Narrative Fragment",
    readTime: 5
  },
  {
    title: "The Unwritten Letter",
    body: "The train rattled through the twilight, its yellow windows casting long, flickering shadows across the platform. On a mahogany bench, a single envelope remained. It was unsealed, its edges slightly frayed, bearing no name and no address. Inside was a single sheet of ivory paper, blank save for a faint scent of jasmine. This was the unwritten letter—the message that was too heavy to carry and too fragile to send. It contained the words that were left unspoken at the station, the apologies that dissolved in the steam of the locomotive. As the night deepened, a stray breeze caught the paper, lifting it into the air where it danced for a moment like a ghost, before settling back into the quiet archive of lost things.",
    category: "Short Story",
    readTime: 6
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to the archive...");

    // Clear existing works to avoid duplicates during seeding
    await Work.deleteMany({});
    
    const preparedStories = stories.map(s => ({
      ...s,
      slug: s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      synopsis: s.body.substring(0, 150) + '...',
      publishedAt: new Date()
    }));

    await Work.insertMany(preparedStories);
    console.log("Sample books have been etched into the archive.");
    
    process.exit(0);
  } catch (err) {
    console.error("The quill broke:", err);
    process.exit(1);
  }
};

seedDatabase();
