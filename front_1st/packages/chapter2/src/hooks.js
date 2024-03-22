export function createHooks(callback) {
  let states = [];
  let currentIndex = 0;

  const useState = (initState) => {
    const index = currentIndex;

    if (states[index] === undefined) {
      states.push(initState);
    }

    const state = states[index];

    const setState = (newState) => {
      if (states[index] === newState) {
        // * initState와 newState값이 일치하면 반환한다.
        return;
      }
      states[index] = newState;

      callback();
    };

    currentIndex += 1;

    return [state, setState];
  };

  const useMemo = (fn, refs) => {};

  const resetContext = () => {
    currentIndex = 0;
  };

  return { useState, useMemo, resetContext };
}
