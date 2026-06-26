import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  myCourses: {
    id: 'dashboard.mycourses',
    defaultMessage: 'My Courses',
    description: 'Course list heading',
  },
  minimizeCompletedCourses: {
    id: 'dashboard.minimizeCompletedCourses',
    defaultMessage: 'Minimize completed courses',
    description: 'Label for the checkbox that collapses completed (certificate-ready) course cards into a single row',
  },
});

export default messages;
