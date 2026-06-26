import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  bannerAlt: {
    id: 'learner-dash.courseCard.bannerAlt',
    description: 'Course card banner alt-text',
    defaultMessage: 'Course thumbnail',
  },
  verifiedBanner: {
    id: 'learner-dash.courseCard.verifiedBanner',
    description: 'Course card verified banner',
    defaultMessage: 'Verified',
  },
  verifiedHoverDescription: {
    id: 'learner-dash.courseCard.verifiedHoverDescription',
    description: 'Course card verified hover description',
    defaultMessage: 'You\'re enrolled as a verified student',
  },
  verifiedBannerRibbonAlt: {
    id: 'learner-dash.courseCard.verifiedBannerRibbonAlt',
    description: 'Course card verified banner ribbon alt-text',
    defaultMessage: 'ID Verified Ribbon/Badge',
  },
  expandCard: {
    id: 'learner-dash.courseCard.expandCard',
    description: 'Accessible label for the triangle that expands a minimized completed course card',
    defaultMessage: 'Expand course',
  },
  collapseCard: {
    id: 'learner-dash.courseCard.collapseCard',
    description: 'Accessible label for the triangle that collapses a completed course card into a single row',
    defaultMessage: 'Minimize course',
  },
  certReadyForCourse: {
    id: 'learner-dash.courseCard.certReadyForCourse',
    description: 'Certificate-ready message shown on a minimized completed course row, naming the course',
    defaultMessage: 'Congratulations.  Your certificate for {courseName} is ready.',
  },
});

export default messages;
