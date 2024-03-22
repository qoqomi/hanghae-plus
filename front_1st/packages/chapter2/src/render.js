export function jsx(type, props, ...children) {
  const element = {
    type,
    props,
    children: children.flat(),
  };
  return element;
}

// VirtualDom을 realDom으로 변경하는 과정
export function createElement(node) {
  // jsx를 dom으로 변환
  // Q. 이 코드가 없으면 작동하지 않음
  // A. string 타입일 수 있다. 예를 들어 h태그를 넣어 돔 생성!
  if (typeof node === "string") {
    return document.createTextNode(node);
  }
  const { type, props, children } = node;
  const element = document.createElement(type);
  //props { id: 'test-id', class: 'test-class' }
  Object.entries(props || {})
    .filter(([att, value]) => value)
    .forEach(([att, value]) => {
      element.setAttribute(att, value);
    });

  children.forEach((child) => {
    // appendChild의 요소는 DOM요소이다.
    const childElement = createElement(child);
    element.appendChild(childElement);
  });
  return element;
}

function updateAttributes(target, newProps, oldProps) {
  // newProps들을 반복하여 각 속성과 값을 확인

  //   만약 oldProps에 같은 속성이 있고 값이 동일하다면
  //     다음 속성으로 넘어감 (변경 불필요)
  for (const [key, value] of Object.entries(newProps)) {
    if (newProps[key] === oldProps[key]) continue;
    target.setAttribute(key, value);
  }

  //   만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
  //     target에 해당 속성을 새 값으로 설정
  // oldProps을 반복하여 각 속성 확인
  //   만약 newProps들에 해당 속성이 존재한다면
  //     다음 속성으로 넘어감 (속성 유지 필요)
  //   만약 newProps들에 해당 속성이 존재하지 않는다면
  //     target에서 해당 속성을 제거
  for (const key of Object.keys(oldProps)) {
    if (newProps[key] !== undefined) {
      target.removeAttribute(key);
      continue;
    }
  }
}

export function render(parent, newNode, oldNode, index = 0) {
  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  //   종료
  if (!newNode && oldNode) {
    parent.removeChild(parent.childNodes[index]);
    return;
  }
  // 2. 만약 newNode가 있고 oldNode가 없다면
  //   newNode를 생성하여 parent에 추가
  //   종료
  if (newNode && !oldNode) {
    parent.appendChild(createElement(newNode));
    return;
  }

  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if (typeof newNode === "string" && typeof oldNode === "string") {
    if (newNode === oldNode) return;
    return parent.replaceChild(
      createElement(newNode),
      parent.childNodes[index]
    );
  }

  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  //   종료

  if (typeof newNode !== typeof oldNode) {
    parent.replaceChild(createElement(newNode), parent.childNodes[index]);
  }
  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  updateAttributes(
    parent.childNodes[index],
    newNode.props || {},
    oldNode.props || {}
  );

  // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
  //   각 자식노드에 대해 재귀적으로 render 함수 호출
  const newChildren = newNode.children || [];
  const oldChildren = oldNode.childNodes || [];

  const maxLength = Math.max(newChildren.length, oldChildren.length);

  for (let i = 0; i < maxLength; i += 1) {
    render(parent.childNodes[index], newChildren[i], oldChildren[i]);
  }
}
