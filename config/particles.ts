import { ISourceOptions } from '@tsparticles/engine';

export const particlesConfig: ISourceOptions = {
  fpsLimit: 120,
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
      },
    },
    color: {
      value: '#ffffff',
    },
    shape: {
      type: 'circle',
    },
    opacity: {
      value: 0.7,
    },
    size: {
      value: 3,
    },
    links: {
      enable: true,
      distance: 150,
      color: '#ffffff',
      opacity: 0.4,
      width: 1,
    },
    move: {
      enable: true,
      speed: 2,
      direction: 'none' as const,
      random: false,
      straight: false,
      outModes: {
        default: 'bounce' as const,
      },
    },
  },
  interactivity: {
    events: {
      onHover: {
        enable: true,
        mode: 'grab' as const,
      },
    },
    modes: {
      grab: {
        distance: 150,
        links: {
          opacity: 0.8,
        },
      },
    },
  },
  background: {
    color: 'transparent',
  },
};
