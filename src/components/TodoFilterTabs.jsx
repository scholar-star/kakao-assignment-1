const FILTERS = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '진행 중' },
  { value: 'completed', label: '완료' },
];

function TodoFilterTabs({ filterType, onFilterChange }) {
  return (
    <div className="flex bg-[#16161f] border border-[rgba(255,255,255,0.07)] rounded-xl p-1">
      {FILTERS.map(({ value, label }) => {
        const isActive = filterType === value;
        return (
          <button // 각 필터 버튼을 각 value와 label에 따라 구분하여 생성한다.
            key={value}
            onClick={() => onFilterChange(value)} // 클릭 시 onFilterChange 콜백을 호출.
            className={`flex-1 h-9 rounded-lg text-[13px] font-medium cursor-pointer font-['Noto_Sans_KR'] border-0 transition-all duration-150 ease-out ${
              isActive
                ? 'bg-[#672be0] text-white font-bold shadow-[0_2px_10px_rgba(103,43,224,0.25)]'
                : 'bg-transparent text-[#5a5472] hover:text-[#9d97b8] hover:bg-[#1e1e2a]'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default TodoFilterTabs;