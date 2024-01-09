import { Navigate, Outlet, useLoaderData, useNavigate } from "react-router-dom";
import NavItem from "../NavItem";
import DashboardIcon from '@mui/icons-material/Dashboard';
import EngineeringIcon from '@mui/icons-material/Engineering';
import PersonIcon from '@mui/icons-material/Person';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import { ADMIN_KEY } from "../../lib/constants";


import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import EuroIcon from '@mui/icons-material/Euro';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useState } from "react";
import { useRecoilState } from "recoil";
import { verificationRequests } from "../../states";
import VerificationNavItem from "../VerificationNavItem";
import WithdrawalNavItem from "../WithdrawalNavItem";

const drawerWidth = 240;

export default function AdminLayout(props) {
	const token = useLoaderData();
	const navigate = useNavigate()
	const [requests, setRequests] = useRecoilState(verificationRequests);
	const { window } = props;
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleLogout = () => {
		localStorage.removeItem(ADMIN_KEY)
		navigate("/auth/admin/login", {
			replace: true
		})
	}

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};




	if (!token) {
		return <Navigate to="/auth/admin/login" replace={true} />;
	}

	const drawer = (
		<div>
			<Toolbar />
			<Divider />
			<div className="w-full border-r-2 select-none p-3 flex flex-col gap-1">

				<NavItem text="Dashboard" to="" handleClick={handleDrawerToggle}>
					<DashboardIcon />
				</NavItem>


				<NavItem text="Creators" to="creators" handleClick={handleDrawerToggle}>
					<EngineeringIcon />
				</NavItem>


				<NavItem text="Customers" to="customers" handleClick={handleDrawerToggle}>
					<PersonIcon />
				</NavItem>


				<NavItem text="Contents" to="contents" handleClick={handleDrawerToggle}>
					<FolderCopyIcon />
				</NavItem>


				<VerificationNavItem text="Verification" to="verification" handleClick={handleDrawerToggle}>
					<VerifiedIcon />
				</VerificationNavItem>


				<WithdrawalNavItem text="Requests" to="withdrawal_requests" handleClick={handleDrawerToggle}>
					<EuroIcon />
				</WithdrawalNavItem>

				<span className="text-red-400 text-start ml-1 p-3 hover:bg-red-200 w-fit rounded-full px-4 cursor-pointer" onClick={handleLogout}>LOGOUT</span>

			</div>
		</div>
	);

	const container = window !== undefined ? () => window().document.body : undefined;

	return (
		<Box sx={{ display: 'grid', gridTemplateColumns: { sm: `${drawerWidth}px 1fr` } }}>
			<CssBaseline />
			<AppBar
				position="fixed"
				sx={{
					width: { sm: `calc(100% - ${drawerWidth}px)` },
					ml: { sm: `${drawerWidth}px` },
					backgroundColor: "white",
					color: "black"
				}}
			>
				<Toolbar>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ mr: 2, display: { sm: 'none' } }}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" noWrap component="div" sx={{ color: "blue" }}>
						ADMINISTRATION
					</Typography>
				</Toolbar>
			</AppBar>
			<Box
				component="nav"
				sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
				aria-label="mailbox folders"
			>
				{/* The implementation can be swapped with js to avoid SEO duplication of links. */}
				<Drawer
					container={container}
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: 'block', sm: 'none' },
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
					}}
				>
					{drawer}
				</Drawer>


				<Drawer
					variant="permanent"
					sx={{
						display: { xs: 'none', sm: 'block' },
						'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
					}}
					open
				>
					{drawer}
				</Drawer>
			</Box>
			<Box
				component="main"
				sx={{ p: 3, overflowY: "scroll", height: "100vh", width: { sm: `calc(100vw - ${drawerWidth}px)` } }}
			>
				<Toolbar />
				<Outlet />
			</Box>
		</Box>
	);
}