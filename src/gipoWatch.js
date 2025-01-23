import { exec } from 'child_process';

const gpiochip = 'gpiochip0';
const pin = 27;
let lastValue = null;

console.log(`Überwache GPIO ${pin} auf ${gpiochip}...`);

function readGpio() {
    exec(`gpioget ${gpiochip} ${pin}`, (err, stdout) => {
        if (err) {
            console.error('Fehler beim Ausführen von gpioget:', err);
            return;
        }

        const value = stdout.trim();
        if (value !== lastValue) {
            lastValue = value;
            console.log(value === '1' ? 'Taster gedrückt!' : 'Taster losgelassen.');
        }
    });
}

// GPIO alle 100ms abfragen
setInterval(readGpio, 100);

process.on('SIGINT', () => {
    console.log('Programm beendet.');
    process.exit();
});