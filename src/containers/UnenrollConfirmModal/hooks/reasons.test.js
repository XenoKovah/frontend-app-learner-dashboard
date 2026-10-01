import { MockUseState } from 'testUtils';
import track from 'tracking';
import {
  apiHooks,
  reduxHooks,
} from 'hooks';

import * as hooks from './reasons';

jest.mock('hooks', () => ({
  apiHooks: {
    useUnenrollFromCourse: jest.fn((...args) => ({ unenrollFromCourse: args })),
    useLogUnenrollReasons: jest.fn(),
  },
  reduxHooks: {
    useCardEntitlementData: jest.fn(),
    useTrackCourseEvent: jest.fn(),
  },
}));

const state = new MockUseState(hooks);
const testValue = 'test-value';
const testValue2 = 'test-value2';
const unenrollFromCourse = jest.fn((...args) => ({ unenrollFromCourse: args }));
const trackCourseEvent = jest.fn((e) => ({ courseEvent: e }));
const logReasons = jest.fn();
apiHooks.useUnenrollFromCourse.mockReturnValue(unenrollFromCourse);
apiHooks.useLogUnenrollReasons.mockReturnValue(logReasons);
reduxHooks.useTrackCourseEvent.mockReturnValue(trackCourseEvent);
let out;

const cardId = 'test-card-id';
const loadHook = (isEntitlement = false) => {
  reduxHooks.useCardEntitlementData.mockReturnValue({ isEntitlement });
  out = hooks.useUnenrollReasons({ cardId });
};

