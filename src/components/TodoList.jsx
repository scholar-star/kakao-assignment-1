import TodoItem from './TodoItem';

function TodoList({ filteredItems, onToggleComplete, onEdit, onDelete }) {
  return (
    <section className="flex flex-col gap-0">
      <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
        {filteredItems.map((item) => (
          <TodoItem
            key={item.id}
            item={item}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>

      {/* 필터링 시 결과 데이터가 전혀 없을 때 표시되는 구문 및 아이콘 */}
      {filteredItems.length === 0 && (
        <div className="flex flex-col items-center gap-2.5 py-[60px] px-5 text-[#5a5472] text-[14px] select-none">
          <span className="text-[36px] opacity-50 leading-none">📋</span>
          <p>등록된 할 일이 없습니다.</p>
        </div>
      )}
    </section>
  );
}

export default TodoList;