import { Injectable } from '@angular/core';
import { APP_CONFIG } from './constants';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  initializeCardAnimation(): void {
    window.setTimeout(() => {
      const projectCards = document.querySelectorAll<HTMLElement>('.project-card');
      projectCards.forEach((card, index) => {
        window.setTimeout(() => card.classList.add('revealed'), index * APP_CONFIG.ANIMATION_DELAY);
      });
    }, APP_CONFIG.INITIAL_ANIMATION_DELAY);
  }
}
