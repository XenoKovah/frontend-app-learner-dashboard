import React from 'react';

import {
  apiHooks,
  reduxHooks,
} from 'hooks';
import { StrictDict } from 'utils';
import track from 'tracking';

import { reasonKeys } from '../constants';

import * as module from './reasons';

export const state = StrictDict({
  customOption: (val) => React.useState(val), // eslint-disable-line
  isSkipped: (val) => React.useState(val), // eslint-disable-line
  selectedReasons: (val) => React.useState(val), // eslint-disable-line
  isSubmitted: (val) => React.useState(val), //eslint-disable-line
});

export const useUnenrollReasons = ({
  cardId,
}) => {
  // The option keys checked in the menu
  const [selectedReasons, setSelectedReasons] = module.state.selectedReasons([]);
  // Custom option element entry value
  const [customOption, setCustomOption] = module.state.customOption('');

  // Did the user choose to skip selecting a reason?
  const [isSkipped, setIsSkipped] = module.state.isSkipped(false);
  // Did the user submit an unenrollment reason
  const [isSubmitted, setIsSubmitted] = module.state.isSubmitted(false);

  const { isEntitlement } = reduxHooks.useCardEntitlementData(cardId);

  const submittedReasons = selectedReasons
    .map((key) => (key === reasonKeys.custom ? customOption.trim() : key))
    .filter((reason) => reason !== '');
  const hasReason = submittedReasons.length > 0;

  const handleTrackReasons = reduxHooks.useTrackCourseEvent(
    track.engagement.unenrollReason,
    cardId,
    submittedReasons,
    isEntitlement,
  );

  const unenrollFromCourse = apiHooks.useUnenrollFromCourse(cardId);

  const handleClear = () => {
    setSelectedReasons([]);
    setCustomOption('');
    setIsSkipped(false);
    setIsSubmitted(false);
  };

  const handleSkip = () => {
    setIsSkipped(true);
    unenrollFromCourse();
  };

  const handleSubmit = (e) => {
    handleTrackReasons(e);
    setIsSubmitted(true);
    unenrollFromCourse();
  };

  const handleSelectOption = (e) => {
    const { value, checked } = e.target;
    setSelectedReasons((current) => (
      checked
        ? [...current.filter((key) => key !== value), value]
        : current.filter((key) => key !== value)
    ));
  };
  // Typing in the "Other" box checks its checkbox
  const handleCustomOptionChange = (e) => {
    const { value } = e.target;
    setCustomOption(value);
    if (value !== '') {
      setSelectedReasons((current) => (
        current.includes(reasonKeys.custom) ? current : [...current, reasonKeys.custom]
      ));
    }
  };

  return {
    customOption: { value: customOption, onChange: handleCustomOptionChange },
    handleClear,
    handleSkip,
    handleSubmit,
    hasReason,
    isSkipped,
    isSubmitted,
    selectOption: handleSelectOption,
    selected: selectedReasons,
    submittedReasons,
  };
};
