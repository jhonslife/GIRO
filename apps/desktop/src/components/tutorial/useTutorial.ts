/**
 * useTutorial - Hook para usar tutoriais em componentes
 * Fornece acesso ao estado e ações do sistema de tutoriais
 */

import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTutorialStore } from './tutorial-store';
import { tutorials } from './tutorials';
import type { Tutorial, TutorialId, TutorialStep } from './types';

export interface UseTutorialReturn {
  // Estado
  isActive: boolean;
  currentTutorial: Tutorial | null;
  currentStep: TutorialStep | null;
  stepIndex: number;
  totalSteps: number;
  progress: number;
  isEnabled: boolean;

  // Ações
  startTutorial: (id: TutorialId) => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTutorial: () => void;
  pauseTutorial: () => void;
  resumeTutorial: () => void;
  resetTutorial: (id: TutorialId) => void;

  // Queries
  isTutorialCompleted: (id: TutorialId) => boolean;
  canStartTutorial: (id: TutorialId) => boolean;
  getTotalProgress: () => { completed: number; total: number; percentage: number };

  // Configurações
  enableTutorials: () => void;
  disableTutorials: () => void;
  toggleHighContrast: () => void;
  toggleSound: () => void;
}

export const useTutorial = (): UseTutorialReturn => {
  const store = useTutorialStore();

  const currentTutorial = store.activeTutorial ? tutorials[store.activeTutorial] : null;
  const currentStep = currentTutorial?.steps[store.currentStep] ?? null;

  const progress = currentTutorial
    ? Math.round(((store.currentStep + 1) / currentTutorial.steps.length) * 100)
    : 0;

  const isTutorialCompleted = useCallback(
    (id: TutorialId) => {
      const tutorialProgress = store.getTutorialProgress(id);
      return tutorialProgress?.status === 'completed';
    },
    [store]
  );

  const toggleHighContrast = useCallback(() => {
    store.updateSettings({ highContrast: !store.settings.highContrast });
  }, [store]);

  const toggleSound = useCallback(() => {
    store.updateSettings({ soundEnabled: !store.settings.soundEnabled });
  }, [store]);

  return {
    // Estado
    isActive: !!store.activeTutorial && !store.isPaused,
    currentTutorial,
    currentStep,
    stepIndex: store.currentStep,
    totalSteps: currentTutorial?.steps.length ?? 0,
    progress,
    isEnabled: store.settings.enabled,

    // Ações
    startTutorial: store.startTutorial,
    nextStep: store.nextStep,
    previousStep: store.previousStep,
    skipTutorial: store.skipTutorial,
    pauseTutorial: store.pauseTutorial,
    resumeTutorial: store.resumeTutorial,
    resetTutorial: store.resetTutorial,

    // Queries
    isTutorialCompleted,
    canStartTutorial: store.canStartTutorial,
    getTotalProgress: store.getTotalProgress,

    // Configurações
    enableTutorials: store.enableTutorials,
    disableTutorials: store.disableTutorials,
    toggleHighContrast,
    toggleSound,
  };
};

/**
 * Hook para marcar elemento como alvo de tutorial
 * Adiciona o atributo data-tutorial automaticamente
 */
export const useTutorialTarget = (targetId: string) => {
  return {
    'data-tutorial': targetId,
  };
};

/**
 * Hook para iniciar tutorial automaticamente em uma página
 */
export const useAutoStartTutorial = (
  tutorialId: TutorialId,
  options?: {
    delay?: number;
    onlyOnFirstVisit?: boolean;
  }
) => {
  const location = useLocation();
  const store = useTutorialStore();

  useEffect(() => {
    if (!store.settings.enabled) return;

    const tutorial = tutorials[tutorialId];
    if (!tutorial) return;

    // Verificar se já foi completado
    if (options?.onlyOnFirstVisit) {
      const progress = store.getTutorialProgress(tutorialId);
      if (progress && progress.status !== 'not-started') return;
    }

    // Verificar se pode iniciar (pré-requisitos)
    if (!store.canStartTutorial(tutorialId)) return;

    // Verificar se já tem tutorial ativo
    if (store.activeTutorial) return;

    // Iniciar com delay
    const timeout = setTimeout(() => {
      store.startTutorial(tutorialId);
    }, options?.delay ?? 500);

    return () => clearTimeout(timeout);
  }, [location.pathname, tutorialId, options, store]);
};

/**
 * Hook para verificar se um tutorial específico está ativo
 */
export const useTutorialActive = (tutorialId: TutorialId) => {
  const store = useTutorialStore();
  return store.activeTutorial === tutorialId && !store.isPaused;
};

/**
 * Hook para verificar se o passo atual é de um elemento específico
 */
export const useTutorialStepActive = (targetId: string) => {
  const store = useTutorialStore();

  if (!store.activeTutorial || store.isPaused) return false;

  const tutorial = tutorials[store.activeTutorial];
  const currentStep = tutorial?.steps[store.currentStep];

  return currentStep?.target === `[data-tutorial="${targetId}"]`;
};

export default useTutorial;
