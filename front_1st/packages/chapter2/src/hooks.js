export function createHooks(callback) {
  let states = [];
  let initialStateKey = 0;

  const useState = (initState) => {
    // console.log("states✅", states);
    if (states.length === initialStateKey) {
      states.push(initState);
    }

    console.log("1️⃣", states);
    const state = states[initialStateKey];

    const setState = (newState) => {
      console.log("newState", newState);
      if ((initState === "newState", newState)) {
        // * initState와 newState값이 일치하면 반환한다.
        return;
      }
      states[initialStateKey] = newState;
      console.log("2️⃣", states);

      callback();
    };

    initialStateKey++;

    return [state, setState];
  };

  const useMemo = (fn, refs) => {
    return fn();
  };

  const resetContext = () => {
    console.log("3️⃣", states);

    // TODO:  callback이 실행되기 이전에 resetContext를 실행해야 값이 정상적으로 반영된다.
  };

  return { useState, useMemo, resetContext };
}
