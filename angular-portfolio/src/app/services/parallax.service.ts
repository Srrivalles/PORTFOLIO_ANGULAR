import { Injectable } from '@angular/core';
import { APP_CONFIG } from './constants';

@Injectable({
  providedIn: 'root'
})
export class ParallaxService {
  private cleanupFn?: () => void;

  initialize(): void {
    const hero = document.querySelector<HTMLElement>('.hero');
    if (!hero) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      window.requestAnimationFrame(() => {
        this.updateParallax(hero);
        ticking = false;
      });
      ticking = true;
    };

    window.addEventListener('scroll', onScroll);
    this.cleanupFn = () => window.removeEventListener('scroll', onScroll);
    onScroll();
  }

  private updateParallax(hero: HTMLElement): void {
    const scrolled = window.pageYOffset;
    hero.style.backgroundPosition = `center ${scrolled * APP_CONFIG.PARALLAX_FACTOR}px`;

    const particles = document.querySelectorAll<HTMLElement>('.particle');
    particles.forEach((particle, index) => {
      const speed = 0.1 + index * 0.05;
      const yPos = -(scrolled * speed);
      particle.style.transform = `translateY(${yPos}px)`;
    });
  }

  cleanup(): void {
    this.cleanupFn?.();
  }
}
