import { Injectable } from '@angular/core';
import { APP_CONFIG } from './constants';

@Injectable({
  providedIn: 'root'
})
export class ScrollRevealService {
  private intersectionObserver?: IntersectionObserver;

  initialize(): void {
    const elements = document.querySelectorAll<HTMLElement>('.reveal');
    if (!elements.length) return;

    const observerOptions: IntersectionObserverInit = {
      threshold: APP_CONFIG.INTERSECTION_THRESHOLD,
      rootMargin: APP_CONFIG.INTERSECTION_ROOT_MARGIN,
    };

    this.intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target as HTMLElement;
        const section = el.closest('.section');
        const elementsInSection = section
          ? Array.from(section.querySelectorAll<HTMLElement>('.reveal'))
          : [];
        const indexInSection = elementsInSection.indexOf(el);

        window.setTimeout(
          () => el.classList.add('revealed'),
          Math.max(0, indexInSection) * APP_CONFIG.ANIMATION_DELAY
        );
        this.intersectionObserver?.unobserve(el);
      });
    }, observerOptions);

    elements.forEach(el => this.intersectionObserver?.observe(el));
  }

  cleanup(): void {
    this.intersectionObserver?.disconnect();
    this.intersectionObserver = undefined;
  }
}
