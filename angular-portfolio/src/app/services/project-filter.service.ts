import { Injectable } from '@angular/core';
import { APP_CONFIG } from './constants';

@Injectable({
  providedIn: 'root'
})
export class ProjectFilterService {
  private cleanupFns: Array<() => void> = [];

  initialize(): void {
    const filterButtons = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
    const projectCards = document.querySelectorAll<HTMLElement>('.project-card');

    filterButtons.forEach(btn => {
      const handler = () => this.handleFilterClick(btn, filterButtons, projectCards);
      btn.addEventListener('click', handler);
      this.cleanupFns.push(() => btn.removeEventListener('click', handler));
    });
  }

  private handleFilterClick(
    clickedBtn: HTMLButtonElement,
    allButtons: NodeListOf<HTMLButtonElement>,
    cards: NodeListOf<HTMLElement>
  ): void {
    allButtons.forEach(b => b.classList.remove('active'));
    clickedBtn.classList.add('active');

    const filter = clickedBtn.getAttribute('data-filter');

    cards.forEach((card, index) => {
      const category = card.getAttribute('data-category');

      if (filter === 'all' || category === filter) {
        window.setTimeout(() => {
          card.style.display = 'block';
          window.setTimeout(() => card.classList.add('revealed'), 10);
        }, index * APP_CONFIG.ANIMATION_DELAY);
      } else {
        card.classList.remove('revealed');
        window.setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  }

  cleanup(): void {
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];
  }
}
