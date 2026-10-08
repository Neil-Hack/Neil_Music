const playBtn = document.getElementById('play');
const playIcon = document.getElementById('play-icon');
const resetBtn = document.getElementById('reset');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progressBar = document.getElementById('progress-bar');
const audioPlayer = document.getElementById('audio-player');
const playlistItems = document.querySelectorAll('ul li');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const vinylDisc = document.getElementById('vinyl-disc');
const vinylLabel = document.getElementById('vinyl-label');

let currentTrackIndex = 0;

// Fonction pour lire l'image intégrée dans le fichier MP3 (ou afficher "Neil")
function loadTrackMetadata(musicSrc) {
    vinylLabel.innerHTML = `<span>Neil</span>`;

    jsmediatags.read(musicSrc, {
        onSuccess: function(tag) {
            const image = tag.tags.picture;
            if (image) {
                let base64String = "";
                for (let i = 0; i < image.data.length; i++) {
                    base64String += String.fromCharCode(image.data[i]);
                }
                let base64 = "data:" + image.format + ";base64," + window.btoa(base64String);
                vinylLabel.innerHTML = `<img src="${base64}" alt="Cover">`;
            } else {
                vinylLabel.innerHTML = `<span>Neil</span>`;
            }
        },
        onError: function(error) {
            vinylLabel.innerHTML = `<span>Neil</span>`;
        }
    });
}

// Fonction pour charger et jouer une musique
function loadTrack(index) {
    if (index < 0) index = playlistItems.length - 1;
    if (index >= playlistItems.length) index = 0;
    
    currentTrackIndex = index;
    
    playlistItems.forEach(item => item.classList.remove('active'));
    const currentItem = playlistItems[currentTrackIndex];
    currentItem.classList.add('active');
    
    const musicSrc = currentItem.getAttribute('data-src');
    audioPlayer.src = musicSrc;
    audioPlayer.play();
    
    // Change l'icône en mode PAUSE pendant la lecture
    playIcon.src = 'media/pause.png'; 
    vinylDisc.classList.add('spinning');

    loadTrackMetadata(musicSrc);
}

// Bouton Play / Pause
playBtn.addEventListener('click', () => {
    if (audioPlayer.paused) {
        if (!audioPlayer.src) {
            loadTrack(0);
        } else {
            audioPlayer.play();
            playIcon.src = 'media/pause.png'; // Passe à l'icône Pause
            vinylDisc.classList.add('spinning');
        }
    } else {
        audioPlayer.pause();
        playIcon.src = 'media/Play.png'; // Repasse à l'icône Play
        vinylDisc.classList.remove('spinning');
    }
});

// Bouton Suivant
nextBtn.addEventListener('click', () => {
    loadTrack(currentTrackIndex + 1);
});

// Bouton Précédent
prevBtn.addEventListener('click', () => {
    loadTrack(currentTrackIndex - 1);
});

// Bouton Reset
resetBtn.addEventListener('click', () => {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    playIcon.src = 'media/Play.png'; // Repasse à l'icône Play
    progressBar.value = 0;
    vinylDisc.classList.remove('spinning');
    vinylLabel.innerHTML = `<span>Neil</span>`;
});

// Cliquer directement sur un morceau de la liste
playlistItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        loadTrack(index);
    });
});

// Mise à jour de la barre et du temps en direct
audioPlayer.addEventListener('timeupdate', () => {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;

    if (duration) {
        const progressPercent = (currentTime / duration) * 100;
        progressBar.value = progressPercent;

        let currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        if (currentSeconds < 10) currentSeconds = '0' + currentSeconds;
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;

        let durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);
        if (durationSeconds < 10) durationSeconds = '0' + durationSeconds;
        durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
    }
});

// Déplacer le curseur manuellement
progressBar.addEventListener('input', () => {
    if (audioPlayer.duration) {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    }
});

// Passer automatiquement à la suivante à la fin et remettre l'icône Play si c'était la dernière
audioPlayer.addEventListener('ended', () => {
    loadTrack(currentTrackIndex + 1);
});