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
      // * initState와 newState값이 일치하면 반환한다.
      if (states[index] === newState) {
        return;
      }
      states[index] = newState;

      callback();
    };

    currentIndex += 1;

    return [state, setState];
  };

  const isSameValue = (a, b) => {
    const max = Math.max(a.length, b.length);
    for (let i = 0; i < max; i += 1) {
      console.log("ref", a[i], b[i].refs);

      if (a[i] === b[i].refs[0]) {
        return true;
      }
      return false;
    }
  };

  const useMemo = (fn, refs) => {
    const index = currentIndex;
    // TODO :refs [1] useMemo의 값을 변경하고 싶으면 의존하는 값을 수정해야한다.

    // 최초시작 혹은 디펜던시가 변경된 경우
    if (states[index] === undefined || !isSameValue(refs, states)) {
      states[index] = { result: fn(), refs };
    }
    return states[index].result;
  };

  const resetContext = () => {
    currentIndex = 0;
  };

  return { useState, useMemo, resetContext };
}
