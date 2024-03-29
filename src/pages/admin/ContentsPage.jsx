
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
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';


const columns = [
	{ id: 'id', label: 'ID', minWidth: 100 },
	{ id: 'creator', label: 'Creator', minWidth: 120 },
	{
		id: 'createdAt', label: 'Created At', minWidth: 90,
		align: 'left',
		format: (value) => new Date(value).toLocaleDateString('en-US'),
	},
	{
		id: 'views',
		label: 'Views',
		minWidth: 60,
		align: 'center',
		format: (value) => value.toLocaleString('en-US'),
	},
	{
		id: 'images',
		label: 'Images',
		minWidth: 50,
		align: 'center',
		format: (value) => value.toLocaleString('en-US'),
	},
	{
		id: 'files',
		label: 'Files',
		minWidth: 50,
		align: 'center',
		format: (value) => value.toLocaleString('en-US'),
	},
	{ id: 'videos', label: 'Videos', minWidth: 50, align: 'center', },
	{ id: 'audios', label: 'Audios', minWidth: 50, align: 'center', },
	{ id: 'hasPreview', label: 'Has Preview', minWidth: 50, align: 'center', format: (value) => value ? <CheckIcon color='success' /> : <ClearIcon color='error' /> },
	{ id: 'action', label: 'Action', minWidth: 40 },
];


export function ContentsPage() {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const navigate = useNavigate();
	const _rows = useAsyncValue();
	const [rows, setRows] = useState(_rows.contents);
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
				dialog && <ConfirmContentDeletion contentId={dialog} handleClose={handleContentDeleted} />
			}
		</Paper>
	);
}


export default function ContentsStatPage() {
	const res = useLoaderData();

	return (
		<Suspense fallback={<Loader />}>
			<Await resolve={res.data}>
				<ContentsPage />
			</Await>
		</Suspense>
	)
}