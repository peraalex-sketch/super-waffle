// Carousel State Management
class InstagramCarousel {
  constructor() {
    this.currentSlide = 1;
    this.totalSlides = 5;
    this.slides = document.querySelectorAll('.carousel-slide');
    this.indicators = document.querySelectorAll('.indicator');
    this.prevBtn = document.querySelector('.nav-prev');
    this.nextBtn = document.querySelector('.nav-next');

    this.init();
  }

  init() {
    this.attachEventListeners();
    this.updateCarousel();
  }

  attachEventListeners() {
    // Navigation buttons
    this.prevBtn.addEventListener('click', () => this.previousSlide());
    this.nextBtn.addEventListener('click', () => this.nextSlide());

    // Indicator buttons
    this.indicators.forEach((indicator) => {
      indicator.addEventListener('click', (e) => {
        const slideNum = parseInt(e.target.dataset.slide);
        this.goToSlide(slideNum);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') this.previousSlide();
      if (e.key === 'ArrowRight') this.nextSlide();
    });

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    this.slides[0].parentElement.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    this.slides[0].parentElement.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    });
  }

  previousSlide() {
    this.currentSlide = this.currentSlide === 1 ? this.totalSlides : this.currentSlide - 1;
    this.updateCarousel();
  }

  nextSlide() {
    this.currentSlide = this.currentSlide === this.totalSlides ? 1 : this.currentSlide + 1;
    this.updateCarousel();
  }

  goToSlide(slideNum) {
    if (slideNum >= 1 && slideNum <= this.totalSlides) {
      this.currentSlide = slideNum;
      this.updateCarousel();
    }
  }

  handleSwipe(startX, endX) {
    const swipeThreshold = 50;
    const difference = startX - endX;

    if (Math.abs(difference) > swipeThreshold) {
      if (difference > 0) {
        this.nextSlide();
      } else {
        this.previousSlide();
      }
    }
  }

  updateCarousel() {
    // Update slides visibility
    this.slides.forEach((slide) => {
      slide.classList.remove('active');
    });
    this.slides[this.currentSlide - 1].classList.add('active');

    // Update indicators
    this.indicators.forEach((indicator) => {
      indicator.classList.remove('active');
    });
    this.indicators[this.currentSlide - 1].classList.add('active');

    // Announce current slide for accessibility
    this.announceSlide();
  }

  announceSlide() {
    const slideData = {
      1: 'Slide 1: Capa - 20 anos de direito tributário',
      2: 'Slide 2: Bio - Dra. Tânia Pera',
      3: 'Slide 3: Trajetória profissional',
      4: 'Slide 4: Áreas de atuação',
      5: 'Slide 5: Chamada para ação'
    };

    // Create and announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.textContent = `${slideData[this.currentSlide]}, ${this.currentSlide} de ${this.totalSlides}`;
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';

    document.body.appendChild(announcement);

    setTimeout(() => {
      announcement.remove();
    }, 1000);
  }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new InstagramCarousel();
});
