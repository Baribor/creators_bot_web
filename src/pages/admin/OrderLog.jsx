
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Suspense, useState } from 'react';
import { Await, Navigate, useAsyncValue, useLoaderData, useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import { ADMIN_KEY } from '../../lib/constants';
import ConfirmContentDeletion from '../../components/dialog/ConfirmContentDelete';


const columns = [
	{ id: 'ref', label: 'Ref', minWidth: 100 },
	{ id: 'seller', label: 'Seller', minWidth: 120 },
	{ id: 'buyer', label: 'Buyer', minWidth: 120 },
	{
		id: 'paidOn', label: 'Date', minWidth: 90,
		align: 'left',
		format: (value) => new Date(value).toLocaleDateString('en-US'),
	},
	{
		id: 'paidOn', label: 'Time', minWidth: 90,
		align: 'left',
		format: (value) => new Date(value).toLocaleTimeString('en-US'),
	},
	{ id: 'item', label: 'Item', minWidth: 120 },
];


export function Logs() {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(25);
	const navigate = useNavigate();
	const _rows = useAsyncValue();
	const [rows, setRows] = useState(_rows);
	const [dialog, setDialog] = useState(false);

	const handleContentDeleted = (id) => {
		if (id) {
			setRows(rows.filter((r) => r.id !== id))
		}

		setDialog(false)
	}

	if (_rows?.message === "invalid token") {
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
						{rows
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row) => {
								return (
									<TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
										{columns.map((column) => {
											const value = row[column.id];
											return column.id === "action" ?
												(
													<TableCell key={column.id}>
														<div className='flex gap-1'>
															<span className='bg-blue-600 text-white rounded-full px-2 py-1 cursor-pointer' onClick={() => {
																navigate(`/admin/content/detail/${row.id}`)
															}}>View</span>
															<span className='bg-red-600 text-white rounded-full px-2 py-1 cursor-pointer' onClick={() => setDialog(row.id)}>Delete</span>
														</div>
													</TableCell>
												)
												:
												(
													<TableCell key={column.id} align={column.align}>
														{column.format
															? column.format(value)
															: value ?? <span className='text-red-700 font-semibold'>[DELETED]</span>}
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
				rowsPerPageOptions={[25, 50, 100]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={(evt, page) => setPage(page)}
				onRowsPerPageChange={(evt) => setRowsPerPage(evt.target.value)}
				labelRowsPerPage="Orders per page"
			/>

			{
				dialog && <ConfirmContentDeletion contentId={dialog} handleClose={handleContentDeleted} />
			}
		</Paper>
	);
}


export default function OrderLogPage() {
	const res = useLoaderData();

	return (
		<Suspense fallback={<Loader />}>
			<Await resolve={res.data}>
				<Logs />
			</Await>
		</Suspense>
	)
}