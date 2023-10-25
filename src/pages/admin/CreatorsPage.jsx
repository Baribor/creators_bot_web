
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';


const columns = [
	{ id: 'id', label: 'ID', minWidth: 100 },
	{ id: 'name', label: 'Name', minWidth: 170 },
	{
		id: 'email',
		label: 'Email',
		minWidth: 170,
	},
	{
		id: 'contents',
		label: 'Total contents',
		minWidth: 170,
		align: 'right',
		format: (value) => value.toLocaleString('en-US'),
	},
	{
		id: 'views',
		label: 'Total views',
		minWidth: 170,
		align: 'right',
		format: (value) => value.toLocaleString('en-US'),
	},
];


function createData(
	id,
	name,
	email,
	contents,
	views
) {
	return { id, name, email, contents, views };
}

const rows = [
	createData(266263723, 'Ben Mark', "benmark@gmail.com", 12, 2211),
	createData(12063723, 'Mary Posh', "maryposh@gmail.com", 112, 9182),
];

export default function CreatorsPage() {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	return (
		<Paper sx={{ width: '100%', overflow: 'hidden' }}>
			<TableContainer sx={{ maxHeight: 440 }}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell
									key={column.id}
									align={column.align}
									style={{ minWidth: column.minWidth }}
								>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row) => {
								return (
									<TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
										{columns.map((column) => {
											const value = row[column.id];
											return (
												<TableCell key={column.id} align={column.align}>
													{column.format && typeof value === 'number'
														? column.format(value)
														: value}
												</TableCell>
											);
										})}
									</TableRow>
								);
							})}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[10, 25, 100]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}

			/>
		</Paper>
	);
}
