import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const CLOUDINARY_FOLDER = 'nani_songs';  // Der Ordner, in dem die Songs gespeichert sind

export const getRandomSongs = async () => {
    try {
        // Cloudinary-API-Abfrage für Dateien aus dem spezifischen Ordner
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: `${CLOUDINARY_FOLDER}/`,  
            resource_type: 'video'  
        });

        const songs = result.resources.map(song => song.secure_url);

        if (songs.length === 0) throw new Error('Keine Songs in Cloudinary gefunden!');

        // Zufälligen Song auswählen
        const randomSong = songs[Math.floor(Math.random() * songs.length)];
        return randomSong;
    } catch (error) {
        throw new Error('Fehler beim Abrufen von Songs: ' + error.message);
    }
};






// // Hier den korrekten Musikpfad auf deinem Raspberry Pi angeben
// const MUSIC_DIR = '/mnt/MUSIK';


// // Funktion zur Überprüfung, ob der Pfad korrekt ist
//     const verifyMusicFolder = () => {
//     if (!fs.existsSync(MUSIC_DIR)) {
//         throw new Error(`Musik-Ordner nicht gefunden: ${MUSIC_DIR}`);
//     }
// };

// // Funktion zum Abrufen eines zufälligen Songs
// export const getRandomSongs = async () => {
//     verifyMusicFolder(); // Überprüft den Pfad
//     try {
//         const files = await fs.promises.readdir(MUSIC_DIR);
//         const songs = files.filter(file => file.endsWith('.mp3') || file.endsWith('.wav'));
        
//         if (songs.length === 0) throw new Error('Keine Songs gefunden!');
        
//         const randomSong = songs[Math.floor(Math.random() * songs.length)];
//         return path.join(MUSIC_DIR, randomSong); // Voller Pfad zurückgeben
//     } catch (error) {
//         throw new Error('Error loading songs: ' + error.message);
//     }
// };
