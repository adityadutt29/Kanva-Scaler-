import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ErrorPage = () => {
  return (
    <>
      <Box sx={{ display: 'flex', marginTop: '100px' }}>
        <Box component="img" src="/error/access_denied.svg" alt="access denied" />
      </Box>
      <Typography sx={{ fontSize: 20, fontWeight: 'bold' }}>Access Denied</Typography>
    </>
  );
};

export default ErrorPage;
