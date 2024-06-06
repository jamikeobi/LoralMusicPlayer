const albums = [
    {
        name: 'S2 - Wizkid',
        description: 'This is the first album',
        category: 'Afrobeats',
        cover: './images/Album1/s2Cover.jpg',
        plays: 1200,
        tracks: [
            {
                audioSource: './audio/Wizkid-Diamonds-(TrendyBeatz.com).mp3',
                artist: 'Wizkid',
                title: 'Diamonds',
            },
            {
                audioSource: './audio/Wizkid-Ft-Zlatan-IDK-(TrendyBeatz.com).mp3',
                artist: 'Wizkid feat. Zlatan',
                title: 'IDK',
            }
        ]
    },
    {
        name: 'Album 2',
        description: 'This is the second album',
        category: 'Hip-Hop',
        cover: './images/album2.jpg',
        plays: 950,
        tracks: [
            {
                audioSource: './audio/Wizkid-Sweet-One-(TrendyBeatz.com).mp3',
                artist: 'Wizkid',
                title: 'Sweet One',
            },
            {
                audioSource: './audio/another-song.mp3',
                artist: 'Another Artist',
                title: 'Another Song',
            }
        ]
    }
];

var currentAlbumIndex = 0; // variable to store current index of album
var currentSongIndex = 0; // variable to store current index of song
var audio = document.getElementById('audio');
var playPauseButton = document.getElementById('playPause');
var seekSlider = document.getElementById('seekSlider');
var songInfo = document.querySelector('.song-info');
var albumCover = document.getElementById('albumCover');
let albumList = document.getElementById('albumList');
var searchBar = document.getElementById('searchBar');

function loadSong(albumIndex, songIndex) {
    const song =- albums[albumIndex].tracks[songIndex];
    audio.src = song.audioSource;
    audio.load();
    songInfo.textContent = song.artist + ' - ' + song.title + ' (0:00 / ' + formatTime(audio.duration) + ')'; 
    albumCover.src = albums[albumIndex].cover;
}

loadSong(currentAlbumIndex, currentSongIndex); // This will load initial song

function playPause(){
    if (audio.paused || audio.currentTime <= 0) {
        audio.play();
        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        audio.pause();
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function prevSong(){
    currentSongIndex = (currentSongIndex - 1 + albums[currentAlbumIndex].tracks.length) % albums[currentAlbumIndex].tracks.length;
    loadSong(currentAlbumIndex, currentSongIndex);
    playPause();
}

function nextSong(){
    currentSongIndex = (currentSongIndex + 1) % albums[currentAlbumIndex].tracks.length;
    loadSong(currentAlbumIndex, currentSongIndex);
    playPause();
}

audio.addEventListener('timeupdate', function() {
    seekSlider.value = audio.currentTime;
    songInfo.textContent = albums[currentAlbumIndex].tracks[currentSongIndex].artist + ' - ' + albums[currentAlbumIndex].tracks[currentSongIndex].title + ' (' + formatTime(audio.currentTime) + ' / ' + formatTime(audio.duration) + ')';
});

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = Math.floor(seconds % 60);
    if (remainingSeconds < 10) {
        remainingSeconds = '0' + remainingSeconds;
    }
    return minutes + ':' + remainingSeconds;
}

seekSlider.addEventListener('input', function() {
    audio.currentTime = seekSlider.value;
});

function populateAlbumList() {
    albumList.innerHTML = ''; // Clear existing albums
    albums.forEach((album, index) => {
        let li = document.createElement('li');
        li.innerHTML = `
            <div class="album-info">
                <img src="${album.cover}" alt="Album Cover">
                <div class="album-name">${album.name}</div>
                <div class="album-description">${album.description}</div>
                <div class="album-category">Category: ${album.category}</div>
                <div class="album-plays"><i class="fas fa-headphones"></i> ${album.plays}</div>
            </div>
        `;
        li.addEventListener('click', function() {
            currentAlbumIndex = index;
            currentSongIndex = 0; // Reset to first song
            loadSong(currentAlbumIndex, currentSongIndex);
            populateSongList();
        });
        albumList.appendChild(li);
    });
}

function populateSongList() {
    let songList = document.getElementById('songList');
    songList.innerHTML = ''; // Clear existing songs
    albums[currentAlbumIndex].tracks.forEach((song, index) => {
        let li = document.createElement('li');
        li.textContent = song.artist + ' - ' + song.title;
        li.addEventListener('click', function() {
            currentSongIndex = index;
            loadSong(currentAlbumIndex, currentSongIndex);
            playPause();
        });
        songList.appendChild(li);
    });
}

searchBar.addEventListener('input', function() {
    let filter = searchBar.value.toLowerCase();
    let albumItems = albumList.getElementsByTagName('li');
    Array.from(albumItems).forEach(function(item) {
        let albumName = item.querySelector('.album-name').textContent;
        let albumDescription = item.querySelector('.album-description').textContent;
        if (albumName.toLowerCase().includes(filter) || albumDescription.toLowerCase().includes(filter)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
});

populateAlbumList();
populateSongList();
