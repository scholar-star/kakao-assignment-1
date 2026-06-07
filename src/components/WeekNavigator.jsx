import { useMemo } from 'react';
import { getWeekMonday, toDateString, getTodayDateString, formatDateLabel } from '../utils/dateUtils';

const DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일'];

function WeekNavigator({ selectedDate, onDateSelect, onWeekShift, getCountByDate }) {
  const todayStr = getTodayDateString();

  const { monday, sunday, weekDays } = useMemo(() => {
    const m = getWeekMonday(selectedDate);
    const s = new Date(m);
    s.setDate(m.getDate() + 6);
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(m);
      d.setDate(m.getDate() + i);
      return toDateString(d);
    });
    return { monday: m, sunday: s, weekDays: days };
  }, [selectedDate]);

  const fmt = (d) => `${d.getMonth() + 1}월 ${d.getDate()}일`;
  const weekRangeLabel = `${monday.getFullYear()}년 ${fmt(monday)} – ${fmt(sunday)}`;

  return (
    <div className="bg-[#16161f] border-[1.5px] border-[rgba(255,255,255,0.07)] rounded-xl overflow-hidden transition-all duration-250 ease-out hover:border-[rgba(103,43,224,0.5)]">
      
      {/* 날짜 전환 상단 바 */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[rgba(255,255,255,0.07)] gap-2">
        <button
          aria-label="이전 주"
          onClick={() => onWeekShift(-1)}
          className="w-[30px] h-[30px] flex items-center justify-center bg-[#1e1e2a] border border-[rgba(255,255,255,0.07)] rounded-lg text-[#9d97b8] text-[20px] font-['Noto_Sans_KR'] leading-none cursor-pointer transition-all duration-150 ease-out hover:bg-[rgba(103,43,224,0.08)] hover:border-[#672be0] hover:text-[#8a55e8] active:scale-[0.92]"
        >
          ‹
        </button>
        <span className="text-[12px] sm:text-[13px] font-semibold text-[#9d97b8] tracking-[0.3px] flex-1 text-center select-none">
          {weekRangeLabel}
        </span>
        <button
          aria-label="다음 주"
          onClick={() => onWeekShift(1)}
          className="w-[30px] h-[30px] flex items-center justify-center bg-[#1e1e2a] border border-[rgba(255,255,255,0.07)] rounded-lg text-[#9d97b8] text-[20px] font-['Noto_Sans_KR'] leading-none cursor-pointer transition-all duration-150 ease-out hover:bg-[rgba(103,43,224,0.08)] hover:border-[#672be0] hover:text-[#8a55e8] active:scale-[0.92]"
        >
          ›
        </button>
      </div>

      {/* 7일 그리드 영역 */}
      <div className="grid grid-cols-7 bg-transparent">
        {weekDays.map((dateStr, i) => {
          const isSelected = dateStr === selectedDate;
          const isToday = dateStr === todayStr;
          const count = getCountByDate(dateStr);
          const dayNumber = new Date(dateStr.split('-')[0], dateStr.split('-')[1] - 1, dateStr.split('-')[2]).getDate();

          // 기존 style.css 내부의 토요일/일요일 감성 디자인 컬러 매핑 복원
          let cellTextColor = 'text-[#5a5472]'; // 평일 기본 무색화 상태
          let numTextColor = 'text-[#9d97b8]'; // 평일 활성화용 숫자 상태

          if (i === 5) {
            cellTextColor = 'text-[rgba(100,180,255,0.85)]';
            numTextColor = 'text-[rgba(100,180,255,0.85)]';
          } else if (i === 6) {
            cellTextColor = 'text-[rgba(255,110,110,0.85)]';
            numTextColor = 'text-[rgba(255,110,110,0.85)]';
          }

          // 상태 파생 변칙 클래스 결합
          let nameClass = `text-[11px] font-medium tracking-[0.5px] ${cellTextColor}`;
          let numClass = `text-[15px] sm:text-[18px] font-bold leading-none w-7 h-7 sm:w-[34px] sm:h-[34px] flex items-center justify-center rounded-full transition-all duration-150 ease-out ${numTextColor}`;

          if (isSelected) {
            nameClass = 'text-[11px] font-medium tracking-[0.5px] text-[#8a55e8]';
            numClass = 'text-[15px] sm:text-[18px] font-bold leading-none w-7 h-7 sm:w-[34px] sm:h-[34px] flex items-center justify-center rounded-full transition-all duration-150 ease-out bg-[#672be0] !text-white shadow-[0_2px_10px_rgba(103,43,224,0.25)]';
          } else if (isToday) {
            nameClass = 'text-[11px] font-bold tracking-[0.5px] text-[#3ecf8e]';
            numClass = 'text-[15px] sm:text-[18px] font-bold leading-none w-7 h-7 sm:w-[34px] sm:h-[34px] flex items-center justify-center rounded-full transition-all duration-150 ease-out bg-[rgba(62,207,142,0.15)] !text-[#3ecf8e] border-[1.5px] border-[rgba(62,207,142,0.4)]';
          }

          return (
            <button
              key={dateStr}
              onClick={() => onDateSelect(dateStr)}
              className="flex flex-col items-center gap-1 py-2.5 px-1 bg-transparent border-0 border-r border-[rgba(255,255,255,0.07)] last:border-r-0 cursor-pointer transition-all duration-150 ease-out hover:bg-[rgba(103,43,224,0.08)]"
              aria-label={formatDateLabel(dateStr)}
            >
              <span className={nameClass}>{DAY_NAMES[i]}</span>
              <span className={numClass}>{dayNumber}</span>
              
              {/* 카운트 배지 문구 제어 복원 */}
              <span
                className={`text-[10px] font-bold text-[#8a55e8] min-h-[14px] bg-[rgba(103,43,224,0.08)] rounded-full px-1.5 leading-[14px] transition-opacity duration-150 ease-out ${
                  count > 0 ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {count > 0 ? count : ''}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default WeekNavigator;