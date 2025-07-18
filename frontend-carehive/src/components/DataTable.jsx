import React from 'react';
import PropTypes from 'prop-types';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    TableSortLabel,
    Box,
    Typography,
    CircularProgress
} from '@mui/material';

const DataTable = ({
    columns,
    data,
    loading = false,
    pagination = true,
    onRowClick,
    emptyMessage = "No data available",
    size = "medium",
    stickyHeader = false
}) => {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [orderBy, setOrderBy] = React.useState('');
    const [order, setOrder] = React.useState('asc');

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const sortedData = React.useMemo(() => {
        if (!orderBy) return data;

        return [...data].sort((a, b) => {
            if (a[orderBy] < b[orderBy]) {
                return order === 'asc' ? -1 : 1;
            }
            if (a[orderBy] > b[orderBy]) {
                return order === 'asc' ? 1 : -1;
            }
            return 0;
        });
    }, [data, orderBy, order]);

    const paginatedData = pagination
        ? sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : sortedData;

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Paper elevation={2} sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table
                    stickyHeader={stickyHeader}
                    size={size}
                    aria-label="data table"
                >
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align || 'left'}
                                    sortDirection={orderBy === column.id ? order : false}
                                    sx={{
                                        fontWeight: 'bold',
                                        backgroundColor: 'primary.main',
                                        color: 'primary.contrastText'
                                    }}
                                >
                                    {column.sortable ? (
                                        <TableSortLabel
                                            active={orderBy === column.id}
                                            direction={orderBy === column.id ? order : 'asc'}
                                            onClick={() => handleRequestSort(column.id)}
                                        >
                                            {column.label}
                                        </TableSortLabel>
                                    ) : (
                                        column.label
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.length > 0 ? (
                            paginatedData.map((row, rowIndex) => (
                                <TableRow
                                    hover
                                    key={row.id || rowIndex}
                                    onClick={() => onRowClick && onRowClick(row)}
                                    sx={{
                                        cursor: onRowClick ? 'pointer' : 'default',
                                        '&:nth-of-type(odd)': {
                                            backgroundColor: 'action.hover',
                                        },
                                        '&:last-child td, &:last-child th': { border: 0 }
                                    }}
                                >
                                    {columns.map((column) => (
                                        <TableCell key={column.id} align={column.align || 'left'}>
                                            {column.render
                                                ? column.render(row[column.id], row)
                                                : row[column.id]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        {emptyMessage}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {pagination && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            )}
        </Paper>
    );
};

DataTable.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    data: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    pagination: PropTypes.bool,
    onRowClick: PropTypes.func,
    emptyMessage: PropTypes.string,
    size: PropTypes.oneOf(['small', 'medium']),
    stickyHeader: PropTypes.bool
};
    
DataTable.defaultProps = {
    loading: false,
    pagination: true,
    emptyMessage: "No data available",
    size: "medium",
    stickyHeader: false
};

export default DataTable;