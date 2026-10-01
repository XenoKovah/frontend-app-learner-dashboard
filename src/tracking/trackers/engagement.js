import { createEventTracker } from 'data/services/segment/utils';
import { categories, eventNames } from '../constants';

export const engagementOptions = {
  category: categories.userEngagement,
  displayName: 'v1',
};

/**
 * Creates callback which sends segment event for unenroll with reason event
 * @param {string} courseId - course run identifier
 * @param {string[]} reasons - unenroll reasons (option keys, or the learner's free text for "Other")
 * @param {bool} isEntitlement - is the course an entitlement course?
 * @return {callback} - callback that will send the appropriate segment message.
 */
export const unenrollReason = (courseId, reasons, isEntitlement) => createEventTracker(
  isEntitlement ? eventNames.entitlementUnenrollReason : eventNames.unenrollReason,
  { reasons, course_id: courseId, ...engagementOptions },
);

export default {
  unenrollReason,
};
