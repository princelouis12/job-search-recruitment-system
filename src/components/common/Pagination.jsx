import React from 'react';
import { Box, Pagination as MuiPagination, Typography } from '@mui/material';

const Pagination = ({ 
  totalItems, 
  itemsPerPage, 
  currentPage, 
  onPageChange,
  showItemCount = true 
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(startIndex + itemsPerPage - 1, totalItems);

  return (
    <Box sx={{ 
      mt: 3, 
      display: 'flex', 
      flexDirection: { xs: 'column', sm: 'row' }, 
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2
    }}>
      {showItemCount && (
        <Typography variant="body2" color="text.secondary">
          Showing {startIndex}-{endIndex} of {totalItems} items
        </Typography>
      )}
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={(event, page) => onPageChange(page)}
        color="primary"
        size="large"
        showFirstButton
        showLastButton
      />
    </Box>
  );
};

export default Pagination;