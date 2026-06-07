function TodoSummaryBar({ summary }) {
  const cells = [
    { label: '전체',      value: summary.total },
    { label: '완료',      value: summary.completed },
    { label: '남은 항목', value: summary.remaining },
  ];
  return (
    <div className="flex gap-1.5">
      {cells.map(({ label, value }) => (
        <div
          key={label}
          className="flex-1 text-center py-2.5 px-2 bg-[#16161f] border border-[rgba(255,255,255,0.07)] rounded-lg text-[12px] text-[#9d97b8] font-light"
        >
          {label}
          <strong className="block text-[20px] font-bold text-[#8a55e8] mt-0.5">
            {value}
          </strong>
        </div>
      ))}
    </div>
  );
}

export default TodoSummaryBar;