import { StrictDict } from 'utils';
import { FilterKeys, SortKeys } from 'data/constants/app';

import simpleSelectors from './simpleSelectors';
import * as module from './currentList';

export const sortFn = (transform, { reverse }) => (v1, v2) => {
  const [a, b] = [v1, v2].map(transform);
  if (a === b) { return 0; }
  return ((a > b) ? 1 : -1) * (reverse ? -1 : 1);
};

export const courseFilters = StrictDict({
  [FilterKeys.notEnrolled]: (course) => !course.enrollment.isEnrolled,
  [FilterKeys.done]: (course) => course.courseRun !== null && course.courseRun.isArchived,
  [FilterKeys.upgraded]: (course) => course.enrollment.isVerified,
  [FilterKeys.inProgress]: (course) => course.enrollment.hasStarted,
  [FilterKeys.notStarted]: (course) => !course.enrollment.hasStarted,
});

export const transforms = StrictDict({
  [SortKeys.enrolled]: ({ enrollment }) => new Date(enrollment.lastEnrolled),
  [SortKeys.title]: ({ course }) => course.courseName.toLowerCase(),
});

export const courseFilterFn = filters => (filters.length
  ? course => filters.reduce((match, filter) => match && courseFilters[filter](course), true)
  : () => true);

// OST2: a course counts as "completed" once its certificate is ready to view /
// download -- the same signal the dashboard uses to collapse the card.
export const isCompleted = (course) => Boolean(
  course.certificate && course.certificate.isDownloadable,
);

// OST2: the learner's current grade as a fraction in [0, 1]; 0 when no grade has
// been recorded yet (used to order incomplete courses by descending completion).
export const gradePercent = (course) => (
  course.gradeData && typeof course.gradeData.percentGraded === 'number'
    ? course.gradeData.percentGraded
    : 0
);

export const currentList = (allCourses, {
  filters,
}) => {
  const titleSort = module.sortFn(transforms[SortKeys.title], { reverse: false });
  return allCourses
    .filter(module.courseFilterFn(filters))
    .sort((a, b) => {
      // Completed courses always sink below incomplete ones,
      const [aDone, bDone] = [module.isCompleted(a), module.isCompleted(b)];
      if (aDone !== bDone) { return aDone ? 1 : -1; }
      // completed courses are ordered alphabetically by title (A->Z),
      if (aDone) { return titleSort(a, b); }
      // incomplete courses are ordered by descending current grade,
      const gradeDiff = module.gradePercent(b) - module.gradePercent(a);
      if (gradeDiff !== 0) { return gradeDiff; }
      // with ties broken alphabetically by title.
      return titleSort(a, b);
    });
};

export const visibleList = (state, {
  sortBy,
  filters,
  pageSize,
}) => {
  const courses = Object.values(simpleSelectors.courseData(state));
  const list = module.currentList(courses, { sortBy, filters });
  const pageNumber = simpleSelectors.pageNumber(state);

  if (pageSize === 0) {
    return {
      visible: list,
      numPages: 1,
    };
  }
  return {
    visibleList: list.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
    numPages: Math.ceil(list.length / pageSize),
  };
};

export default visibleList;
