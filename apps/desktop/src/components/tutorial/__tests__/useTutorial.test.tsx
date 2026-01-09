/**
 * @file useTutorial.test.tsx - Tests for tutorial hooks
 */

import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the store
const mockStore = {
  activeTutorial: null as string | null,
  currentStep: 0,
  isPaused: false,
  settings: {
    enabled: true,
    highContrast: false,
    soundEnabled: true,
  },
  startTutorial: vi.fn(),
  nextStep: vi.fn(),
  previousStep: vi.fn(),
  skipTutorial: vi.fn(),
  pauseTutorial: vi.fn(),
  resumeTutorial: vi.fn(),
  resetTutorial: vi.fn(),
  enableTutorials: vi.fn(),
  disableTutorials: vi.fn(),
  updateSettings: vi.fn(),
  canStartTutorial: vi.fn(() => true),
  getTutorialProgress: vi.fn(() => null),
  getTotalProgress: vi.fn(() => ({ completed: 0, total: 5, percentage: 0 })),
};

vi.mock('../tutorial-store', () => ({
  useTutorialStore: () => mockStore,
}));

vi.mock('../tutorials', () => ({
  tutorials: {
    welcome: {
      id: 'welcome',
      name: 'Welcome',
      steps: [
        { id: 'step-1', title: 'Step 1', description: 'First' },
        { id: 'step-2', title: 'Step 2', description: 'Second' },
      ],
    },
  },
}));

import { useTutorial, useTutorialActive, useTutorialTarget } from '../useTutorial';

const wrapper = ({ children }: { children: ReactNode }) => <MemoryRouter>{children}</MemoryRouter>;

describe('useTutorial', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.activeTutorial = null;
    mockStore.currentStep = 0;
    mockStore.isPaused = false;
  });

  it('should return isActive false when no tutorial', () => {
    const { result } = renderHook(() => useTutorial(), { wrapper });

    expect(result.current.isActive).toBe(false);
    expect(result.current.currentTutorial).toBeNull();
  });

  it('should return isActive true when tutorial active', () => {
    mockStore.activeTutorial = 'welcome';

    const { result } = renderHook(() => useTutorial(), { wrapper });

    expect(result.current.isActive).toBe(true);
  });

  it('should return isActive false when paused', () => {
    mockStore.activeTutorial = 'welcome';
    mockStore.isPaused = true;

    const { result } = renderHook(() => useTutorial(), { wrapper });

    expect(result.current.isActive).toBe(false);
  });

  it('should expose startTutorial action', () => {
    const { result } = renderHook(() => useTutorial(), { wrapper });

    expect(result.current.startTutorial).toBeDefined();
    expect(typeof result.current.startTutorial).toBe('function');
  });

  it('should expose navigation actions', () => {
    const { result } = renderHook(() => useTutorial(), { wrapper });

    expect(result.current.nextStep).toBeDefined();
    expect(result.current.previousStep).toBeDefined();
    expect(result.current.skipTutorial).toBeDefined();
  });
});

describe('useTutorialTarget', () => {
  it('should return data-tutorial attribute', () => {
    const { result } = renderHook(() => useTutorialTarget('my-element'));

    expect(result.current).toEqual({ 'data-tutorial': 'my-element' });
  });
});

describe('useTutorialActive', () => {
  beforeEach(() => {
    mockStore.activeTutorial = null;
    mockStore.isPaused = false;
  });

  it('should return true when specific tutorial is active', () => {
    mockStore.activeTutorial = 'welcome';

    const { result } = renderHook(() => useTutorialActive('welcome'));

    expect(result.current).toBe(true);
  });

  it('should return false when different tutorial is active', () => {
    mockStore.activeTutorial = 'pdv-basic';

    const { result } = renderHook(() => useTutorialActive('welcome'));

    expect(result.current).toBe(false);
  });

  it('should return false when no active tutorial', () => {
    const { result } = renderHook(() => useTutorialActive('welcome'));

    expect(result.current).toBe(false);
  });
});
