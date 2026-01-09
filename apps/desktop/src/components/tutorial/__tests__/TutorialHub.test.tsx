/**
 * @file TutorialHub.test.tsx - Tests for TutorialHub component
 */

import { TutorialHub } from '@/components/tutorial/TutorialHub';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the store
const mockStartTutorial = vi.fn();
const mockResetTutorial = vi.fn();
const mockGetTutorialProgress = vi.fn();
const mockGetTotalProgress = vi.fn(() => ({ completed: 1, total: 3, percentage: 33 }));
const mockCanStartTutorial = vi.fn(() => true);

vi.mock('@/components/tutorial/tutorial-store', () => ({
  useTutorialStore: () => ({
    startTutorial: mockStartTutorial,
    resetTutorial: mockResetTutorial,
    getTutorialProgress: mockGetTutorialProgress,
    getTotalProgress: mockGetTotalProgress,
    canStartTutorial: mockCanStartTutorial,
  }),
}));

vi.mock('@/components/tutorial/tutorials', () => ({
  tutorials: {
    welcome: {
      id: 'welcome',
      name: 'Welcome Tutorial',
      description: 'Introduction to the system',
      category: 'getting-started',
      steps: [{ id: 's1' }, { id: 's2' }],
      estimatedMinutes: 5,
      icon: 'Sparkles',
      tags: ['intro'],
    },
  },
  getTutorialsByCategory: () => [],
  searchTutorials: () => [],
}));

describe('TutorialHub', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetTutorialProgress.mockReturnValue(null);
    mockCanStartTutorial.mockReturnValue(true);
  });

  it('should render hub title', () => {
    render(<TutorialHub />);

    expect(screen.getByText('Central de Treinamentos')).toBeInTheDocument();
  });

  it('should render progress overview', () => {
    render(<TutorialHub />);

    expect(screen.getByText('Seu Progresso')).toBeInTheDocument();
    expect(screen.getByText('33%')).toBeInTheDocument();
  });

  it('should render search input', () => {
    render(<TutorialHub />);

    expect(screen.getByPlaceholderText(/Buscar tutoriais/i)).toBeInTheDocument();
  });

  it('should render tutorial card', () => {
    render(<TutorialHub />);

    expect(screen.getByText('Welcome Tutorial')).toBeInTheDocument();
  });

  it('should render quick tips section', () => {
    render(<TutorialHub />);

    expect(screen.getByText(/Dicas/i)).toBeInTheDocument();
  });

  it('should call startTutorial when clicking button', () => {
    render(<TutorialHub />);

    const buttons = screen.getAllByRole('button');
    const startButton = buttons.find((btn) => btn.textContent?.includes('Iniciar'));

    if (startButton) {
      fireEvent.click(startButton);
      expect(mockStartTutorial).toHaveBeenCalled();
    }
  });
});
