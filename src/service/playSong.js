import MPV from 'node-mpv';


const mpvPlayer = new MPV({
    audio_only: true, // Nur Audio abspielen
    debug: false,

    auto_restart: false,
    binary: '/usr/bin/mpv'
});


export const playSong = async (songPath) => {
    try {
        // await mpvPlayer.command('set', 'audio-device', 'alsa/sysdefault:CARD=CODEC');
        await mpvPlayer.load(songPath);
        console.log(`🎶 Spielt jetzt: ${songPath}`);

    } catch (error) {
        console.error('Fehler beim Abspielen:', error);
    }
};
