// import { v2 as cloudinary } from 'cloudinary';
// import dotenv from 'dotenv';

// dotenv.config();


// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });


// const CLOUDINARY_FOLDER = 'nani_songs';  // Der Ordner, in dem die Songs gespeichert sind

// export const getRandomSongs = async () => {
//     try {
//         // Cloudinary-API-Abfrage für Dateien aus dem spezifischen Ordner
//         const result = await cloudinary.api.resources({
//             type: 'upload',
//             prefix: `${CLOUDINARY_FOLDER}/`,  
//             resource_type: 'video'  
//         });

//         const songs = result.resources.map(song => song.secure_url);

//         if (songs.length === 0) throw new Error('Keine Songs in Cloudinary gefunden!');

//         // Zufälligen Song auswählen
//         const randomSong = songs[Math.floor(Math.random() * songs.length)];
//         return randomSong;
//     } catch (error) {
//         throw new Error('Fehler beim Abrufen von Songs: ' + error.message);
//     }
// };

// import { v2 as cloudinary } from 'cloudinary';
// import dotenv from 'dotenv';
// import fs from 'fs/promises';

// dotenv.config();

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const CLOUDINARY_FOLDER = 'nani_songs';  // Der Cloudinary-Ordner mit den Songs
// const LOCAL_CACHE = './song_cache.json'; // Lokaler Cache für Songs

// // Funktion, um alle Songs aus Cloudinary abzurufen (inkl. Paginierung)
// export const getAllCloudinarySongs = async () => {
//     let allSongs = [];
//     let nextCursor = null;

//     try {
//         console.log('Lade Songs von Cloudinary...');

//         do {
//             const result = await cloudinary.api.resources({
//                 type: 'upload',
//                 prefix: `${CLOUDINARY_FOLDER}/`,
//                 resource_type: 'video',
//                 max_results: 50, // Anzahl der maximalen Songs pro Anfrage
//                 next_cursor: nextCursor  // Paginierung
//             });

//             // URLs der Songs extrahieren
//             allSongs = allSongs.concat(result.resources.map(song => song.secure_url));
//             nextCursor = result.next_cursor;  // Setzt den Cursor für die nächste Seite

//             console.log(`Erhalte ${result.resources.length} Songs. Gesamt: ${allSongs.length}`);
//         } while (nextCursor);

//         if (allSongs.length === 0) {
//             throw new Error('Keine Songs in Cloudinary gefunden!');
//         }

//         // Songs im lokalen Cache speichern
//         await fs.writeFile(LOCAL_CACHE, JSON.stringify(allSongs, null, 2));
//         return allSongs;

//     } catch (error) {
//         console.error('Fehler beim Abrufen von Songs:', error.message);
//         throw new Error('Fehler beim Abrufen der Songs aus Cloudinary');
//     }
// };

// // Funktion zum Abrufen eines zufälligen Songs
// export const getRandomSongs = async () => {
//     try {
//         let songs;

//         // Überprüfe, ob Songs lokal zwischengespeichert sind
//         if (await fs.access(LOCAL_CACHE).then(() => true).catch(() => false)) {
//             console.log('Lade Songs aus dem Cache...');
//             const cachedData = await fs.readFile(LOCAL_CACHE, 'utf8');
//             songs = JSON.parse(cachedData);
//         } else {
//             songs = await getAllCloudinarySongs();
//         }

//         if (!songs || songs.length === 0) {
//             throw new Error('Keine Songs gefunden!');
//         }

//         // Zufälligen Song auswählen
//         const randomSong = songs[Math.floor(Math.random() * songs.length)];
//         console.log('🎵 Zufälliger Song ausgewählt:', randomSong);
//         return randomSong;
//     } catch (error) {
//         console.error('Fehler beim Abrufen eines zufälligen Songs:', error.message);
//         throw new Error('Fehler beim Abrufen eines Songs');
//     }
// };

// // Beispielaufruf der Funktion (nur zum Testen)
// (async () => {
//     try {
//         const songUrl = await getRandomSong();
//         console.log('🎧 Spiele zufälligen Song:', songUrl);
//     } catch (error) {
//         console.error('Fehler beim Starten des Songs:', error.message);
//     }
// })();


//=========================== MNT/DIR=========================================
import fs from 'fs';
import path from 'path';

const MUSIC_DIR = '/mnt/MUSIK';

// Funktion zur Überprüfung, ob der Musik-Ordner vorhanden ist
const verifyMusicFolder = () => {
    if (!fs.existsSync(MUSIC_DIR)) {
        throw new Error(`❌ Musik-Ordner nicht gefunden: ${MUSIC_DIR}`);
    }
};

// Funktion zum Abrufen eines zufälligen Songs
export const getRandomSongs = async () => {
    verifyMusicFolder();  // Überprüft den Pfad
    try {
        const files = await fs.promises.readdir(MUSIC_DIR);
        
        // Filtere gültige Musikdateien (MP3/WAV) und ignoriere versteckte Dateien, die mit "." beginnen
        const songs = files.filter(file => 
            (file.toLowerCase().endsWith('.mp3') || file.toLowerCase().endsWith('.wav')) &&
            !file.startsWith('.')
        );

        if (songs.length === 0) {
            throw new Error('❌ Keine Songs gefunden!');
        }

        // Zufälligen Song auswählen
        const randomSong = songs[Math.floor(Math.random() * songs.length)];
        const fullPath = path.join(MUSIC_DIR, randomSong);

        console.log(`🎵 Zufällig ausgewählter Song: ${fullPath}`);
        return fullPath;
    } catch (error) {
        console.error('Fehler beim Laden von Songs:', error.message);
        throw new Error('❌ Fehler beim Laden der Songs: ' + error.message);
    }
};

