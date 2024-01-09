
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ConfirmContentDeletion from '../../components/dialog/ConfirmContentDelete';
import { useRecoilState } from 'recoil';
import { verificationRequests } from '../../states';


const columns = [
	{ id: 'id', label: 'ID', minWidth: 100 },
	{ id: 'username', label: 'Username', minWidth: 170 },
	{
		id: 'firstName',
		label: 'First Name',
		minWidth: 170,
		align: 'left',
	},
	{
		id: 'lastName',
		label: 'Last Name',
		minWidth: 170,
		align: 'left',

	},
	{ id: 'action', label: 'Action', minWidth: 40 },
];


export default function VerificationPage() {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const navigate = useNavigate();
	const [rows, setRows] = useRecoilState(verificationRequests);
	const [dialog, setDialog] = useState(false);

	const handleContentDeleted = (id) => {
		if (id) {
			setRows(rows.filter((r) => r.id !== id))
		}

		setDialog(false)
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
																navigate(`/admin/verification/detail`, {
																	state: { request: row }
																})
															}}>View</span>

														</div>
													</TableCell>
												)
												:
												(
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
				rowsPerPageOptions={[10, 25, 50, 100]}
				component="div"
				count={rows.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={(evt) => setPage(evt.target.value)}
				onRowsPerPageChange={(evt) => setRowsPerPage(evt.target.value)}
			/>

			{
				dialog && <ConfirmContentDeletion contentId={dialog} handleClose={handleContentDeleted} />
			}
		</Paper>
	);
}
