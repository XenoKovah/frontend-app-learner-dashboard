import React from 'react';
import PropTypes from 'prop-types';

import { ActionRow } from '@openedx/paragon';

import { reduxHooks } from 'hooks';

import CourseCardActionSlot from 'plugin-slots/CourseCardActionSlot';
import SelectSessionButton from './SelectSessionButton';
import ViewCourseButton from './ViewCourseButton';

export const CourseCardActions = ({ cardId }) => {
  const { isEntitlement, isFulfilled } = reduxHooks.useCardEntitlementData(cardId);

  // OST2: every course uses a single "View Course" action (linking to the course
  // home) regardless of completion level, instead of Begin/Resume. The only
  // exception is an unfulfilled entitlement, which still needs to pick a session.
  return (
    <ActionRow data-test-id="CourseCardActions">
      <CourseCardActionSlot cardId={cardId} />
      {isEntitlement && !isFulfilled
        ? <SelectSessionButton cardId={cardId} />
        : <ViewCourseButton cardId={cardId} />}
    </ActionRow>
  );
};
CourseCardActions.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CourseCardActions;
