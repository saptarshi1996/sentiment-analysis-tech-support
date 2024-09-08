import { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  IconButton,
  Tooltip,
  Input,
  InputAdornment,
} from '@mui/material';
import { GetApp, Upload, BarChart, Search, Clear } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import Navbar from '../components/Navbar';
import {
  useExportDataQuery,
  useExportCSVMutation,
  useUploadCSVMutation,
} from '../hooks/export';
import Footer from '../components/Footer';

const ITEMS_PER_PAGE = 5;

const Export = () => {
  // const [exports, setExports] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [file, setFile] = useState(null);
  
  const navigate = useNavigate();

  // const exportDataQuery = useExportDataQuery();
  const exportCSVMutation = useExportCSVMutation();
  const uploadCSVMutation = useUploadCSVMutation();

  const {
    data,
    isLoading,
    refetch,
  } = useExportDataQuery({ page: page, file_name: search, limit: ITEMS_PER_PAGE }, {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    console.log(page);
    refetch();
  }, [page, search, refetch]);

  useEffect(() => {

    let socket;

    const connectWebSocket = () => {
      const socket = new WebSocket(`${import.meta.env.VITE_SOCKET_URL}ws`);
      socket.onopen = () => console.log('WebSocket connected');
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message?.trigger === 'REFETCH') {
          refetch();
        }

        if (message?.trigger === 'NOTIFICATION') {
          toast.info(message?.message || '');
        }
      };
      socket.onclose = () => {
        console.log('Socket disconnected');
        setTimeout(connectWebSocket, 1000);
      };

      return () => {
        socket.close();
      };
    };

    connectWebSocket();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [refetch]);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleClearSearch = () => {
    setSearch('');
  };

  const handleNext = async () => {
    setPage(data?.page?.next_page);
  };

  const handlePrev = async () => {
    setPage(data?.page?.prev_page);
  };

  const handleExport = async (id) => {
    const response = await exportCSVMutation.mutateAsync({
      export_id: id,
    });

    if (!response) {
      return;
    }

    const blob = new Blob([response], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `sentiment_analysis_${id}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await uploadCSVMutation.mutateAsync(formData);
      } catch (error) {
        console.log(error);
      }

      await refetch();
    }
    setFile(null);
  };

  const handleRowClick = (id) => {
    navigate(`/record?export_id=${id}`);
  };

  return (
    <>
      <Navbar />
      <Container>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
          <TextField
            label="Search by File Name"
            variant="outlined"
            value={search}
            onChange={handleSearch}
            sx={{ flexGrow: 1, mr: 2 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton onClick={handleClearSearch}>
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box display="flex" alignItems="center" gap={2}>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              sx={{ display: 'none' }}
              id="upload-csv"
            />
            <label htmlFor="upload-csv">
              <Button
                variant="outlined"
                color="primary"
                component="span"
                startIcon={<Upload />}
              >
                Select CSV
              </Button>
            </label>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleUpload}
              disabled={!file}
            >
              Upload
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handlePrev}
              disabled={!data?.page?.has_prev || isLoading}
              sx={{ ml: 2 }}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={!data?.page?.has_next || isLoading}
            >
              Next
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>File Name</TableCell>
                {/* <TableCell align="center" sx={{ fontWeight: 'bold' }}>File ID</TableCell> */}
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Total</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Processed</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!data || data?.exports?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (
                data?.exports?.map((exportItem) => (
                  <TableRow key={exportItem?.id}>
                    <TableCell align="center">{exportItem?.id}</TableCell>
                    <TableCell
                      align="center"
                      sx={{ cursor: 'pointer', color: 'primary.main', fontWeight: 'bold' }}
                      onClick={() => handleRowClick(exportItem.id)}
                    >
                      {exportItem.file_name}
                    </TableCell>
                    {/* <TableCell align="center">{exportItem?.file_id || ''}</TableCell> */}
                    <TableCell align="center">{exportItem?.record_count || ''}</TableCell>
                    <TableCell align="center">{exportItem?.processed_count || '0'}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="Export">
                        <IconButton
                          color="primary"
                          onClick={() => handleExport(exportItem?.id)}
                        >
                          <GetApp />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Visualize">
                        <IconButton
                          color="secondary"
                          onClick={() => navigate(`/visualize?export_id=${exportItem?.id}`)}
                        >
                          <BarChart />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
      <Footer />
    </>
  );
};

export default Export;
