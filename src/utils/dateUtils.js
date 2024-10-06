export const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date)) return dateString; // 日付が不正な場合はそのまま返す
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
