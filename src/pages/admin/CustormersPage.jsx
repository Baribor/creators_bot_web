
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
import ConfirmAccountDeletion from '../../components/dialog/ConfirmAccountDeletionDialog';


const columns = [
	{ id: 'id', label: 'ID', minWidth: 100 },
	{ id: 'name', label: 'Name', minWidth: 170 },
	{
		id: 'subscriptions',
		label: 'Subscriptions',
		minWidth: 170,
		align: 'center',
		format: (value) => value.toLocaleString('en-US'),
	},
	{
		id: 'views',
		label: 'Contents viewed',
		minWidth: 170,
		align: 'center',
		format: (value) => value.toLocaleString('en-US'),
	},
	{ id: 'action', label: 'Actions', minWidth: 60 },
];


export function CustomersPage() {
	const [page, setPage] = useState(0);
	const [dialog, setDialog] = useState();
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const _rows = useAsyncValue();
	const [rows, setRows] = useState(_rows)

	const handleCreatorRemoved = (customer) => {
		if (customer) {
			setRows(rows.filter(c => c.id !== customer.id));
		}

		setDialog(false);
	}

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
									style={{ minWidth: column.minWidth, fontWeight: 700 }}
								>
									{column.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row) => {
								return (
									<TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
										{columns.map((column) => {
											const value = row[column.id];
											return column.id === "action" ?
												(
													<TableCell key={column.id}>
														<span className='bg-red-600 text-white rounded-full px-2 py-1 cursor-pointer' onClick={() => setDialog(row)}>Delete</span>

													</TableCell>
												)
												: (
												<TableCell key={column.id} align={column.align}>
														{column.format
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
				rowsPerPageOptions={[10, 25, 50, 100]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={(evt, page) => setPage(page)}
				onRowsPerPageChange={(evt) => setRowsPerPage(evt.target.value)}
			/>

			{
				dialog && <ConfirmAccountDeletion account={dialog} handleClose={handleCreatorRemoved} type="customer" title='Delete Customer'>
					<p>
						This action is unrecoverable. <br />
						All generated data belonging to this account will be lost.
					</p>
				</ConfirmAccountDeletion>
			}
		</Paper>
	);
}


export default function CustomersStatPage() {
	const res = useLoaderData();

	return (
		<Suspense fallback={<Loader />}>
			<Await resolve={res.data}>
				<CustomersPage />
			</Await>
		</Suspense>
	)
}