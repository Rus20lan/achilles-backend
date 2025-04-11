function getVisiblePages(
  currentPage = 1,
  totalPage = 1,
  maxVisible = 5,
  ellipsis = "..."
) {
  const result = [];

  if (totalPage <= maxVisible)
    return Array.from({ length: totalPage }, (_, i) => i + 1);
  // Всегда должны быть в массиве первая страница и последняя
  const firstPage = +currentPage === 1 ? +currentPage : 1;
  const leftPage = +currentPage - 1 !== 1 ? +currentPage - 1 : null;
  const rightPage = +currentPage + 1 < +totalPage ? +currentPage + 1 : null;

  // Добавляем первую страницу
  if (firstPage !== +currentPage) result.push(firstPage);
  if (leftPage) {
    if (leftPage - firstPage >= 2) {
      result.push(ellipsis);
    }
    result.push(leftPage, +currentPage);
  } else {
    result.push(+currentPage);
  }
  if (rightPage) {
    result[result.length] = rightPage;
    if (totalPage - currentPage >= 3) {
      result[result.length] = ellipsis;
    }
  }
  if (!result.includes(+totalPage)) result[result.length] = +totalPage;
  return result;
}

export default getVisiblePages;
