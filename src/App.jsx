import { useTodos } from './hooks/useTodos';
import { shiftWeek } from './utils/dateUtils';
import WeekNavigator from './components/WeekNavigator';
import TodoInput from './components/TodoInput';
import TodoSummaryBar from './components/TodoSummaryBar';
import TodoFilterTabs from './components/TodoFilterTabs';
import TodoList from './components/TodoList';
import './index.css';

function App() {
  const {
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
  } = useTodos();

  const handleDateSelect = (dateStr) => {
    setSelectedDate(dateStr);
    setFilterType('all');
  };
  const handleWeekShift = (offset) => setSelectedDate((prev) => shiftWeek(prev, offset));

  // style.css의 body 태그 배경 Radial Gradient 패턴 복사
  const bodyBgStyle = {
    backgroundColor: '#0e0e14',
    backgroundImage: `
      radial-gradient(ellipse 60% 40% at 70% 10%, rgba(103, 43, 224, 0.12) 0%, transparent 60%),
      radial-gradient(ellipse 40% 30% at 20% 80%, rgba(103, 43, 224, 0.07) 0%, transparent 60%)
    `,
  };

  return (
    <div
      style={bodyBgStyle}
      className="w-full min-h-screen flex items-center justify-center p-4 sm:p-12 font-['Noto_Sans_KR',sans-serif] text-[#f0eeff] selection:bg-[#672be0] selection:text-white"
    >
      <div className="w-full max-w-[640px] flex flex-col gap-5">
        {/* 헤더 영역 */}
        <header className="pt-2 pb-1">
          <h1
            className="text-[52px] sm:text-[72px] font-['Bebas_Neue'] tracking-[6px] leading-none text-[#8a55e8] text-center"
            style={{ textShadow: '0 0 40px rgba(103, 43, 224, 0.25)' }}
          >
            TODO
          </h1>
          <p className="text-[14px] text-[#5a5472] mt-1.5 font-light tracking-[0.5px] text-center">
            오늘 할 일을 기록하세요
          </p>
        </header>

        {/* 각 기능별 컴포넌트 */}
        <WeekNavigator
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onWeekShift={handleWeekShift}
          getCountByDate={getCountByDate}
        />
        <TodoInput onAdd={addTodo} />
        <TodoSummaryBar summary={summary} />
        <TodoFilterTabs filterType={filterType} onFilterChange={setFilterType} />
        <TodoList
          filteredItems={filteredItems}
          onToggleComplete={toggleComplete}
          onEdit={editTodo}
          onDelete={deleteTodo}
        />
      </div>
    </div>
  );
}

export default App;