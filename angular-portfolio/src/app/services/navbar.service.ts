import { Injectable } from '@angular/core';
import { APP_CONFIG } from './constants';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  private cleanupFns: Array<() => void> = [];

  initialize(): void {
    this.setupNavbar();
    this.setupMobileMenu();
  }

  private setupNavbar(): void {
    const navbar = document.querySelector<HTMLElement>('.navbar');
    if (!navbar) return;

    const onScroll = () => {
      if (window.scrollY > APP_CONFIG.SCROLL_NAVBAR_THRESHOLD) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', onScroll);
    this.cleanupFns.push(() => window.removeEventListener('scroll', onScroll));
    onScroll();
  }

  private setupMobileMenu(): void {
    const menuToggle = document.querySelector<HTMLElement>('.menu-toggle');
    const navLinks = document.querySelector<HTMLElement>('.nav-links');
    if (!menuToggle || !navLinks) return;

    const onToggle = () => navLinks.classList.toggle('active');
    menuToggle.addEventListener('click', onToggle);
    this.cleanupFns.push(() => menuToggle.removeEventListener('click', onToggle));

    const links = document.querySelectorAll<HTMLElement>('.nav-link');
    links.forEach(link => {
      const onClick = () => navLinks.classList.remove('active');
      link.addEventListener('click', onClick);
      this.cleanupFns.push(() => link.removeEventListener('click', onClick));
    });

    const onDocClick = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest('.navbar')) navLinks.classList.remove('active');
    };
    document.addEventListener('click', onDocClick);
    this.cleanupFns.push(() => document.removeEventListener('click', onDocClick));
  }

  cleanup(): void {
    this.cleanupFns.forEach(fn => fn());
    this.cleanupFns = [];
  }
}
