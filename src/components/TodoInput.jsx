import { useState, useRef, useEffect } from 'react';

function TodoInput({ onAdd }) {
  const [inputText, setInputText] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAdd = () => {
    const trimmed = inputText.trim();
    if (!trimmed) {
      setShowWarning(true);
      inputRef.current?.focus();
      return;
    }
    onAdd(trimmed);
    setInputText('');
    setShowWarning(false);
    inputRef.current?.focus();
  };

  return (
    <section className="flex flex-col gap-2">
      <div className="flex gap-2.5">
        <input
          ref={inputRef}
          type="text"
          placeholder="새로운 할 일을 입력하세요..."
          maxLength={100}
          autoComplete="off"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (e.target.value.trim()) setShowWarning(false);
          }}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 h-[52px] px-[18px] bg-[#16161f] border-[1.5px] border-[rgba(255,255,255,0.07)] rounded-xl text-[#f0eeff] text-[15px] font-['Noto_Sans_KR'] outline-none transition-all duration-250 ease-out placeholder:text-[#5a5472] focus:border-[#672be0] focus:shadow-[0_0_0_3px_rgba(103,43,224,0.08),0_0_20px_rgba(103,43,224,0.25)]"
        />
        <button
          onClick={handleAdd}
          className="h-[52px] px-4 sm:px-6 bg-[#672be0] text-white rounded-xl text-[14px] sm:text-[15px] font-bold cursor-pointer whitespace-nowrap transition-all duration-150 ease-out hover:bg-[#8a55e8] hover:shadow-[0_4px_16px_rgba(103,43,224,0.25)] active:scale-[0.97] active:bg-[#4f1fb5]"
        >
          추가
        </button>
      </div>

      {/* 할 일 누락 경고 문구 복원 */}
      {showWarning && (
        <p
          className="text-[13px] text-[#f5a623] px-1 animate-[fadeInDown_200ms_ease_forwards]"
          style={{ animation: 'fadeInDown 200ms ease forwards' }}
        >
          ⚠ 할 일을 입력한 후 추가해 주세요.
        </p>
      )}
    </section>
  );
}

export default TodoInput;