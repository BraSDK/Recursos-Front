export const mapPagination = (response) => ({
    data: response.data,
    currentPage: response.current_page,
    totalPages: response.last_page,
    totalRecords: response.total
  });