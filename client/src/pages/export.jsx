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
  Input
} from '@mui/material';
import { GetApp, Upload, BarChart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/Navbar';

import {
  useSearchExportMutation,
  useExportCSVMutation,
  useUploadCSVMutation,
} from '../hooks/export';

const ITEMS_PER_PAGE = 8;

const Export = () => {
  const [exports, setExports] = useState([]);
  const [search, setSearch] = useState('');
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [file, setFile] = useState(null);

  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    has_next: false,
    has_prev: false,
    prev_page: 0,
    next_page: 0,
    page: 0,
    total: 0,
  });

  const searchExportMutation = useSearchExportMutation();
  const exportCSVMutation = useExportCSVMutation();
  const uploadCSVMutation = useUploadCSVMutation();

  useEffect(() => {
    fetchData({ page_number: 1 });
  }, []);

  const fetchData = async ({ page_number, file_name }) => {
    setPaginationLoading(true);
    const response = await searchExportMutation.mutateAsync({
      limit: ITEMS_PER_PAGE,
      page: page_number,
      file_name
    });
    const { exports, page } = response;

    setPagination({ ...page });
    setExports(exports);
    setPaginationLoading(false);
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
    fetchData({ file_name: event.target.value });
  };

  const handleNext = async () => {
    if (pagination.next_page)
      await fetchData({
        page_number: pagination.next_page,
        file_name: search,
      });
  };

  const handlePrev = async () => {
    if (pagination.prev_page)
      await fetchData({
        page_number: pagination.prev_page,
        file_name: search,
      });
  };

  const handleExport = async (id) => {
    const response = await exportCSVMutation.mutateAsync({
      export_id: id
    });

    if (!response) {
      return;
    }

    // Create a Blob from the CSV content and generate a download link
    const blob = new Blob([response], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');

    if (link.download !== undefined) {
      // Create a URL for the Blob and set it as the href attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `sentiment_analysis_${id}.csv`);

      // Append the link to the document and trigger a click event
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    setPaginationLoading(true);
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        await uploadCSVMutation.mutateAsync(formData);
      } catch (error) {
        console.log(error);
      }

      await fetchData({});
    }
    setPaginationLoading(false);
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
          />
          <Box display="flex" alignItems="center" gap={2}>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              sx={{ display: 'none' }} // Hide the default input
              id="upload-csv"
            />
            <label htmlFor="upload-csv">
              <Button
                variant="contained"
                color="secondary"
                component="span"
                startIcon={<Upload />}
              >
                Select CSV
              </Button>
            </label>
            <Button
              variant="contained"
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
              disabled={!pagination.has_prev || paginationLoading}
              sx={{ ml: 2 }}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={!pagination.has_next || paginationLoading}
            // sx={{ ml: 1 }}
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
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>File ID</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Record Count</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Processed Count</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exports.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              ) :
                (exports.map((exportItem) => (
                  <TableRow key={exportItem?.id}>
                    <TableCell align="center">{exportItem?.id}</TableCell>
                    <TableCell
                      align="center"
                      sx={{ cursor: 'pointer', color: 'primary.main' }} // Add cursor style and color
                      onClick={() => handleRowClick(exportItem.id)}
                    >
                      {exportItem.file_name}
                    </TableCell>
                    <TableCell align="center">{exportItem?.file_id || ''}</TableCell>
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
                          <BarChart /> {/* Replace this with another icon if needed */}
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
    </>
  );
};

export default Export;
