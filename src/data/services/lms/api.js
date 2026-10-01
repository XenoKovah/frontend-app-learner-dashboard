import eventNames from 'tracking/constants';
import {
  client,
  get,
  post,
  stringifyUrl,
} from './utils';
import {
  apiKeys,
  unenrollmentAction,
  enableEmailsAction,
} from './constants';
import urls from './urls';
import * as module from './api';

/*********************************************************************************
 * GET Actions
 *********************************************************************************/
export const initializeList = ({ user } = {}) => get(
  stringifyUrl(urls.getInitApiUrl(), { [apiKeys.user]: user }),
);

export const updateEntitlementEnrollment = ({ uuid, courseId }) => post(
  urls.entitlementEnrollment(uuid),
  { [apiKeys.courseRunId]: courseId },
);

export const deleteEntitlementEnrollment = ({ uuid, isRefundable }) => client()
  .delete(
    stringifyUrl(
      urls.entitlementEnrollment(uuid),
      { [apiKeys.isRefund]: isRefundable },
    ),
  );

export const updateEmailSettings = ({ courseId, enable }) => post(
  urls.updateEmailSettings(),
  { [apiKeys.courseId]: courseId, ...(enable && enableEmailsAction) },
);

export const unenrollFromCourse = ({ courseId }) => post(
  urls.courseUnenroll(),
  { [apiKeys.courseId]: courseId, ...unenrollmentAction },
);

export const logEvent = ({ eventName, data, courseId }) => post(urls.event(), {
  courserun_key: courseId,
  event_type: eventName,
  page: window.location.href,
  event: JSON.stringify(data),
});

export const logShare = ({ courseId, site }) => module.logEvent({
  eventName: eventNames.shareClicked,
  courseId,
  data: {
    course_id: courseId,
    social_media_site: site,
    location: 'dashboard',
  },
});

/**
 * Records the learner's unenroll survey answers in the LMS tracking log (via /event) so they can
 * be reported on; the Segment tracker alone goes nowhere when no SEGMENT_KEY is configured.
 * @param {string} courseId - course run identifier
 * @param {{key: string, label: string}[]} reasons - checked predefined options
 * @param {string} other - free text from the "Other" option ('' if not used)
 * @param {bool} isEntitlement - is the course an entitlement course?
 */
export const logUnenrollReasons = ({
  courseId,
  reasons,
  other,
  isEntitlement,
}) => module.logEvent({
  eventName: isEntitlement ? eventNames.entitlementUnenrollReason : eventNames.unenrollReason,
  courseId,
  data: {
    course_id: courseId,
    reasons,
    other,
    is_entitlement: isEntitlement,
  },
});

export const createCreditRequest = ({ providerId, courseId, username }) => post(
  urls.creditRequestUrl(providerId),
  { course_key: courseId, username },
);

export default {
  initializeList,
  unenrollFromCourse,
  updateEmailSettings,
  updateEntitlementEnrollment,
  deleteEntitlementEnrollment,
  logEvent,
  logShare,
  logUnenrollReasons,
  createCreditRequest,
};
