import { shallow } from '@edx/react-unit-test-utils';

import { reduxHooks } from 'hooks';

import CourseCardActionSlot from 'plugin-slots/CourseCardActionSlot';
import SelectSessionButton from './SelectSessionButton';
import ViewCourseButton from './ViewCourseButton';

import CourseCardActions from '.';

jest.mock('hooks', () => ({
  reduxHooks: {
    useCardEntitlementData: jest.fn(),
  },
}));

jest.mock('plugin-slots/CourseCardActionSlot', () => 'CustomActionButton');
jest.mock('./SelectSessionButton', () => 'SelectSessionButton');
jest.mock('./ViewCourseButton', () => 'ViewCourseButton');

const cardId = 'test-card-id';
const props = { cardId };

let el;
describe('CourseCardActions', () => {
  const mockHooks = ({
    isEntitlement = false,
    isFulfilled = false,
  } = {}) => {
    reduxHooks.useCardEntitlementData.mockReturnValueOnce({ isEntitlement, isFulfilled });
  };
  const render = () => {
    el = shallow(<CourseCardActions {...props} />);
  };
  describe('behavior', () => {
    it('initializes redux hooks', () => {
      mockHooks();
      render();
      expect(reduxHooks.useCardEntitlementData).toHaveBeenCalledWith(cardId);
    });
  });
  describe('output', () => {
    it('always renders the CourseCardActionSlot', () => {
      mockHooks();
      render();
      expect(el.instance.findByType(CourseCardActionSlot)[0].props.cardId).toEqual(cardId);
    });
    describe('entitlement course', () => {
      it('renders ViewCourseButton if fulfilled', () => {
        mockHooks({ isEntitlement: true, isFulfilled: true });
        render();
        expect(el.instance.findByType(ViewCourseButton)[0].props.cardId).toEqual(cardId);
      });
      it('renders SelectSessionButton if not fulfilled', () => {
        mockHooks({ isEntitlement: true });
        render();
        expect(el.instance.findByType(SelectSessionButton)[0].props.cardId).toEqual(cardId);
      });
    });
    describe('non-entitlement course', () => {
      it('renders ViewCourseButton regardless of completion level', () => {
        mockHooks();
        render();
        expect(el.instance.findByType(ViewCourseButton)[0].props.cardId).toEqual(cardId);
      });
    });
  });
});
