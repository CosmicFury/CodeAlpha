document.addEventListener("DOMContentLoaded", () => {
  const audioPlayer = document.getElementById("audio-player");
  const playBtn = document.getElementById("play-btn");
  const playIcon = document.getElementById("play-icon");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const progress = document.getElementById("progress");
  const songTitle = document.getElementById("song-title");
  const songArtist = document.getElementById("song-artist");
  const songImage = document.getElementById("song-image");
  const currentTime = document.getElementById("current-time");
  const duration = document.getElementById("duration");
  const colorThief = new ColorThief();
  const songList = document
    .getElementById("song-list")
    .getElementsByTagName("li");

  let currentIndex = 0;
  let isPlaying = false;
  let updateTimer;

  // Add this function to script.js
  function updatePinkElementsColor(color) {
    document.documentElement.style.setProperty(
      "--primary-color",
      `rgb(${color[0]}, ${color[1]}, ${color[2]})`
    );
    document.documentElement.style.setProperty(
      "--shadow-color",
      `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.22)`
    );

    // Update all elements with dynamic-color class
    document.querySelectorAll(".dynamic-color").forEach((element) => {
      element.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    });
  }

  function togglePlay() {
    if (isPlaying) {
      audioPlayer.pause();
      playIcon.classList.replace("fa-pause", "fa-play");
    } else {
      audioPlayer.play();
      playIcon.classList.replace("fa-play", "fa-pause");
    }
    isPlaying = !isPlaying;
  }

  function loadSong(index) {
    const song = songList[index];
    audioPlayer.src = song.dataset.src;
    songTitle.textContent = song.dataset.title;
    songArtist.textContent = song.dataset.artist;
    songImage.src = song.dataset.image;

    // Modify the songImage.onload function in script.js
    songImage.onload = () => {
      const color = colorThief.getColor(songImage);
      document.body.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
      updatePinkElementsColor(color); // Update pink elements color
    };

    audioPlayer.load();
    if (isPlaying) togglePlay();
    progress.value = 0;
    currentIndex = index;
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  function updateProgress() {
    progress.value = audioPlayer.currentTime;
    currentTime.textContent = formatTime(audioPlayer.currentTime);
    if (!audioPlayer.paused) {
      updateTimer = requestAnimationFrame(updateProgress);
    }
  }

  audioPlayer.addEventListener("loadedmetadata", () => {
    progress.max = audioPlayer.duration;
    duration.textContent = formatTime(audioPlayer.duration);
  });

  audioPlayer.addEventListener("play", () => {
    updateTimer = requestAnimationFrame(updateProgress);
  });

  audioPlayer.addEventListener("pause", () => {
    cancelAnimationFrame(updateTimer);
  });

  audioPlayer.addEventListener("ended", () => {
    nextBtn.click();
  });

  progress.addEventListener("input", () => {
    audioPlayer.currentTime = progress.value;
    if (!isPlaying) togglePlay();
  });

  playBtn.addEventListener("click", togglePlay);
  prevBtn.addEventListener("click", () =>
    loadSong((currentIndex - 1 + songList.length) % songList.length)
  );
  nextBtn.addEventListener("click", () =>
    loadSong((currentIndex + 1) % songList.length)
  );

  Array.from(songList).forEach((item, index) => {
    item.addEventListener("click", () => loadSong(index));
  });

  // Keyboard controls
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
      e.preventDefault();
      togglePlay();
    } else if (e.code === "ArrowLeft") {
      prevBtn.click();
    } else if (e.code === "ArrowRight") {
      nextBtn.click();
    }
  });

  // Load first song
  loadSong(currentIndex);

  // Local storage for last played song
  audioPlayer.addEventListener("timeupdate", () => {
    localStorage.setItem("lastSongIndex", currentIndex);
    localStorage.setItem("lastSongTime", audioPlayer.currentTime);
  });

  const lastSongIndex = localStorage.getItem("lastSongIndex");
  const lastSongTime = localStorage.getItem("lastSongTime");
  if (lastSongIndex && lastSongTime) {
    loadSong(parseInt(lastSongIndex));
    audioPlayer.currentTime = parseFloat(lastSongTime);
  }
});
