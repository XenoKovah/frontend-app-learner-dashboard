import React from 'react';
import PropTypes from 'prop-types';

import { Hyperlink } from '@openedx/paragon';
import { CheckCircle } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';

import { reduxHooks } from 'hooks';
import Banner from 'components/Banner';

import messages from './messages';
import bannerMessages from './components/CourseCardBanners/messages';

/**
 * Compact single-row view shown for a completed (certificate-ready) course when
 * it is minimized. Mirrors the look of the expanded "certificate is ready"
 * banner, but names the course and stands in for the whole card.
 */
export const MinimizedCourseCard = ({ cardId }) => {
  const { formatMessage } = useIntl();
  const { courseName } = reduxHooks.useCardCourseData(cardId);
  const { certPreviewUrl } = reduxHooks.useCardCertificateData(cardId);
  return (
    <Banner variant="success" icon={CheckCircle}>
      {formatMessage(messages.certReadyForCourse, { courseName })}
      {certPreviewUrl && (
        <>
          {'  '}
          <Hyperlink isInline destination={certPreviewUrl}>
            {formatMessage(bannerMessages.viewCertificate)}
          </Hyperlink>
        </>
      )}
    </Banner>
  );
};
MinimizedCourseCard.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default MinimizedCourseCard;
