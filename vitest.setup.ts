import '@testing-library/jest-dom';
import React from 'react';
import { vi } from 'vitest';

type MotionMockProps = Record<string, unknown> & {
  children?: React.ReactNode;
};

type HTMLElementTag = keyof React.JSX.IntrinsicElements;

const createMotionMockWithChildren = (tag: HTMLElementTag) => {
  return ({
    children,
    initial,
    animate,
    transition,
    whileHover,
    whileTap,
    exit,
    ...props
  }: MotionMockProps) => {
    return React.createElement(tag as string, props, children as React.ReactNode);
  };
};

const createMotionMockWithoutChildren = (tag: HTMLElementTag) => {
  return ({
    initial,
    animate,
    transition,
    whileHover,
    whileTap,
    exit,
    ...props
  }: MotionMockProps) => {
    return React.createElement(tag as string, props);
  };
};

// framer-motion mock - createElement 사용 (JSX 대신)
vi.mock('framer-motion', () => ({
  motion: {
    div: createMotionMockWithChildren('div'),
    header: createMotionMockWithChildren('header'),
    span: createMotionMockWithChildren('span'),
    button: createMotionMockWithChildren('button'),
    a: createMotionMockWithChildren('a'),
    h2: createMotionMockWithChildren('h2'),
    h3: createMotionMockWithChildren('h3'),
    p: createMotionMockWithChildren('p'),
    path: createMotionMockWithoutChildren('path'),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) =>
    React.createElement(React.Fragment, null, children),
  useInView: () => true,
  useScroll: () => ({ scrollYProgress: { current: 0 } }),
  useSpring: (value: unknown) => value,
  useTransform: () => 0,
  useMotionValueEvent: () => {},
}));