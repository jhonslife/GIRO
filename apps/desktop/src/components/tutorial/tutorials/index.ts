/**
 * Índice de todos os tutoriais disponíveis
 */

import type { Tutorial, TutorialId } from '../types';
import { alertsTutorial } from './alerts';
import { cashTutorial } from './cash';
import { employeesTutorial } from './employees';
import { pdvAdvancedTutorial } from './pdv-advanced';
import { pdvBasicTutorial } from './pdv-basic';
import { productsTutorial } from './products';
import { reportsTutorial } from './reports';
import { settingsTutorial } from './settings';
import { stockTutorial } from './stock';
import { welcomeTutorial } from './welcome';

export const tutorials: Record<TutorialId, Tutorial> = {
  welcome: welcomeTutorial,
  'pdv-basic': pdvBasicTutorial,
  'pdv-advanced': pdvAdvancedTutorial,
  products: productsTutorial,
  stock: stockTutorial,
  cash: cashTutorial,
  reports: reportsTutorial,
  settings: settingsTutorial,
  employees: employeesTutorial,
  alerts: alertsTutorial,
};

export const getTutorialById = (id: TutorialId): Tutorial | undefined => {
  return tutorials[id];
};

export const getTutorialsByCategory = (category: Tutorial['category']): Tutorial[] => {
  return Object.values(tutorials).filter((t) => t.category === category);
};

export const searchTutorials = (query: string): Tutorial[] => {
  const lowerQuery = query.toLowerCase();
  return Object.values(tutorials).filter(
    (t) =>
      t.name.toLowerCase().includes(lowerQuery) ||
      t.description.toLowerCase().includes(lowerQuery) ||
      t.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};

// Re-export tutorials individuais
export {
  alertsTutorial,
  cashTutorial,
  employeesTutorial,
  pdvAdvancedTutorial,
  pdvBasicTutorial,
  productsTutorial,
  reportsTutorial,
  settingsTutorial,
  stockTutorial,
  welcomeTutorial,
};
