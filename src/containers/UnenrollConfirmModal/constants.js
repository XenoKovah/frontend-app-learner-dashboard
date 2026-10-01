/* eslint-disable quotes */
import { StrictDict } from 'utils';
import { defineMessages } from '@edx/frontend-platform/i18n';

export const reasonKeys = StrictDict({
  zeroCompletion: 'zeroCompletion',
  difficulty: 'difficulty',
  goals: 'goals',
  broken: 'broken',
  time: 'time',
  browse: 'browse',
  support: 'support',
  quality: 'quality',
  easy: 'easy',
  custom: 'custom',
});

export const order = [
  reasonKeys.zeroCompletion,
  reasonKeys.time,
  reasonKeys.browse,
  reasonKeys.broken,
  reasonKeys.easy,
  reasonKeys.difficulty,
  reasonKeys.quality,
  reasonKeys.goals,
  reasonKeys.support,
];

const messages = defineMessages({
  [reasonKeys.zeroCompletion]: {
    id: 'learner-dash.unenrollConfirm.reasons.zeroCompletion',
    description: 'Unenroll reason option - freeing a slot by leaving a class with no progress',
    defaultMessage: 'I needed to unenroll from a 0%-completion class to register for new classes',
  },
  [reasonKeys.difficulty]: {
    id: 'learner-dash.unenrollConfirm.reasons.difficulty',
    description: 'Unenroll reason option - material is too hard',
    defaultMessage: 'The course material was too hard',
  },
  [reasonKeys.goals]: {
    id: 'learner-dash.unenrollConfirm.reasons.goals',
    description: 'Unenroll reason option - goals-related',
    defaultMessage: `This course isn't aligned with my goals`,
  },
  [reasonKeys.broken]: {
    id: 'learner-dash.unenrollConfirm.reasons.broken',
    description: 'Unenroll reason option - something broken',
    defaultMessage: 'Something was broken',
  },
  [reasonKeys.time]: {
    id: 'learner-dash.unenrollConfirm.reasons.time',
    description: 'Unenroll reason option - time-related',
    defaultMessage: `I don't have the time`,
  },
  [reasonKeys.browse]: {
    id: 'learner-dash.unenrollConfirm.reasons.browse',
    description: 'Unenroll reason option - wanted to browse',
    defaultMessage: `I just wanted to browse the material (but I didn't know I don't need to enroll to browse, but I do now!)`,
  },
  [reasonKeys.support]: {
    id: 'learner-dash.unenrollConfirm.reasons.support',
    description: 'Unenroll reason option - lacking support',
    defaultMessage: `I don't have enough support`,
  },
  [reasonKeys.easy]: {
    id: 'learner-dash.unenrollConfirm.reasons.easy',
    description: 'Unenroll reason option - too easy',
    defaultMessage: 'The course material was too easy',
  },
  [reasonKeys.quality]: {
    id: 'learner-dash.unenrollConfirm.reasons.quality',
    description: 'Unenroll reason option - quality-related',
    defaultMessage: `I'm not happy with the quality of the content`,
  },
  customPlaceholder: {
    id: 'learner-dash.unenrollConfirm.reasons.custom-placeholder',
    description: 'Unenroll custom reason option placeholder text',
    defaultMessage: 'Other',
  },
});

export default {
  messages,
  order,
  reasonKeys,
};
