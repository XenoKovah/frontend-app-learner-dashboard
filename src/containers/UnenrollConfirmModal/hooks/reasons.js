import React from 'react';

import {
  apiHooks,
  reduxHooks,
} from 'hooks';
import { StrictDict } from 'utils';
import track from 'tracking';

import constants, { reasonKeys } from '../constants';

import * as module from './reasons';

export const state = StrictDict({
  brokenOption: (val) => React.useState(val), // eslint-disable-line
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
  // "Something was broken" option: a free-text box whose placeholder is the option's label
  const [brokenOption, setBrokenOption] = module.state.brokenOption('');
  // Custom option element entry value
  const [customOption, setCustomOption] = module.state.customOption('');

  // Did the user choose to skip selecting a reason?
  const [isSkipped, setIsSkipped] = module.state.isSkipped(false);
  // Did the user submit an unenrollment reason
  const [isSubmitted, setIsSubmitted] = module.state.isSubmitted(false);

  const { isEntitlement } = reduxHooks.useCardEntitlementData(cardId);

  const brokenDetails = brokenOption.trim();
  const submittedReasons = selectedReasons
    .map((key) => {
      if (key === reasonKeys.custom) { return customOption.trim(); }
      if (key === reasonKeys.broken && brokenDetails) { return `${key}: ${brokenDetails}`; }
      return key;
    })
    .filter((reason) => reason !== '');
  const hasReason = submittedReasons.length > 0;

  const logReasons = apiHooks.useLogUnenrollReasons(cardId);

  const handleTrackReasons = reduxHooks.useTrackCourseEvent(
    track.engagement.unenrollReason,
    cardId,
    submittedReasons,
    isEntitlement,
  );

  const unenrollFromCourse = apiHooks.useUnenrollFromCourse(cardId);

  const handleClear = () => {
    setSelectedReasons([]);
    setBrokenOption('');
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
    logReasons({
      reasons: selectedReasons
        .filter((key) => key !== reasonKeys.custom)
        .map((key) => ({
          key,
          label: constants.messages[key].defaultMessage,
          ...(key === reasonKeys.broken && brokenDetails ? { details: brokenDetails } : {}),
        })),
      other: selectedReasons.includes(reasonKeys.custom) ? customOption.trim() : '',
    });
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
  // Typing in a free-text option's box checks its checkbox
  const checkWhenTyping = (key, setText) => (e) => {
    const { value } = e.target;
    setText(value);
    if (value !== '') {
      setSelectedReasons((current) => (current.includes(key) ? current : [...current, key]));
    }
  };
  const handleBrokenOptionChange = checkWhenTyping(reasonKeys.broken, setBrokenOption);
  const handleCustomOptionChange = checkWhenTyping(reasonKeys.custom, setCustomOption);

  return {
    brokenOption: { value: brokenOption, onChange: handleBrokenOptionChange },
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
