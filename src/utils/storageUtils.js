const STORAGE_KEY_ITEMS = 'todo_items';
const STORAGE_KEY_NEXT_ID = 'todo_next_id';

/**
 * todoItems 배열과 nextTodoId를 로컬스토리지에 저장한다.
 */
export function saveToStorage(todoItems, nextTodoId) {
  localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(todoItems));
  localStorage.setItem(STORAGE_KEY_NEXT_ID, JSON.stringify(nextTodoId));
}

/**
 * 로컬스토리지에서 데이터를 불러온다.
 * @returns {{ todoItems: Array, nextTodoId: number }}
 */
export function loadFromStorage() {
  const savedItems = localStorage.getItem(STORAGE_KEY_ITEMS);
  const savedNextId = localStorage.getItem(STORAGE_KEY_NEXT_ID);

  return {
    todoItems: savedItems ? JSON.parse(savedItems) : [],
    nextTodoId: savedNextId ? JSON.parse(savedNextId) : 1,
  };
}