import React from 'react';

import { Form } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { useMinimizeContext } from './MinimizeContext';
import messages from './messages';

/**
 * Page-level "Minimize completed courses" checkbox (OST2 customization).
 * Checked by default; drives the minimized state of every completed course card
 * that the learner has not individually expanded/collapsed.
 */
export const MinimizeCompletedControl = () => {
  const { formatMessage } = useIntl();
  const { minimizeCompleted, setMinimizeCompleted } = useMinimizeContext();
  return (
    <div className="minimize-completed-control mb-3">
      <Form.Checkbox
        checked={minimizeCompleted}
        onChange={(e) => setMinimizeCompleted(e.target.checked)}
        data-testid="minimizeCompletedCheckbox"
      >
        {formatMessage(messages.minimizeCompletedCourses)}
      </Form.Checkbox>
    </div>
  );
};

export default MinimizeCompletedControl;
