/* ================================
   Todo 앱 - app.js
================================ */

// ── DOM 요소 참조 ──────────────────────────────────────────
const todoTextInput          = document.getElementById('todoTextInput');
const addTodoButton          = document.getElementById('addTodoButton');
const todoList               = document.getElementById('todoList');
const emptyInputWarningMessage = document.getElementById('emptyInputWarningMessage');
const emptyTodoListMessage   = document.getElementById('emptyTodoListMessage');
const totalTodoCount         = document.getElementById('totalTodoCount');
const completedTodoCount     = document.getElementById('completedTodoCount');
const remainingTodoCount     = document.getElementById('remainingTodoCount');
const todoFilterTabGroup     = document.getElementById('todoFilterTabGroup');

// ── 상태 ───────────────────────────────────────────────────
/** @type {{ id: number, text: string, isCompleted: boolean }[]} */
// todoitems 배열은 id, text, isCompleted 속성을 가진 객체들의 배열로 관리한다.
let todoItems = [];
let nextTodoId = 1;

/** 현재 선택된 필터 타입. 'all' | 'active' | 'completed' */
let currentFilterType = 'all';

// ── 유틸 ───────────────────────────────────────────────────

/**
 * 현재 todoItems 기준으로 요약 카운트를 갱신한다.
 */
function refreshSummaryCount() {
  const total     = todoItems.length;
  const completed = todoItems.filter(item => item.isCompleted).length;
  const remaining = total - completed;

  totalTodoCount.innerHTML     = `전체 <strong>${total}</strong>`;
  completedTodoCount.innerHTML = `완료 <strong>${completed}</strong>`;
  remainingTodoCount.innerHTML = `남은 항목 <strong>${remaining}</strong>`;
}

/**
 * 목록이 비었을 때 안내 메시지 표시 여부를 갱신한다.
 */
function refreshEmptyListVisibility() {
  if (getFilteredTodoItems().length === 0) {
    emptyTodoListMessage.classList.remove('hidden');
  } else {
    emptyTodoListMessage.classList.add('hidden');
  }
}

/**
 * 입력창의 경고 메시지를 잠시 보여준 뒤 숨긴다.
 */
function showEmptyInputWarning() {
  emptyInputWarningMessage.classList.remove('hidden'); // 지정 클래스 값 제거
  // 재실행 시 애니메이션 리셋
  emptyInputWarningMessage.style.animation = 'none';
  requestAnimationFrame(() => {
    emptyInputWarningMessage.style.animation = '';
  });
}

function hideEmptyInputWarning() {
  emptyInputWarningMessage.classList.add('hidden');
}

// ── 렌더링 ─────────────────────────────────────────────────

/**
 * 단일 Todo 아이템 <li> 엘리먼트를 생성해 반환한다.
 * @param {{ id: number, text: string, isCompleted: boolean }} todoItem
 * @returns {HTMLLIElement}
 */
function createTodoItemElement(todoItem) {
  const li = document.createElement('li');
  li.className = `todo-item${todoItem.isCompleted ? ' is-completed' : ''}`;
  li.dataset.id = todoItem.id;

  // 완료 버튼
  const completeButton = document.createElement('button');
  completeButton.className = 'todo-complete-button';
  // textContent로 버튼 텍스트 설정
  completeButton.textContent = todoItem.isCompleted ? '완료 취소' : '완료';
  completeButton.addEventListener('click', () => handleToggleTodoComplete(todoItem.id));

  // 텍스트
  const textSpan = document.createElement('span');
  textSpan.className = 'todo-item-text';
  textSpan.textContent = todoItem.text;

  // 수정 버튼
  const editButton = document.createElement('button');
  editButton.className = 'todo-edit-button';
  editButton.textContent = '수정';
  editButton.addEventListener('click', () => handleStartEditTodo(todoItem.id));

  // 삭제 버튼
  const deleteButton = document.createElement('button');
  deleteButton.className = 'todo-delete-button';
  deleteButton.textContent = '삭제';
  deleteButton.addEventListener('click', () => handleDeleteTodo(todoItem.id));

  // 액션 버튼 묶음
  const actionButtons = document.createElement('div');
  actionButtons.className = 'todo-action-buttons';
  actionButtons.appendChild(editButton);
  actionButtons.appendChild(deleteButton);

  li.appendChild(completeButton);
  li.appendChild(textSpan);
  li.appendChild(actionButtons);

  return li;
}

/**
 * todoItems 배열 전체를 기반으로 목록을 다시 그린다.
 */
function renderTodoList() {
  todoList.innerHTML = '';

  const filteredTodoItems = getFilteredTodoItems();

  filteredTodoItems.forEach(item => {
    const li = createTodoItemElement(item);
    todoList.appendChild(li);
  });

  refreshSummaryCount();
  refreshEmptyListVisibility();
}

// ── 핸들러 ─────────────────────────────────────────────────

