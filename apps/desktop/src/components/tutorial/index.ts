/**
 * Sistema de Tutoriais - Índice Principal
 * Exporta todos os componentes, hooks e utilitários
 */

// Componentes principais
export { Spotlight } from './Spotlight';
export { TutorialHub } from './TutorialHub';
export { TutorialProvider } from './TutorialProvider';
export { TutorialTooltip } from './TutorialTooltip';

// Store
export { useTutorialStore } from './tutorial-store';

// Hooks
export {
  useAutoStartTutorial,
  useTutorial,
  useTutorialActive,
  useTutorialStepActive,
  useTutorialTarget,
} from './useTutorial';

// Tutoriais
export { getTutorialById, getTutorialsByCategory, searchTutorials, tutorials } from './tutorials';

// Tipos
export type {
  SpotlightConfig,
  Tutorial,
  TutorialId,
  TutorialProgress,
  TutorialSettings,
  TutorialState,
  TutorialStatus,
  TutorialStep,
} from './types';

export { defaultSpotlightConfig, defaultTutorialSettings } from './types';
