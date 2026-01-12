import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

// framer-motion mock - createElement 사용 (JSX 대신)
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, transition, whileHover, whileTap, exit, ...props }: Record<string, unknown>) => {
      return React.createElement('div', props, children as React.ReactNode);
    },
    header: ({ children, initial, animate, transition, exit, ...props }: Record<string, unknown>) => {
      return React.createElement('header', props, children as React.ReactNode);
    },
    span: ({ children, initial, animate, transition, exit, ...props }: Record<string, unknown>) => {
      return React.createElement('span', props, children as React.ReactNode);
    },
    button: ({ children, initial, animate, transition, whileHover, whileTap, exit, ...props }: Record<string, unknown>) => {
      return React.createElement('button', props, children as React.ReactNode);
    },
    a: ({ children, initial, animate, transition, whileHover, whileTap, exit, ...props }: Record<string, unknown>) => {
      return React.createElement('a', props, children as React.ReactNode);
    },
    h2: ({ children, initial, animate, transition, exit, ...props }: Record<string, unknown>) => {
      return React.createElement('h2', props, children as React.ReactNode);
    },
    h3: ({ children, initial, animate, transition, exit, ...props }: Record<string, unknown>) => {
      return React.createElement('h3', props, children as React.ReactNode);
    },
    p: ({ children, initial, animate, transition, exit, ...props }: Record<string, unknown>) => {
      return React.createElement('p', props, children as React.ReactNode);
    },
    path: ({ initial, animate, transition, ...props }: Record<string, unknown>) => {
      return React.createElement('path', props);
    },
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => React.createElement(React.Fragment, null, children),
  useInView: () => true,
  useScroll: () => ({ scrollYProgress: { current: 0 } }),
  useSpring: (value: unknown) => value,
  useTransform: () => 0,
  useMotionValueEvent: () => {},
}));