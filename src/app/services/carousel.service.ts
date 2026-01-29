import { Injectable } from '@angular/core';
import { APP_CONFIG } from './constants';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  private cleanupFns: Array<() => void> = [];
  private carouselIntervals: number[] = [];

  initialize(): void {
    const carousels = document.querySelectorAll<HTMLElement>('.carousel-container');
    carousels.forEach(carousel => this.setupCarousel(carousel));
  }

  private setupCarousel(carousel: HTMLElement): void {
    const images = Array.from(carousel.querySelectorAll<HTMLElement>('.carousel-image'));
    const indicators = Array.from(carousel.querySelectorAll<HTMLElement>('.indicator'));
    if (images.length === 0) return;

    let currentIndex = 0;
    let isHovering = false;

    const changeImage = (newIndex: number) => {
      images.forEach(img => img.classList.remove('active'));
      indicators.forEach(ind => ind.classList.remove('active'));
      images[newIndex]?.classList.add('active');
      indicators[newIndex]?.classList.add('active');
      currentIndex = newIndex;
    };

    const intervalId = window.setInterval(() => {
      if (isHovering) return;
      changeImage((currentIndex + 1) % images.length);
    }, APP_CONFIG.CAROUSEL_INTERVAL);
    this.carouselIntervals.push(intervalId);

    indicators.forEach((indicator, idx) => {
      const onClick = () => changeImage(idx);
      indicator.addEventListener('click', onClick);
      this.cleanupFns.push(() => indicator.removeEventListener('click', onClick));
    });

    const onEnter = () => (isHovering = true);
    const onLeave = () => (isHovering = false);
    carousel.addEventListener('mouseenter', onEnter);
    carousel.addEventListener('mouseleave', onLeave);
    this.cleanupFns.push(() => carousel.removeEventListener('mouseenter', onEnter));
    this.cleanupFns.push(() => carousel.removeEventListener('mouseleave', onLeave));
  }

  cleanup(): void {
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];

    this.carouselIntervals.forEach(id => window.clearInterval(id));
    this.carouselIntervals = [];
  }
}