describe('UnenrollConfirmModal reasons hooks', () => {
  describe('state fields', () => {
    state.testGetter(state.keys.customOption);
    state.testGetter(state.keys.isSkipped);
    state.testGetter(state.keys.isSubmitted);
    state.testGetter(state.keys.selectedReasons);
  });
  describe('useUnenrollReasons', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      state.mock();
      loadHook();
    });
    afterEach(() => {
      state.restore();
    });
    describe('behavior', () => {
      describe('state fields', () => {
        it('initializes selectedReasons with an empty array', () => {
          state.expectInitializedWith(state.keys.selectedReasons, []);
        });
        it('initializes customOption with empty string', () => {
          state.expectInitializedWith(state.keys.customOption, '');
        });
        it('initializes isSkipped with false', () => {
          state.expectInitializedWith(state.keys.isSkipped, false);
        });
        it('initializes isSubmitted with false', () => {
          state.expectInitializedWith(state.keys.isSubmitted, false);
        });
      });
      describe('useTrackCourseEvent inititalization', () => {
        it('passes the trimmed custom text in place of the custom key', () => {
          state.mockVal(state.keys.selectedReasons, ['time', 'custom']);
          state.mockVal(state.keys.customOption, ` ${testValue} `);
          loadHook();
          expect(reduxHooks.useTrackCourseEvent).toHaveBeenCalledWith(
            track.engagement.unenrollReason,
            cardId,
            ['time', testValue],
            false, // isEntitlement
          );
        });
        it('passes every selected reason, in order, if none are custom', () => {
          state.mockVal(state.keys.selectedReasons, ['zeroCompletion', testValue2]);
          state.mockVal(state.keys.customOption, testValue);
          loadHook(true);
          expect(reduxHooks.useTrackCourseEvent).toHaveBeenCalledWith(
            track.engagement.unenrollReason,
            cardId,
            ['zeroCompletion', testValue2],
            true, // isEntitlement
          );
        });
        it('drops the custom reason when its text is blank', () => {
          state.mockVal(state.keys.selectedReasons, ['time', 'custom']);
          state.mockVal(state.keys.customOption, '   ');
          loadHook();
          expect(reduxHooks.useTrackCourseEvent).toHaveBeenCalledWith(
            track.engagement.unenrollReason,
            cardId,
            ['time'],
            false, // isEntitlement
          );
        });
      });
      it('initializes card entitlement data with cardId', () => {
        expect(reduxHooks.useCardEntitlementData).toHaveBeenCalledWith(cardId);
      });
      it('initializes unenerollFromCourse event with cardId', () => {
        expect(apiHooks.useUnenrollFromCourse).toHaveBeenCalledWith(cardId);
      });
    });
    describe('output', () => {
      describe('customOption', () => {
        test('customOption.value returns custom option', () => {
          state.mockVal(state.keys.customOption, testValue);
          loadHook();
          expect(out.customOption.value).toEqual(testValue);
        });
        describe('customOption.onChange', () => {
          const applyUpdater = (updater, current) => updater(current);
          it('sets the custom option and checks the custom box when text is entered', () => {
            out.customOption.onChange({ target: { value: testValue } });
            expect(state.setState.customOption).toHaveBeenCalledWith(testValue);
            const updater = state.setState.selectedReasons.mock.calls[0][0];
            expect(applyUpdater(updater, ['time'])).toEqual(['time', 'custom']);
            expect(applyUpdater(updater, ['custom', 'time'])).toEqual(['custom', 'time']);
          });
          it('does not touch the selected reasons when the text is cleared', () => {
            out.customOption.onChange({ target: { value: '' } });
            expect(state.setState.customOption).toHaveBeenCalledWith('');
            expect(state.setState.selectedReasons).not.toHaveBeenCalled();
          });
        });
      });
      describe('hasReason', () => {
        it('returns true if an option is selected other than custom', () => {
          state.mockVal(state.keys.selectedReasons, [testValue]);
          loadHook();
          expect(out.hasReason).toEqual(true);
        });
        it('returns true if several options are selected', () => {
          state.mockVal(state.keys.selectedReasons, [testValue, testValue2]);
          loadHook();
          expect(out.hasReason).toEqual(true);
        });
        it('returns true if custom option is selected and provided', () => {
          state.mockVal(state.keys.selectedReasons, ['custom']);
          state.mockVal(state.keys.customOption, testValue2);
          loadHook();
          expect(out.hasReason).toEqual(true);
        });
        it('returns false if no option is selected', () => {
          state.mockVal(state.keys.selectedReasons, []);
          loadHook();
          expect(out.hasReason).toEqual(false);
        });
        it('returns false if custom option is selcted but not provided', () => {
          state.mockVal(state.keys.selectedReasons, ['custom']);
          state.mockVal(state.keys.customOption, '');
          loadHook();
          expect(out.hasReason).toEqual(false);
        });
      });
      describe('handleClear method', () => {
        it('resets selected and submitted reasons, custom option and isSkipped', () => {
          out.handleClear();
          expect(state.setState.selectedReasons).toHaveBeenCalledWith([]);
          expect(state.setState.customOption).toHaveBeenCalledWith('');
          expect(state.setState.isSkipped).toHaveBeenCalledWith(false);
          expect(state.setState.isSubmitted).toHaveBeenCalledWith(false);
        });
      });
      test('handleSkip sets isSkipped and isSubmitted, and unenrolls w/out a reason', () => {
        out.handleSkip();
        expect(state.setState.isSkipped).toHaveBeenCalledWith(true);
        expect(unenrollFromCourse).toHaveBeenCalledWith();
      });
      describe('handleSubmit', () => {
        it('logs the checked options, with labels, and the trimmed other text', () => {
          state.mockVal(state.keys.selectedReasons, ['time', 'zeroCompletion', 'custom']);
          state.mockVal(state.keys.customOption, ` ${testValue} `);
          loadHook();
          out.handleSubmit({});
          expect(apiHooks.useLogUnenrollReasons).toHaveBeenCalledWith(cardId);
          expect(logReasons).toHaveBeenCalledWith({
            reasons: [
              { key: 'time', label: "I don't have the time" },
              {
                key: 'zeroCompletion',
                label: 'I needed to unenroll from a 0%-completion class to register for new classes',
              },
            ],
            other: testValue,
          });
        });
        it('logs an empty other text when the custom option is not checked', () => {
          state.mockVal(state.keys.selectedReasons, ['time']);
          state.mockVal(state.keys.customOption, testValue);
          loadHook();
          out.handleSubmit({});
          expect(logReasons).toHaveBeenCalledWith({
            reasons: [{ key: 'time', label: "I don't have the time" }],
            other: '',
          });
        });
        it('tracks reason event and calls unenroll action', () => {
          state.mockVal(state.keys.selectedReasons, ['time']);
          loadHook();
          expect(trackCourseEvent).not.toHaveBeenCalled();
          const event = { test: 'event' };
          out.handleSubmit(event);
          expect(trackCourseEvent).toHaveBeenCalledWith(event);
          expect(unenrollFromCourse).toHaveBeenCalledWith();
        });
      });
      test('isSkipped returns state value', () => {
        state.mockVal(state.keys.isSkipped, testValue);
        loadHook();
        expect(out.isSkipped).toEqual(testValue);
      });
      test('isSubmitted returns state value', () => {
        state.mockVal(state.keys.isSubmitted, testValue);
        loadHook();
        expect(out.isSubmitted).toEqual(testValue);
      });
      describe('selectOption', () => {
        const applyUpdater = (updater, current) => updater(current);
        it('adds a checked option to the selection', () => {
          out.selectOption({ target: { value: 'time', checked: true } });
          const updater = state.setState.selectedReasons.mock.calls[0][0];
          expect(applyUpdater(updater, ['easy'])).toEqual(['easy', 'time']);
          expect(applyUpdater(updater, ['time'])).toEqual(['time']);
        });
        it('removes an unchecked option from the selection', () => {
          out.selectOption({ target: { value: 'time', checked: false } });
          const updater = state.setState.selectedReasons.mock.calls[0][0];
          expect(applyUpdater(updater, ['easy', 'time'])).toEqual(['easy']);
        });
      });
      test('selected returns the selectedReasons state', () => {
        state.mockVal(state.keys.selectedReasons, [testValue]);
        loadHook();
        expect(out.selected).toEqual([testValue]);
      });
      describe('submittedReasons', () => {
        it('returns the selected reasons, swapping the custom key for the custom text', () => {
          state.mockVal(state.keys.selectedReasons, [testValue]);
          state.mockVal(state.keys.customOption, testValue2);
          loadHook();
          expect(out.submittedReasons).toEqual([testValue]);
          state.mockVal(state.keys.selectedReasons, [testValue, 'custom']);
          state.mockVal(state.keys.customOption, testValue2);
          loadHook();
          expect(out.submittedReasons).toEqual([testValue, testValue2]);
        });
      });
    });
  });
});
