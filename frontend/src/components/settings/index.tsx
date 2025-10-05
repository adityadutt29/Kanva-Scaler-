import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { MdPerson, MdSecurity, MdNotifications, MdPalette, MdEdit } from 'react-icons/md';
import { useAppSelector } from '@/hooks';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const Settings = (): JSX.Element => {
  const user = useAppSelector((state) => state.user);
  const [currentTab, setCurrentTab] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [profileData, setProfileData] = useState({
    fullName: user.fullName || '',
    email: user.email || '',
    bio: 'Product manager passionate about building great user experiences.',
    location: 'San Francisco, CA'
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    boardUpdates: true,
    marketingEmails: false,
    darkMode: false,
    compactView: false
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleProfileChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [field]: event.target.value });
  };

  const handlePreferenceChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setPreferences({ ...preferences, [field]: event.target.checked });
  };

  const handleSaveProfile = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <Box sx={{ minHeight: '50vh', flexGrow: 3, mx: '2%', p: '2rem' }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage your account settings and preferences
      </Typography>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSaveSuccess(false)}>
          Settings saved successfully!
        </Alert>
      )}

      <Card elevation={2}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab icon={<MdPerson />} iconPosition="start" label="Profile" />
            <Tab icon={<MdSecurity />} iconPosition="start" label="Security" />
            <Tab icon={<MdNotifications />} iconPosition="start" label="Notifications" />
            <Tab icon={<MdPalette />} iconPosition="start" label="Appearance" />
          </Tabs>
        </Box>

        <TabPanel value={currentTab} index={0}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
              <Avatar sx={{ width: 100, height: 100, bgcolor: '#0079BF', fontSize: 40 }}>
                {profileData.fullName.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Profile Picture
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Update your profile photo
                </Typography>
                <Button variant="outlined" startIcon={<MdEdit />} size="small">
                  Change Photo
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profileData.fullName}
                  onChange={handleProfileChange('fullName')}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange('email')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  multiline
                  rows={3}
                  value={profileData.bio}
                  onChange={handleProfileChange('bio')}
                  helperText="Brief description for your profile"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location"
                  value={profileData.location}
                  onChange={handleProfileChange('location')}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button variant="contained" onClick={handleSaveProfile}>
                Save Changes
              </Button>
              <Button variant="outlined">
                Cancel
              </Button>
            </Box>
          </CardContent>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Password
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Update your password to keep your account secure
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 3 }}>
              <Button variant="contained">
                Update Password
              </Button>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight={600} gutterBottom>
              Two-Factor Authentication
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add an extra layer of security to your account
            </Typography>
            <Button variant="outlined">
              Enable 2FA
            </Button>
          </CardContent>
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Email Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Choose what updates you want to receive
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.emailNotifications}
                    onChange={handlePreferenceChange('emailNotifications')}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Email Notifications
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Receive email about your account activity
                    </Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.boardUpdates}
                    onChange={handlePreferenceChange('boardUpdates')}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Board Updates
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Get notified when someone updates a board you're watching
                    </Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.marketingEmails}
                    onChange={handlePreferenceChange('marketingEmails')}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Marketing Emails
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Receive emails about new features and updates
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button variant="contained" onClick={handleSaveProfile}>
                Save Preferences
              </Button>
            </Box>
          </CardContent>
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Display Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Customize how the application looks for you
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.darkMode}
                    onChange={handlePreferenceChange('darkMode')}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Dark Mode
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Switch to dark theme for better viewing in low light
                    </Typography>
                  </Box>
                }
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.compactView}
                    onChange={handlePreferenceChange('compactView')}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={500}>
                      Compact View
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Display more content by reducing spacing
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Box sx={{ mt: 3 }}>
              <Button variant="contained" onClick={handleSaveProfile}>
                Save Preferences
              </Button>
            </Box>
          </CardContent>
        </TabPanel>
      </Card>

      <Card elevation={2} sx={{ mt: 3, borderColor: 'error.main', borderWidth: 1, borderStyle: 'solid' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={600} color="error" gutterBottom>
            Danger Zone
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Irreversible actions that affect your account
          </Typography>
          <Button variant="outlined" color="error">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Settings;
