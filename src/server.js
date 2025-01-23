import express from 'express';
import { startGpioListener } from './utils/gpioListener.js';


const PORT = 5000;
const app = express()

const serverlistenToPort = () => {
    console.log("Starting server...");
    app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

    // GPIO Listener starten
    startGpioListener();
};

serverlistenToPort();