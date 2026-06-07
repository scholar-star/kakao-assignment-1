import { useState, useCallback } from 'react';
import { getTodayDateString } from '../utils/dateUtils';
import { saveToStorage, loadFromStorage } from '../utils/storageUtils';

const initialState = loadFromStorage();

/**
 * Todo 상태와 CRUD 로직을 담당하는 커스텀 훅
 */
export function useTodos() { 
  const [todoItems, setTodoItems] = useState(initialState.todoItems); // 전체 할 일 목록 상태.
  const [nextTodoId, setNextTodoId] = useState(initialState.nextTodoId); // 다음 할 일 추가시 지정할 ID 
  const [selectedDate, setSelectedDate] = useState(getTodayDateString()); // 선택된 날짜 - 기본 : 오늘
  const [filterType, setFilterType] = useState('all'); // 필터 상태

  /** 상태 저장 헬퍼 */
  const persist = useCallback((items, nextId) => {
    saveToStorage(items, nextId);
  }, []);

  /** 새 Todo 추가 */
  const addTodo = useCallback((text) => {
    const newItem = {
      id: nextTodoId,
      text,
      isCompleted: false,
      date: selectedDate,
    };
    const updated = [...todoItems, newItem];
    const newNextId = nextTodoId + 1;
    setTodoItems(updated);
    setNextTodoId(newNextId);
    persist(updated, newNextId);
  }, [todoItems, nextTodoId, selectedDate, persist]);

  /** 완료 상태 토글 */
  const toggleComplete = useCallback((todoId) => {
    const updated = todoItems.map(item =>
      item.id === todoId ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setTodoItems(updated);
    persist(updated, nextTodoId);
  }, [todoItems, nextTodoId, persist]);

  /** 텍스트 수정 */
  const editTodo = useCallback((todoId, newText) => {
    const updated = todoItems.map(item =>
      item.id === todoId ? { ...item, text: newText } : item
    );
    setTodoItems(updated);
    persist(updated, nextTodoId);
  }, [todoItems, nextTodoId, persist]);

  /** 삭제 */
  const deleteTodo = useCallback((todoId) => {
    const updated = todoItems.filter(item => item.id !== todoId);
    setTodoItems(updated);
    persist(updated, nextTodoId);
  }, [todoItems, nextTodoId, persist]);

  /** 필터링된 todo 목록 */
  const filteredItems = todoItems
    .filter(item => item.date === selectedDate)
    .filter(item => {
      if (filterType === 'active') return !item.isCompleted;
      if (filterType === 'completed') return item.isCompleted;
      return true;
    });

  /** 선택 날짜 기준 요약 카운트 */
  const dateTodos = todoItems.filter(item => item.date === selectedDate);
  const summary = {
    total: dateTodos.length,
    completed: dateTodos.filter(i => i.isCompleted).length,
    remaining: dateTodos.filter(i => !i.isCompleted).length,
  };

  /** 특정 날짜의 todo 개수 (주간 네비게이터용) */
  const getCountByDate = useCallback((dateString) => {
    return todoItems.filter(item => item.date === dateString).length;
  }, [todoItems]);

  return {
    todoItems,
    filteredItems,
    summary,
    selectedDate,
    setSelectedDate,
    filterType,
    setFilterType,
    addTodo,
    toggleComplete,
    editTodo,
    deleteTodo,
    getCountByDate,
  };
}