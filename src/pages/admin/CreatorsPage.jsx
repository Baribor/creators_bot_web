
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Suspense, useEffect, useState } from 'react';
import { Await, Navigate, useAsyncValue, useLoaderData } from 'react-router-dom';
import Loader from '../../components/Loader';
import { ADMIN_KEY } from '../../lib/constants';
import ConfirmAccountDeletion from '../../components/dialog/ConfirmAccountDeletionDialog';
import VerifiedIcon from '@mui/icons-material/Verified';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { creators } from '../../states';


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




const columns = [
	{ id: 'id', label: 'ID', minWidth: 100 },
	{ id: 'username', label: 'Username', minWidth: 90, format: (value, id) => <a className='text-blue-600 font-bold underline' href={`tg://user?id=${id}`}>{value}</a> },
	{ id: 'name', label: 'Name', minWidth: 90 },
	{
		id: 'email',
		label: 'Email',
		minWidth: 80,
	},
	{
		id: 'phone',
		label: 'Phone',
		minWidth: 80,
	},
	{
		id: 'verified',
		label: "Verified",
		format: (value) => value ? <VerifiedIcon color='success' /> : <NoAccountsIcon color='error' />,
		align: 'left',
	},
	{
		id: 'contents',
		label: 'Total contents',
		minWidth: 90,
		align: 'left',
		format: (value) => value.toLocaleString('en-US'),
	},
	{
		id: 'views',
		label: <div>Total Views <Tooltip title="Total views made on contents">
			<InfoIcon color='info' fontSize='small' />
		</Tooltip></div>,
		minWidth: 90,
		align: 'left',
		format: (value) => value.toLocaleString('en-US'),
	},
	{
		id: 'joined',
		label: 'Joined At',
		minWidth: 90,
		align: 'left',
		format: (value) => new Date(value).toLocaleDateString('en-US'),
	},
	{ id: 'action', label: 'Action', minWidth: 60 },
];


const bannedColumns = [
	{ id: 'id', label: 'ID', minWidth: 100 },
	{ id: 'username', label: 'Username', minWidth: 90, format: (value, id) => <a className='text-blue-600 font-bold underline' href={`tg://user?id=${id}`}>{value}</a> },
	{
		id: 'contents',
		label: 'Total contents',
		minWidth: 90,
		align: 'left',
		format: (value) => value.toLocaleString('en-US'),
	},
	{
		id: 'views',
		label: <div>Total Views <Tooltip title="Total views made on contents">
			<InfoIcon color='info' fontSize='small' />
		</Tooltip></div>,
		minWidth: 90,
		align: 'center',
		format: (value) => value.toLocaleString('en-US'),
	},
	{
		id: 'joined',
		label: 'Joined At',
		minWidth: 90,
		align: 'left',
		format: (value) => new Date(value).toLocaleDateString('en-US'),
	},
	{
		id: 'bannedAt',
		label: 'Banned At',
		minWidth: 90,
		align: 'left',
		format: (value) => new Date(value).toLocaleString('en-US'),
	},
	{ id: 'action', label: 'Action', minWidth: 60 },
];



function ActiveCreators() {
	const [page, setPage] = useState(0);
	const [dialog, setDialog] = useState();
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [c, setCreators] = useRecoilState(creators);
	const _creators = c.filter((cr) => !cr.isBanned);

	const handleCreatorBanned = (account) => {
		if (account) {
			setCreators(c.map(c => c.id === account.id ? account : c));
		}

		setDialog(false);
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
						{_creators.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row) => {
								return (
									<TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
										{columns.map((column) => {
											const value = row[column.id];
											return column.id === "action" ?
												(
													<TableCell key={column.id}>
														<span className='bg-red-600 text-white rounded-full px-2 py-1 cursor-pointer' onClick={() => setDialog(row)}>Ban</span>

													</TableCell>
												)
												: (
													<TableCell key={column.id} align={column.align}>
														{column.format
															? column.format(value, row.id)
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
				count={_creators.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={(evt, page) => setPage(page)}
				onRowsPerPageChange={(evt) => setRowsPerPage(evt.target.value)}
			/>

			{
				dialog && <ConfirmAccountDeletion account={dialog} handleClose={handleCreatorBanned} type="ban" title="Ban Creator">
					<p>Are you sure you want to ban this creator? <br />Creator won&apos;t be able to use create content until unbanned.</p>
				</ConfirmAccountDeletion>
			}
		</Paper>
	);
}


function BannedCreators() {
	const [page, setPage] = useState(0);
	const [dialog, setDialog] = useState();
	const [rowsPerPage, setRowsPerPage] = useState(25);
	const [c, setCreators] = useRecoilState(creators);
	const _creators = c.filter((cr) => cr.isBanned);

	const handleCreatorRemoved = (account) => {
		if (account) {
			setCreators(c.filter(c => c.id !== account.id));
		}

		setDialog(false);
	}

	const handleCreatorUnbanned = (account) => {
		if (account) {
			setCreators(c.map(c => c.id === account.id ? account : c));
		}

		setDialog(false);
	}

	return (
		<Paper sx={{ width: '100%', overflow: 'hidden' }}>
			<TableContainer sx={{ maxHeight: 440 }}>
				<Table stickyHeader aria-label="sticky table">
					<TableHead>
						<TableRow>
							{bannedColumns.map((column) => (
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
						{_creators.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row) => {
								return (
									<TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
										{bannedColumns.map((column) => {
											const value = row[column.id];
											return column.id === "action" ?
												(
													<TableCell key={column.id}>
														<span className='bg-red-600 mr-2 text-white rounded-full px-2 py-1 cursor-pointer' onClick={() => setDialog({
															account: row,
															title: "Delete creator",
															type: 'creator',
															onClose: handleCreatorRemoved
														})}>Delete</span>

														<span className='bg-blue-600 text-white rounded-full px-2 py-1 cursor-pointer' onClick={() => setDialog({
															account: row,
															title: "Unban creator",
															type: 'unban',
															onClose: handleCreatorUnbanned
														})}>Unban</span>

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
				rowsPerPageOptions={[25, 50, 100]}
				component="div"
				count={_creators.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={(evt, page) => setPage(page)}
				onRowsPerPageChange={(evt) => setRowsPerPage(evt.target.value)}
			/>

			{
				dialog && <ConfirmAccountDeletion account={dialog.account} handleClose={dialog.onClose} type={dialog.type} title={dialog.title}>
					{
						dialog.type === "creator" ? (
							<p>
								This action is unrecoverable. <br />
								All generated data belonging to this account will be lost.
							</p>
						) :
							(
								<p>
									Are you sure you want to unban this creator. <br />
									Creator will be able to create contents again.
								</p>
							)
					}
				</ConfirmAccountDeletion>
			}
		</Paper>
	);
}

export function CreatorsPage() {
	const rows = useAsyncValue();
	const [value, setValue] = useState(0);
	const setCreators = useSetRecoilState(creators);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	useEffect(() => {
		if (!rows?.message) {
			setCreators(rows);
		}
	}, [])

	if (rows?.message === "invalid token") {
		localStorage.removeItem(ADMIN_KEY)
		return <Navigate to={"/auth/admin/login"} replace={true} />
	}

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
					<Tab label="Active" {...a11yProps(0)} />
					<Tab label="Banned" {...a11yProps(1)} />
				</Tabs>
			</Box>


			<TabPanel value={value} index={0} ><ActiveCreators /></TabPanel>
			<TabPanel value={value} index={1} ><BannedCreators /></TabPanel>
		</Box>
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