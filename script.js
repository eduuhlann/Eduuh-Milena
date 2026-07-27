document.addEventListener('DOMContentLoaded', () => {
  const memories = document.querySelectorAll('.memory');

  // Intersection Observer for memory animations
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  memories.forEach((m) => observer.observe(m));

  // Progress bar
  const progressFill = document.querySelector('.progress-fill');

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    progressFill.style.width = progress + '%';
  });

  // Counter: há X dias juntos
  const counterEl = document.querySelector('.counter');
  const startDate = new Date('2026-06-22T00:00:00');

  function updateCounter() {
    const now = new Date();
    const diff = now - startDate;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    counterEl.innerHTML = `Há <span>${days}</span> dias, <span>${hours}</span> horas e <span>${minutes}</span> minutos juntos`;
  }

  updateCounter();
  setInterval(updateCounter, 60000);

  // Carousel
  const carouselSection = document.querySelector('.carousel-section');
  const track = document.querySelector('.carousel-track');
  const imgs = track.querySelectorAll('img');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  let current = 0;

  const carouselObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          carouselObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  carouselObserver.observe(carouselSection);

  function updateCarousel() {
    track.style.transform = `translateX(-${current * 100}%)`;
  }

  nextBtn.addEventListener('click', () => {
    current = (current + 1) % imgs.length;
    updateCarousel();
  });

  prevBtn.addEventListener('click', () => {
    current = (current - 1 + imgs.length) % imgs.length;
    updateCarousel();
  });

  // Music player
  const playBtn = document.querySelector('.play-btn');
  const rewindBtn = document.querySelector('.rewind');
  const forwardBtn = document.querySelector('.forward');
  const bgMusic = document.getElementById('bgMusic');
  const musicBar = document.querySelector('.music-bar');
  const musicBarFill = document.querySelector('.music-bar-fill');
  const musicBarThumb = document.querySelector('.music-bar-thumb');
  const currentTimeEl = document.querySelector('.music-time.current');
  const durationEl = document.querySelector('.music-time.duration');
  const musicDisc = document.querySelector('.music-disc');
  let isPlaying = false;

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  playBtn.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      playBtn.innerHTML = '&#9654;';
      musicDisc.classList.remove('spinning');
    } else {
      bgMusic.play();
      playBtn.innerHTML = '&#9646;&#9646;';
      musicDisc.classList.add('spinning');
    }
    isPlaying = !isPlaying;
  });

  rewindBtn.addEventListener('click', () => {
    bgMusic.currentTime = Math.max(0, bgMusic.currentTime - 10);
  });

  forwardBtn.addEventListener('click', () => {
    bgMusic.currentTime = Math.min(bgMusic.duration, bgMusic.currentTime + 10);
  });

  bgMusic.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(bgMusic.duration);
  });

  bgMusic.addEventListener('timeupdate', () => {
    const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
    musicBarFill.style.width = progress + '%';
    musicBarThumb.style.left = progress + '%';
    currentTimeEl.textContent = formatTime(bgMusic.currentTime);
  });

  musicBar.addEventListener('click', (e) => {
    const rect = musicBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    bgMusic.currentTime = percent * bgMusic.duration;
  });

  bgMusic.addEventListener('ended', () => {
    playBtn.innerHTML = '&#9654;';
    musicDisc.classList.remove('spinning');
    isPlaying = false;
  });
});
