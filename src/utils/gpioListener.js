import { exec } from 'child_process';
import { songService } from '../service/index.js';

const gpiochip = 'gpiochip0';
const pin = 27;
let isPlaying = false; // Verhindert mehrfaches Abspielen
let pressCount = 0; // Zählt die Anzahl der Drücke
let lastPressTime = 0; // Zeit des letzten Tasterdrücks
let lastValue = '1'; // Letzter Zustand des Pins (1 = nicht gedrückt)
let currentSongPath = null; // Speichert den aktuellen Song-Pfad
let programInitialized = false; // Status: Programm initialisiert
let actionTriggered = false; // Verhindert doppelte Aktionen
let songTimer = null; // Timer für die 20 Sekunden Song-Dauer

console.log(`LIST==Überwache GPIO ${pin} auf ${gpiochip}...`);

export const startGpioListener = async () => {
    console.log("GPIO Listener gestartet.");

    while (true) {
        try {
            exec(`gpioget ${gpiochip} ${pin}`, async (err, stdout) => {
                if (err) {
                    console.error('Fehler beim Ausführen von gpioget:', err.message);
                    return;
                }

                const value = stdout.trim();
                const currentTime = Date.now();

                // Nur reagieren, wenn der Zustand von 1 auf 0 wechselt (Taster gedrückt)
                if (value === '0' && lastValue === '1') {
                    if (!programInitialized) {
                        // Initialisiere Programm beim ersten Druck
                        console.log('🎵 Initialisiere Programm: Spiele zufälligen Song.');
                        await playNewSong();
                        return; // Kein Zählen für den ersten Druck
                    }

                    // Prüfen, ob der Taster innerhalb von 3 Sekunden gedrückt wurde
                    if (currentTime - lastPressTime <= 3000) {
                        pressCount++;
                    } else {
                        pressCount = 1; // Neustart des Zählers
                    }

                    console.log(`Taster gedrückt! Zähler: ${pressCount}`);

                    if (!isPlaying) {
                        actionTriggered = false; // Aktion wird noch nicht getriggert

                        // Kurze Verzögerung, um auf möglichen dritten Druck zu warten
                        setTimeout(async () => {
                            if (pressCount === 2 && !actionTriggered) {
                                console.log('🎵 Zweimal gedrückt: Wiederhole aktuellen Song.');
                                actionTriggered = true; // Aktion ausführen und blockieren
                                await repeatSong();
                            } else if (pressCount === 3 && !actionTriggered) {
                                console.log('🎵 Dreimal gedrückt: Wähle neuen zufälligen Song.');
                                actionTriggered = true; // Aktion ausführen und blockieren
                                await playNewSong();
                            }
                        }, 2000); // 500 ms Verzögerung, um auf zusätzlichen Druck zu warten
                    }

                    lastPressTime = currentTime; // Zeit des letzten Drückens aktualisieren
                }

                lastValue = value; // Zustand aktualisieren
            });

            await new Promise(resolve => setTimeout(resolve, 100)); // 100 ms Pause
        } catch (error) {
            console.error('Fehler beim Überwachen des GPIO:', error.message);
        }
    }
};

// Funktion zum Abspielen eines neuen Songs
const playNewSong = async () => {
    programInitialized = true;
    pressCount = 0; // Zähler zurücksetzen
    clearTimeout(songTimer); // Timer zurücksetzen
    currentSongPath = await songService.getRandomSongs();
    console.log('🎵 Neuer Song gestartet.');
    await songService.playSong(currentSongPath);
    startSongTimer();
};

// Funktion zum Wiederholen des aktuellen Songs
const repeatSong = async () => {
    pressCount = 0; // Zähler zurücksetzen
    clearTimeout(songTimer); // Timer zurücksetzen
    console.log('🎵 Wiederhole aktuellen Song.');
    await songService.playSong(currentSongPath);
    startSongTimer();
};

// Funktion zum Starten des Song-Timers
const startSongTimer = () => {
    songTimer = setTimeout(() => {
        console.log('🎵 Song beendet. Warte auf neuen Start.');
        programInitialized = false; // Zurücksetzen auf Initialstatus
    }, 20000); // Song-Dauer: 20 Sekunden
};

// Funktion zum Warten, bis der Taster losgelassen wird
const waitForRelease = async () => {
    console.log('⏳ Warte auf Loslassen des Tasters...');
    return new Promise(resolve => {
        const interval = setInterval(() => {
            exec(`gpioget ${gpiochip} ${pin}`, (err, stdout) => {
                if (err) {
                    console.error('Fehler beim Überwachen des GPIO:', err.message);
                    clearInterval(interval);
                    resolve();
                    return;
                }

                const value = stdout.trim();
                if (value === '1') {
                    console.log('✅ Taster losgelassen.');
                    clearInterval(interval);
                    resolve();
                }
            });
        }, 100); // Abfrage alle 100 ms
    });
};
