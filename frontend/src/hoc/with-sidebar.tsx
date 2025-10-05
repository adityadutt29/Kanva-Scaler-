import React, { Component } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Link from 'next/link';
import {
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlineCreditCard,
  AiOutlineBuild
} from 'react-icons/ai';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import NavBar from '@/src/components/navbar';
import { loadSidebarCollapsed, saveSidebarCollapsed } from '@/src/util/sidebar-persist';

const withSidebar = (App, props) => {
  interface WithSidebarState {
    collapsed: boolean;
  }

  return class BoardWithSidebar extends Component<any, WithSidebarState> {
    constructor(props: any) {
      super(props);
      const collapsed = loadSidebarCollapsed();
      this.state = { collapsed };
    }

    toggleCollapse = () => {
      this.setState((s) => {
        const next = { collapsed: !s.collapsed };
        saveSidebarCollapsed(next.collapsed);
        return next;
      });
    };

    static async getInitialProps(ctx) {
      let appProps = {};

      if (App.getInitialProps) {
        appProps = await App.getInitialProps(ctx);
      }

      return {
        ...appProps
      };
    }

    render() {
      const { page } = props;
      const { collapsed } = this.state;

      const sidebarMenu = [
        { path: '/home', buttonName: 'Home', page: 'home', icon: AiOutlineHome },
        { path: '/boards', buttonName: 'Boards', page: 'boards', icon: AiOutlineCreditCard },
        { path: '/templates', buttonName: 'Templates', page: 'templates', icon: AiOutlineBuild },
        { path: '/settings', buttonName: 'Settings', page: 'settings', icon: AiOutlineSetting }
      ];

  const width = collapsed ? 72 : 260;

      return (
        <>
          <NavBar compact={collapsed} />
          <Box sx={{ display: 'flex', mt: 2 }}>
            <Box
              component="aside"
              sx={{
                width,
                minWidth: width,
                maxWidth: width,
                height: 'calc(100vh - 64px)',
                position: 'sticky',
                top: 72,
                ml: 2,
                boxShadow: 1,
                borderRadius: 1,
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: '#0079BF' }}>T</Avatar>
                {!collapsed && (
                  <Box>
                    <Link href="/home" legacyBehavior>
                      <a style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                        <Box component="img" src="/kanva-logo.png" alt="Kanva" sx={{ height: 28, mr: 1 }} />
                        <Box>
                          <Typography fontWeight={700}></Typography>
                          <Typography variant="caption" color="text.secondary">
                            Workspace
                          </Typography>
                        </Box>
                      </a>
                    </Link>
                  </Box>
                )}
              </Box>

              <Divider />

              <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                <List disablePadding>
                  {sidebarMenu.map((menu, index) => {
                    const Icon = menu.icon;
                    const active = menu.page === page;

                    const item = (
                      <ListItemButton
                        sx={{
                          px: collapsed ? 0 : 2,
                          py: collapsed ? 0.5 : 1.5,
                          gap: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: collapsed ? 'center' : 'flex-start',
                          ...(active && {
                            bgcolor: 'primary.main',
                            color: 'white',
                            '& svg': { color: 'white' }
                          }),
                          '&:hover': { bgcolor: active ? 'primary.dark' : 'action.hover' }
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : 36, display: 'flex', justifyContent: 'center' }}>
                          <Icon size={20} />
                        </ListItemIcon>
                        {!collapsed && <ListItemText primary={menu.buttonName} />}
                      </ListItemButton>
                    );

                    return (
                      <Link href={menu.path} key={index} legacyBehavior>
                        <a style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                          {collapsed ? (
                            <Tooltip title={menu.buttonName} placement="right">
                              {item}
                            </Tooltip>
                          ) : (
                            item
                          )}
                        </a>
                      </Link>
                    );
                  })}
                </List>
              </Box>

              <Divider />

              <Box sx={{ p: 1, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
                {!collapsed && (
                  <Typography variant="body2" color="text.secondary">
                    Help & Feedback
                  </Typography>
                )}
                <IconButton onClick={this.toggleCollapse} size="small" aria-label="Toggle sidebar">
                  {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <App {...this.props} />
            </Box>
          </Box>
        </>
      );
    }
  };
};

export default withSidebar;
