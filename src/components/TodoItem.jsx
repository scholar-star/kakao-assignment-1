import { useState, useRef, useEffect } from 'react';

function TodoItem({ item, onToggleComplete, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const editInputRef = useRef(null); // HTML Input 요소에 대한 참조

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus(); // 편집 모드로 전환할 때 입력란에 자동으로 focus
      editInputRef.current.select();
    }
  }, [isEditing]); // isEditing이 변경될 때마다

  const handleStartEdit = () => {
    setEditText(item.text);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const trimmed = editText.trim();
    if (!trimmed) {
      editInputRef.current?.focus();
      return;
    }
    onEdit(item.id, trimmed);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSaveEdit();
    if (e.key === 'Escape') setIsEditing(false);
  };

  const itemClass =
    `flex items-center gap-3 px-4 py-3.5 border rounded-xl transition-all duration-250 ease-out animate-[slideInUp_220ms_ease_forwards] ` +
    (item.isCompleted
      ? 'bg-[rgba(22,22,31,0.5)] border-[rgba(255,255,255,0.04)] opacity-65'
      : 'bg-[#16161f] border-[rgba(255,255,255,0.07)] hover:border-[rgba(103,43,224,0.5)] hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)]');

  const btnBase = "h-8 px-2 sm:px-3 rounded-lg text-[11px] sm:text-[12px] font-semibold cursor-pointer font-['Noto_Sans_KR'] transition-all duration-150 ease-out active:scale-95";

  return (
    <li className={itemClass} style={{ animation: 'slideInUp 220ms ease forwards' }}>
      
      {/* 완료 여부 스위치 단추 (시각 순서 배치 규칙 고수: order-2) */}
      <button
        onClick={() => onToggleComplete(item.id)}
        className={`${btnBase} order-2 border ${
          item.isCompleted
            ? 'bg-[#3ecf8e] text-white border-[#3ecf8e]'
            : 'bg-[rgba(62,207,142,0.1)] text-[#3ecf8e] border-[rgba(62,207,142,0.25)] hover:bg-[rgba(62,207,142,0.2)]'
        }`}
      >
        {item.isCompleted ? '완료 취소' : '완료'}
      </button>

      {/* 내용 영역 */}
      {isEditing ? (
        <input
          ref={editInputRef}
          type="text"
          maxLength={100}
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-[#1e1e2a] border-[1.5px] border-[#672be0] rounded-lg text-[#f0eeff] text-[15px] px-2.5 py-1 outline-none shadow-[0_0_0_3px_rgba(103,43,224,0.08)] font-['Noto_Sans_KR']"
        />
      ) : (
        <span
          className={`flex-1 text-[15px] font-normal break-words leading-relaxed transition-colors duration-250 ease-out ${
            item.isCompleted ? 'line-through text-[#5a5472]' : 'text-[#f0eeff]'
          }`}
        >
          {item.text}
        </span>
      )}

      {/* 편집 및 삭제 기능 단추 그룹 */}
      <div className="flex gap-1.5 flex-shrink-0">
        {isEditing ? (
          <button
            onClick={handleSaveEdit}
            className={`${btnBase} order-1 border bg-[#1e1e2a] text-[#8a55e8] border-[rgba(103,43,224,0.3)] hover:bg-[rgba(103,43,224,0.08)] hover:border-[#672be0]`}
          >
            저장
          </button>
        ) : (
          <button
            onClick={handleStartEdit}
            className={`${btnBase} order-1 border bg-[#1e1e2a] text-[#8a55e8] border-[rgba(103,43,224,0.3)] hover:bg-[rgba(103,43,224,0.08)] hover:border-[#672be0]`}
          >
            수정
          </button>
        )}
        <button
          onClick={() => onDelete(item.id)}
          className={`${btnBase} order-3 border bg-[rgba(224,85,85,0.1)] text-[#e05555] border-[rgba(224,85,85,0.25)] hover:bg-[rgba(224,85,85,0.2)]`}
        >
          삭제
        </button>
      </div>

    </li>
  );
}

export default TodoItem;