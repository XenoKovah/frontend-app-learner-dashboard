import React from 'react';
import PropTypes from 'prop-types';

import { Card, Icon, IconButton } from '@openedx/paragon';
import { ArrowDropDown, ArrowRight } from '@openedx/paragon/icons';
import { useIntl } from '@edx/frontend-platform/i18n';

import { reduxHooks } from 'hooks';
import { useMinimizeContext } from 'containers/CoursesPanel/MinimizeContext';
import { useIsCollapsed } from './hooks';
import CourseCardBanners from './components/CourseCardBanners';
import CourseCardImage from './components/CourseCardImage';
import CourseCardMenu from './components/CourseCardMenu';
import CourseCardActions from './components/CourseCardActions';
import CourseCardDetails from './components/CourseCardDetails';
import CourseCardTitle from './components/CourseCardTitle';
import MinimizedCourseCard from './MinimizedCourseCard';
import messages from './messages';

import './CourseCard.scss';

export const FullCourseCard = ({ cardId, orientation, isCollapsed }) => (
  <Card orientation={orientation}>
    <div className="d-flex flex-column w-100">
      <div {...(!isCollapsed && { className: 'd-flex' })}>
        <CourseCardImage cardId={cardId} orientation="horizontal" />
        <Card.Body>
          <Card.Header
            title={<CourseCardTitle cardId={cardId} />}
            actions={<CourseCardMenu cardId={cardId} />}
          />
          <Card.Section className="pt-0">
            <CourseCardDetails cardId={cardId} />
          </Card.Section>
          <Card.Footer orientation={orientation}>
            <CourseCardActions cardId={cardId} />
          </Card.Footer>
        </Card.Body>
      </div>
      <CourseCardBanners cardId={cardId} />
    </div>
  </Card>
);
FullCourseCard.propTypes = {
  cardId: PropTypes.string.isRequired,
  orientation: PropTypes.string.isRequired,
  isCollapsed: PropTypes.bool.isRequired,
};

export const CourseCard = ({
  cardId,
}) => {
  const { formatMessage } = useIntl();
  const isCollapsed = useIsCollapsed();
  const orientation = isCollapsed ? 'vertical' : 'horizontal';

  const { isDownloadable } = reduxHooks.useCardCertificateData(cardId);
  const { isCardMinimized, toggleCardMinimized } = useMinimizeContext();

  // A course is "completed" (and therefore minimizable) when its certificate is
  // ready to view/download -- the same state that renders the green
  // "Congratulations. Your certificate is ready." banner.
  const isCompleted = Boolean(isDownloadable);
  const minimized = isCompleted && isCardMinimized(cardId);

  if (!isCompleted) {
    return (
      <div className="mb-4.5 course-card" id={cardId} data-testid="CourseCard">
        <FullCourseCard cardId={cardId} orientation={orientation} isCollapsed={isCollapsed} />
      </div>
    );
  }

  return (
    <div
      className={`mb-4.5 course-card course-card-completed${minimized ? ' is-minimized' : ''}`}
      id={cardId}
      data-testid="CourseCard"
    >
      <div className={`d-flex ${minimized ? 'align-items-center' : 'align-items-start'}`}>
        <IconButton
          src={minimized ? ArrowRight : ArrowDropDown}
          iconAs={Icon}
          alt={formatMessage(minimized ? messages.expandCard : messages.collapseCard)}
          onClick={() => toggleCardMinimized(cardId)}
          className="course-card-minimize-toggle flex-shrink-0"
          data-testid="minimizeToggle"
        />
        <div className="flex-grow-1 course-card-completed-body">
          {minimized
            ? <MinimizedCourseCard cardId={cardId} />
            : <FullCourseCard cardId={cardId} orientation={orientation} isCollapsed={isCollapsed} />}
        </div>
      </div>
    </div>
  );
};
CourseCard.propTypes = {
  cardId: PropTypes.string.isRequired,
};

export default CourseCard;
