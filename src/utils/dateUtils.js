/**
 * Date 객체를 'YYYY-MM-DD' 형식으로 반환한다.
 * @param {Date} date
 * @returns {string}
 */
export function toDateString(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * 오늘 날짜를 'YYYY-MM-DD' 형식으로 반환한다.
 * @returns {string}
 */
export function getTodayDateString() {
  return toDateString(new Date());
}

/**
 * 'YYYY-MM-DD' 문자열을 사람이 읽기 좋은 형태로 변환한다.
 * 예: '2025-06-01' → '2025년 6월 1일 (일)'
 * @param {string} dateString
 * @returns {string}
 */
export function formatDateLabel(dateString) {
  const [y, m, d] = dateString.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  return `${y}년 ${m}월 ${d}일 (${dayNames[date.getDay()]})`;
}

/**
 * 주어진 날짜가 속한 주의 월요일 날짜를 반환한다.
 * @param {string} dateString
 * @returns {Date}
 */
export function getWeekMonday(dateString) {
  const [y, m, d] = dateString.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return date;
}

/**
 * 날짜를 n주 이동한다.
 * @param {string} dateString
 * @param {number} weekOffset
 * @returns {string}
 */
export function shiftWeek(dateString, weekOffset) {
  const [y, m, d] = dateString.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + weekOffset * 7);
  return toDateString(date);
}