/**
 * 새 Todo를 추가한다.
 * - 입력값이 비어있으면 경고 메시지를 표시하고 추가하지 않는다.
 */
function handleAddTodo() {
  const inputText = todoTextInput.value.trim();

  if (!inputText) {
    showEmptyInputWarning();
    todoTextInput.focus();
    return;
  }

  hideEmptyInputWarning();

  const newTodoItem = {
    id: nextTodoId++,
    text: inputText,
    isCompleted: false,
  };

  todoItems.push(newTodoItem);
  todoTextInput.value = '';

  renderTodoList();
  todoTextInput.focus();
}

/**
 * Todo의 완료 상태를 토글한다.
 * @param {number} todoId
 */
function handleToggleTodoComplete(todoId) {
  const targetItem = todoItems.find(item => item.id === todoId);
  if (!targetItem) return;

  targetItem.isCompleted = !targetItem.isCompleted;
  renderTodoList();
}

/**
 * Todo를 편집 모드로 전환한다.
 * - 텍스트 <span>을 <input>으로 교체하고 저장 버튼을 표시한다.
 * @param {number} todoId
 */
function handleStartEditTodo(todoId) {
  const targetItem = todoItems.find(item => item.id === todoId);
  if (!targetItem) return;

  const li       = todoList.querySelector(`[data-id="${todoId}"]`);
  const textSpan = li.querySelector('.todo-item-text');
  const editButton = li.querySelector('.todo-edit-button');

  // 텍스트 → 인풋으로 교체
  const editInput = document.createElement('input');
  editInput.type = 'text';
  editInput.className = 'todo-item-edit-input';
  editInput.value = targetItem.text;
  editInput.maxLength = 100;

  li.replaceChild(editInput, textSpan);
  editInput.focus();
  editInput.select();

  // 수정 버튼 → 저장 버튼으로 교체
  const saveButton = document.createElement('button');
  saveButton.className = 'todo-save-button';
  saveButton.textContent = '저장';
  saveButton.addEventListener('click', () => handleSaveEditTodo(todoId, editInput));

  editButton.replaceWith(saveButton);

  // Enter 키로도 저장
  editInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') handleSaveEditTodo(todoId, editInput);
    if (event.key === 'Escape') renderTodoList(); // 취소
  });
}

/**
 * 편집 중인 Todo를 저장한다.
 * - 빈 값이면 저장하지 않고 포커스 유지.
 * @param {number} todoId
 * @param {HTMLInputElement} editInput
 */
function handleSaveEditTodo(todoId, editInput) {
  const updatedText = editInput.value.trim();
  if (!updatedText) {
    editInput.focus();
    return;
  }

  const targetItem = todoItems.find(item => item.id === todoId);
  if (!targetItem) return;

  targetItem.text = updatedText;
  renderTodoList();
}

/**
 * Todo를 목록에서 삭제한다.
 * @param {number} todoId
 */
function handleDeleteTodo(todoId) {
  todoItems = todoItems.filter(item => item.id !== todoId);
  renderTodoList();
}

// ── 이벤트 등록 ────────────────────────────────────────────

// 추가 버튼 클릭
addTodoButton.addEventListener('click', handleAddTodo);

// Enter 키 입력
todoTextInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') handleAddTodo();
});

// 입력 시작하면 경고 메시지 숨김
todoTextInput.addEventListener('input', () => {
  if (todoTextInput.value.trim()) hideEmptyInputWarning();
});

// ── 초기 렌더링 ────────────────────────────────────────────
renderTodoList();

// ── 필터 ───────────────────────────────────────────────────



/**
 * 현재 필터에 맞게 todoItems를 걸러 반환한다.
 * @returns {{ id: number, text: string, isCompleted: boolean }[]}
 */
function getFilteredTodoItems() {
  if (currentFilterType === 'active')    return todoItems.filter(item => !item.isCompleted);
  if (currentFilterType === 'completed') return todoItems.filter(item =>  item.isCompleted);
  return todoItems;
}

/**
 * 필터 탭을 클릭했을 때 호출된다.
 * 선택된 탭의 is-active 클래스를 갱신하고 목록을 다시 그린다.
 * @param {string} selectedFilterType
 */
function handleSelectFilter(selectedFilterType) {
  currentFilterType = selectedFilterType;

  // 탭 활성 클래스 갱신
  todoFilterTabGroup.querySelectorAll('.todo-filter-tab').forEach(tabButton => {
    tabButton.classList.toggle('is-active', tabButton.dataset.filter === currentFilterType);
  });

  renderTodoList();
}

// 필터 탭 클릭 이벤트 위임
todoFilterTabGroup.addEventListener('click', (event) => {
  const clickedTab = event.target.closest('.todo-filter-tab');
  if (!clickedTab) return;
  handleSelectFilter(clickedTab.dataset.filter);
});
