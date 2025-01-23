import fs from 'fs';
import path from 'path';

// Hier den korrekten Musikpfad auf deinem Raspberry Pi angeben
const MUSIC_DIR = '/mnt/MUSIK';


// Funktion zur Überprüfung, ob der Pfad korrekt ist
    const verifyMusicFolder = () => {
    if (!fs.existsSync(MUSIC_DIR)) {
        throw new Error(`Musik-Ordner nicht gefunden: ${MUSIC_DIR}`);
    }
};

// Funktion zum Abrufen eines zufälligen Songs
export const getRandomSongs = async () => {
    verifyMusicFolder(); // Überprüft den Pfad
    try {
        const files = await fs.promises.readdir(MUSIC_DIR);
        const songs = files.filter(file => file.endsWith('.mp3') || file.endsWith('.wav'));
        
        if (songs.length === 0) throw new Error('Keine Songs gefunden!');
        
        const randomSong = songs[Math.floor(Math.random() * songs.length)];
        return path.join(MUSIC_DIR, randomSong); // Voller Pfad zurückgeben
    } catch (error) {
        throw new Error('Error loading songs: ' + error.message);
    }
};


