import { exec } from 'child_process';

const gpiochip = 'gpiochip0';
const pin = 27;
let lastValue = null;

console.log(`Überwache GPIO ${pin} auf ${gpiochip}...`);

// Funktion zur Überprüfung des GPIO-Pull-Status und des aktuellen Zustands
function readGpioStatus() {
    // Liest den aktuellen Zustand des Pins (0 oder 1)
    exec(`gpioget ${gpiochip} ${pin}`, (err, stdout) => {
        if (err) {
            console.error('Fehler beim Ausführen von gpioget:', err);
            return;
        }

        const value = stdout.trim();
        
        // Überprüfen, ob sich der Wert geändert hat
        if (value !== lastValue) {
            lastValue = value;
            console.log(`GPIO Status: ${value === '0' ? 'LOW (0) - Taster gedrückt' : 'HIGH (1) - Taster losgelassen'}`);
        }
    });

    // Prüft, ob der Pin als Pull-up oder Pull-down konfiguriert ist
    exec(`gpioinfo ${gpiochip}`, (err, stdout) => {
        if (err) {
            console.error('Fehler beim Abrufen der GPIO-Informationen:', err);
            return;
        }


    });
}

// Alle 100ms GPIO-Status prüfen
setInterval(readGpioStatus, 50);

process.on('SIGINT', () => {
    console.log('Programm beendet.');
    process.exit();
});
