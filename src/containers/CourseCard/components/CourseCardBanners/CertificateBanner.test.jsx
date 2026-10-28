import { shallow } from '@edx/react-unit-test-utils';

import { reduxHooks } from 'hooks';
import CertificateBanner from './CertificateBanner';
import messages from './messages';

jest.mock('hooks', () => ({
  utilHooks: {
    useFormatDate: jest.fn(() => date => date),
  },
  reduxHooks: {
    useCardCertificateData: jest.fn(),
    useCardCourseRunData: jest.fn(),
    useCardEnrollmentData: jest.fn(),
    useCardGradeData: jest.fn(),
    usePlatformSettingsData: jest.fn(),
  },
}));

jest.mock('components/Banner', () => 'Banner');

describe('CertificateBanner', () => {
  const props = { cardId: 'cardId' };
  reduxHooks.useCardCourseRunData.mockReturnValue({
    minPassingGrade: 0.8,
    progressUrl: 'progressUrl',
  });

  const defaultCertificate = {
    availableDate: '10/20/3030',
    isRestricted: false,
    isDownloadable: false,
    isEarnedButUnavailable: false,
  };
  const defaultEnrollment = {
    isAudit: false,
    isVerified: false,
  };
  const defaultCourseRun = { isArchived: false };
  const defaultGrade = { isPassing: false, percentGraded: 42, hasGradedContent: true };
  const defaultPlatformSettings = {};
  const createWrapper = ({
    certificate = {},
    enrollment = {},
    grade = {},
    courseRun = {},
    platformSettings = {},
  }) => {
    reduxHooks.useCardGradeData.mockReturnValueOnce({ ...defaultGrade, ...grade });
    reduxHooks.useCardCertificateData.mockReturnValueOnce({ ...defaultCertificate, ...certificate });
    reduxHooks.useCardEnrollmentData.mockReturnValueOnce({ ...defaultEnrollment, ...enrollment });
    reduxHooks.useCardCourseRunData.mockReturnValueOnce({ ...defaultCourseRun, ...courseRun });
    reduxHooks.usePlatformSettingsData.mockReturnValueOnce({ ...defaultPlatformSettings, ...platformSettings });
    return shallow(<CertificateBanner {...props} />);
  };
  /** TODO: Update tests to validate snapshots **/
  describe('snapshot', () => {
    test('is restricted', () => {
      const wrapper = createWrapper({
        certificate: {
          isRestricted: true,
        },
      });
      expect(wrapper.snapshot).toMatchSnapshot();
    });
    test('is restricted with support email', () => {
      const wrapper = createWrapper({
        certificate: {
          isRestricted: true,
        },
        platformSettings: {
          supportEmail: 'suport@email',
        },
      });
      expect(wrapper.snapshot).toMatchSnapshot();
    });
    test('is restricted with billing email', () => {
      const wrapper = createWrapper({
        certificate: {
          isRestricted: true,
        },
        platformSettings: {
          billingEmail: 'billing@email',
        },
      });
      expect(wrapper.snapshot).toMatchSnapshot();
    });
    test('is restricted and verified', () => {
      const wrapper = createWrapper({
        certificate: {
          isRestricted: true,
        },
        enrollment: {
          isVerified: true,
        },
      });
      expect(wrapper.snapshot).toMatchSnapshot();
    });
    test('is restricted and verified with support email', () => {
      const wrapper = createWrapper({
        certificate: {
          isRestricted: true,
        },
        enrollment: {
          isVerified: true,
        },
        platformSettings: {
          supportEmail: 'suport@email',
        },
      });
      expect(wrapper.snapshot).toMatchSnapshot();
    });
    test('is restricted and verified with billing email', () => {
      const wrapper = createWrapper({
        certificate: {
          isRestricted: true,
        },
        enrollment: {
          isVerified: true,
        },
        platformSettings: {
          billingEmail: 'billing@email',
        },
      });
      expect(wrapper.snapshot).toMatchSnapshot();
    });
    test('is restricted and verified with support and billing email', () => {
      const wrapper = createWrapper({
        certificate: {
          isRestricted: true,
        },
        enrollment: {
          isVerified: true,
        },
        platformSettings: {
          supportEmail: 'suport@email',
          billingEmail: 'billing@email',
        },
      });
      expect(wrapper.snapshot).toMatchSnapshot();
    });
    test('is passing and is downloadable', () => {
      const wrapper = createWrapper({
        grade: { isPassing: true },
        certificate: { isDownloadable: true },
      });
      expect(wrapper.snapshot).toMatchSnapshot();
    });
    test('is passing and is downloadable with a certificate link', () => {
      const wrapper = createWrapper({
        grade: { isPassing: true },
        certificate: { isDownloadable: true, certPreviewUrl: 'certPreviewUrl' },
      });
      expect(wrapper.snapshot).toMatchSnapshot();
    });
    test('not passing and is downloadable', () => {
      const wrapper = createWrapper({
        grade: { isPassing: false },
        certificate: { isDownloadable: true },
      });
      expect(wrapper.snapshot).toMatchSnapshot();
    });
    test('not passing and audit', () => {
      const wrapper = createWrapper({
        enrollment: {
          isAudit: true,
        },
      });
      expect(wrapper.snapshot).toMatchSnapshot();
    });
    test('not passing and has finished', () => {
      const wrapper = createWrapper({
        courseRun: { isArchived: true },
      });
      expect(wrapper.snapshot).toMatchSnapshot();
    });
    test('not passing and not audit and not finished', () => {
      const wrapper = createWrapper({});
      expect(wrapper.snapshot).toMatchSnapshot();
    });
    test('is passing and is earned but unavailable', () => {
      const wrapper = createWrapper({
        grade: {
          isPassing: true,
        },
        certificate: {
          isEarnedButUnavailable: true,
        },
      });
      expect(wrapper.snapshot).toMatchSnapshot();
    });
    test('is passing and not downloadable render empty', () => {
      const wrapper = createWrapper({
        grade: {
          isPassing: true,
        },
      });
      expect(wrapper.snapshot).toMatchSnapshot();
    });
  });
  describe('course with no graded content', () => {
    const ungraded = { isPassing: false, hasGradedContent: false };
    test('shows the passing grade as N/A (ungraded)', () => {
      const wrapper = createWrapper({ enrollment: { isAudit: true }, grade: ungraded });
      expect(wrapper.snapshot).toMatchSnapshot();
    });
    it.each([
      ['finished', { courseRun: { isArchived: true } }],
      ['not audit and not finished', {}],
    ])('shows the same N/A line when %s', (_, args) => {
      const auditWrapper = createWrapper({ enrollment: { isAudit: true }, grade: ungraded });
      const wrapper = createWrapper({ ...args, grade: ungraded });
      expect(wrapper.snapshot).toEqual(auditWrapper.snapshot);
    });
    it('still shows a downloadable certificate, same as a graded course', () => {
      const certificate = { isDownloadable: true };
      const ungradedWrapper = createWrapper({ grade: ungraded, certificate });
      const gradedWrapper = createWrapper({ grade: { isPassing: false }, certificate });
      expect(ungradedWrapper.snapshot).not.toEqual(null);
      expect(ungradedWrapper.snapshot).toEqual(gradedWrapper.snapshot);
    });
  });
  describe('behavior', () => {
    it('is restricted', () => {
      const wrapper = createWrapper({
        certificate: {
          isRestricted: true,
        },
        platformSettings: {
          supportEmail: 'suport@email',
          billingEmail: 'billing@email',
        },
      });
      const bannerMessage = wrapper.instance.findByType('format-message-function').map(el => el.props.message.defaultMessage).join('\n');
      expect(bannerMessage).toEqual(messages.certRestricted.defaultMessage);
      expect(bannerMessage).toContain(messages.certRestricted.defaultMessage);
    });
    it('is restricted and verified', () => {
      const wrapper = createWrapper({
        certificate: {
          isRestricted: true,
        },
        enrollment: {
          isVerified: true,
        },
        platformSettings: {
          supportEmail: 'suport@email',
          billingEmail: 'billing@email',
        },
      });
      const bannerMessage = wrapper.instance.findByType('format-message-function').map(el => el.props.message.defaultMessage).join('\n');
      expect(bannerMessage).toContain(messages.certRestricted.defaultMessage);
      expect(bannerMessage).toContain(messages.certRefundContactBilling.defaultMessage);
    });
  });
});
