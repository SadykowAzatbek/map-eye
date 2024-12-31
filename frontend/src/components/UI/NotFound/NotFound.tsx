import { Box, Button, Link, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Stack mb={4}>
        <Typography variant="h1">404</Typography>
        <Typography variant="subtitle1">Страница не найдена</Typography>
      </Stack>
      <Button
        component={Link}
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ textTransform: 'none', fontWeight: 'normal' }}
      >
        Назад
      </Button>
    </Box>
  );
};

export default NotFound;
