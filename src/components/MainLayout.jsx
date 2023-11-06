import Avatar from "@mui/material/Avatar";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import SettingsIcon from '@mui/icons-material/Settings';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import NavItem from "./NavItem";
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import SettingsInputAntennaIcon from '@mui/icons-material/SettingsInputAntenna';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { user } from "../states";
import { USER_KEY } from "../lib/constsnts";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';


const drawerWidth = 240;

export default function MainLayout(props) {
	const u = useLoaderData()
	const navigate = useNavigate()
	const [currentUser, setUser] = useRecoilState(user)
	const { window } = props;
	const [mobileOpen, setMobileOpen] = useState(false);


	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};


	useEffect(() => {
		setUser(u)
	}, [])

	const handleLogout = () => {
		localStorage.removeItem(USER_KEY)
		navigate("/login", {
			replace: true
		})
	}

	const drawer = (
		<div>
			<Toolbar />
			<div className="w-full border-r-2 select-none p-3 flex flex-col gap-1">

				<div className="border-2 rounded-full overflow-hidden flex items-center w-fit">
					<span className="mr-2 px-3 font-bold">Balance</span>
					<span>€ {currentUser.wallet?.balance}</span>
					<IconButton>
						<KeyboardArrowDownIcon />
					</IconButton>

				</div>

				<NavItem text="Dashboard" to="" handleClick={handleDrawerToggle}>
					<EqualizerIcon />
				</NavItem>


				<NavItem text="Publish Content" to="create" handleClick={handleDrawerToggle}>
					<SettingsInputAntennaIcon />
				</NavItem>

				<NavItem text="My Contents" to="contents" handleClick={handleDrawerToggle}>
					<FolderCopyIcon />
				</NavItem>

				<NavItem text="Settings" to="settings" handleClick={handleDrawerToggle}>
					<SettingsIcon />
				</NavItem>


				<span className="text-red-400 text-start ml-1 p-3 hover:bg-red-200 w-fit rounded-full px-4 cursor-pointer" onClick={handleLogout}>LOGOUT</span>

			</div>
		</div>
	);

	const container = window !== undefined ? () => window().document.body : undefined;

	if (!u) {
		return null
	}
	return (
		<>
			<Box sx={{ display: 'flex' }}>
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
						<div className="flex gap-5">

							{/* Avatar */}
							<div className="flex items-center justify-end gap-2">
								<Avatar alt="user profile image" src={currentUser.profile?.profilePic} variant="circular" />
								<p className="font-bold text-sm">{currentUser.profile?.username}</p>
							</div>
						</div>
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
					sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
				>

					<Toolbar />
					<Outlet />
				</Box>
			</Box>
		</>
	)
}