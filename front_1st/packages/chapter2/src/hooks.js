export function createHooks(callback) {
  let states = [];
  let currentIndex = 0;

  const useState = (initState) => {
    const index = currentIndex;
    // states의 내부 데이터 초기값 설정
    if (states.length === index) {
      states.push(initState);
    }
    // state : 초기값을 담은 변수
    const state = states[index];

    const setState = (newState) => {
      // setState 내부에서는 newState가 변환이 없는 경우 실행 중지
      if (states[index] === newState) {
        return;
      }
      // 새로운 값으로 변경되는 경우 newState로 업데이트
      states[index] = newState;

      callback();
    };

    currentIndex += 1;

    return [state, setState];
  };

  const isSameValue = (a, b) => {
    const max = Math.max(a.length, b.length);
    for (let i = 0; i < max; i += 1) {
      if (a[i] === b[i].refs[0]) {
        return true;
      }
      return false;
    }
  };

  const useMemo = (fn, refs) => {
    const index = currentIndex;

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
