import React, {
  createContext, useCallback, useContext, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';

/**
 * Shared state for the "Minimize completed courses" feature (OST2 customization).
 *
 * Two pieces of state drive whether a *completed* course card (one whose
 * certificate is ready) is shown minimized:
 *   - `minimizeCompleted`: the page-level checkbox value (default: true).
 *   - `overrides`: per-card opt-outs, `cardId -> <minimized boolean>`, written
 *     whenever a learner clicks an individual card's collapse/expand triangle.
 *
 * A completed card's minimized state is its override if one exists, otherwise it
 * follows the checkbox. Toggling the checkbox clears every override, so it
 * re-applies to all completed courses (un-minimize all / re-minimize all).
 */
const MinimizeContext = createContext({
  minimizeCompleted: true,
  setMinimizeCompleted: () => {},
  isCardMinimized: () => false,
  toggleCardMinimized: () => {},
});

export const MinimizeProvider = ({ children }) => {
  const [minimizeCompleted, setMinimizeCompletedState] = useState(true);
  const [overrides, setOverrides] = useState({});

  const setMinimizeCompleted = useCallback((value) => {
    setMinimizeCompletedState(value);
    setOverrides({}); // re-apply the checkbox to every completed course
  }, []);

  const isCardMinimized = useCallback(
    (cardId) => (cardId in overrides ? overrides[cardId] : minimizeCompleted),
    [overrides, minimizeCompleted],
  );

  const toggleCardMinimized = useCallback((cardId) => {
    setOverrides((prev) => {
      const current = cardId in prev ? prev[cardId] : minimizeCompleted;
      return { ...prev, [cardId]: !current };
    });
  }, [minimizeCompleted]);

  const value = useMemo(() => ({
    minimizeCompleted,
    setMinimizeCompleted,
    isCardMinimized,
    toggleCardMinimized,
  }), [minimizeCompleted, setMinimizeCompleted, isCardMinimized, toggleCardMinimized]);

  return (
    <MinimizeContext.Provider value={value}>
      {children}
    </MinimizeContext.Provider>
  );
};
MinimizeProvider.propTypes = {
  children: PropTypes.node,
};
MinimizeProvider.defaultProps = {
  children: null,
};

export const useMinimizeContext = () => useContext(MinimizeContext);

export default MinimizeContext;
