import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

import { useCallback, useEffect, useState } from "react";
import { BASE_URL, withdrawalRequests } from '../../states';
import { ADMIN_KEY } from '../../lib/constants';
import { enqueueSnackbar } from 'notistack';
import Loader from '../../components/Loader';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import CancelRequestDialog from '../../components/dialog/CancelRequestDialog';
import CompleteRequestDialog from '../../components/dialog/CompleteRequestDialog';
import { useRecoilState } from 'recoil';


const pendingColumns = [
	{ id: 'creator_id', label: 'Creator ID', minWidth: 100 },
	{ id: 'username', label: 'Username', minWidth: 80 },
	{ id: 'iban', label: 'IBAN', minWidth: 170 },
	{ id: 'amount', label: 'Amount', minWidth: 80 },
	{
		id: 'requested_at',
		label: 'Requested at',
		minWidth: 170,
		align: 'left',
		format: (value) => new Date(value).toLocaleString('en-US'),
	},
];

const columns = [
	{ id: 'creator_id', label: 'Creator ID', minWidth: 100 },
	{ id: 'username', label: 'Username', minWidth: 80 },
	{ id: 'amount', label: 'Amount', minWidth: 90 },
	{
		id: 'completed_at',
		label: 'Completed at',
		minWidth: 170,
		align: 'left',
		format: (value) => new Date(value).toLocaleString('en-US'),
	},
];


const PendingWithdrawals = () => {
	const [requests, setRequests] = useRecoilState(withdrawalRequests);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [dialog, setDialog] = useState(null)

	const handleClose = (status) => {
		if (status) {
			setRequests(requests.filter(r => r.request_id !== dialog.id))
		}
		setDialog(null)
	}

	return requests ?
		(
			<>
				<Paper sx={{ width: '100%', overflow: 'hidden' }}>
					<TableContainer sx={{ maxHeight: 440 }}>
						<Table stickyHeader aria-label="sticky table">
							<TableHead>
								<TableRow>
									{pendingColumns.map((column) => (
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
								{requests
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((row) => {

										return (
											<TableRow hover tabIndex={-1} key={row.request_id}>
												{pendingColumns.map((column) => {
													const value = row[column.id];
													return (
														<TableCell key={column.id} align={column.align}>
															{column.format
																? column.format(value)
																: value}
														</TableCell>
													);
												})}

												<div className='flex items-center mt-2 gap-3'><Button variant='contained' color='error' onClick={() => setDialog({ type: "cancel", id: row.request_id })}>Cancel</Button>
													<Button variant='contained' color='success' onClick={() => setDialog({ type: "complete", id: row.request_id })}>Complete</Button></div>
											</TableRow>
										);
									})}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination
						rowsPerPageOptions={[10, 25, 100]}
						component="div"
						count={requests.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={(evt, page) => setPage(page)}
						onRowsPerPageChange={(evt) => setRowsPerPage(evt.target.value)}
					/>
				</Paper>

				{
					dialog && dialog.type === "cancel" && <CancelRequestDialog id={dialog.id} handleClose={handleClose} />
				}
				{
					dialog && dialog.type === "complete" && <CompleteRequestDialog id={dialog.id} handleClose={handleClose} />
				}
			</>
		)
		:
		(
			<Loader />
		)
}


const CompletedWithdrawals = () => {
	const [requests, setRequests] = useState(null);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const retrieveRequests = useCallback(async () => {
		const token = localStorage.getItem(ADMIN_KEY);


		const requests = await fetch(BASE_URL + "/admin/withdrawal_requests?status=completed", {
			headers: {
				Authorization: `Bearer ${token}`
			}
		}).then(res => res.json())
			.catch(err => console.log)

		console.log(requests)
		if (requests.status) {
			setRequests(requests.requests);
		} else {
			setRequests([])
			enqueueSnackbar({
				message: "There was an error retrieving the requests", variant: "error"
			})
		}
	}, [])

	useEffect(() => {
		retrieveRequests();

	}, [])

	return requests ?
		(
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
							{requests
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row) => {
									return (
										<TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
											{columns.map((column) => {
												const value = row[column.id];
												return (
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
					rowsPerPageOptions={[10, 25, 100]}
					component="div"
					count={requests.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={(evt, page) => setPage(page)}
					onRowsPerPageChange={(evt) => setRowsPerPage(evt.target.value)}
				/>
			</Paper>
		)
		:
		(
			<Loader />
		)
}



function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};



function a11yProps(index) {
	return {
		id: `vertical-tab-${index}`,
		'aria-controls': `vertical-tabpanel-${index}`,
	};
}

export default function WithdrawalPageRoot() {
	const [value, setValue] = useState(0);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	return (
		<Box sx={{ width: '100%' }}>
			<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
				<Tabs
					value={value}
					onChange={handleChange}
					textColor="primary"
					indicatorColor="primary"
					aria-label="primary tabs example"
				>
					<Tab label="Pending" {...a11yProps(0)} />
					<Tab label="Completed" {...a11yProps(1)} />
				</Tabs>
			</Box>


			<TabPanel value={value} index={0} ><PendingWithdrawals /></TabPanel>
			<TabPanel value={value} index={1} ><CompletedWithdrawals /></TabPanel>
		</Box>
	);
}