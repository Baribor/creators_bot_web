
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Suspense, useState } from 'react';
import { Await, Navigate, useAsyncValue, useLoaderData } from 'react-router-dom';
import Loader from '../../components/Loader';
import { ADMIN_KEY } from '../../lib/constants';


const columns = [
	{ id: 'id', label: 'ID', minWidth: 100 },
	{ id: 'username', label: 'Username', minWidth: 170 },
	{ id: 'name', label: 'Name', minWidth: 170 },
	{
		id: 'email',
		label: 'Email',
		minWidth: 170,
	},
	{
		id: 'contents',
		label: 'Total contents',
		minWidth: 90,
		align: 'center',
		format: (value) => value.toLocaleString('en-US'),
	},
	{
		id: 'views',
		label: 'Total views',
		minWidth: 90,
		align: 'center',
		format: (value) => value.toLocaleString('en-US'),
	},
	{
		id: 'joined',
		label: 'Joined At',
		minWidth: 90,
		align: 'center',
		format: (value) => new Date(value).toLocaleString('en-US'),
	},
];


export function CreatorsPage() {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const rows = useAsyncValue();

	if (rows?.message === "invalid token") {
		localStorage.removeItem(ADMIN_KEY)
		return <Navigate to={"/auth/admin/login"} replace={true} />
	}
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
									<TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
										{columns.map((column) => {
											const value = row[column.id];
											return (
												<TableCell key={column.id} align={column.align}>
													{column.format ? column.format(value)
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
				rowsPerPageOptions={[10, 25, 50, 100]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={(evt) => setPage(evt.target.value)}
				onRowsPerPageChange={(evt) => setRowsPerPage(evt.target.value)}
			/>
		</Paper>
	);
}


export default function CreatorsStatPage() {
	const res = useLoaderData();

	return (
		<Suspense fallback={<Loader />}>
			<Await resolve={res.data}>
				<CreatorsPage />
			</Await>
		</Suspense>
	)
}