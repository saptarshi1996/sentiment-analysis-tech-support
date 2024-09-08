import { useState, useEffect } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { useLocation } from 'react-router-dom';

import Navbar from '../components/Navbar';

import {
  useSearchRecordMutation,
} from '../hooks/record';

const ITEMS_PER_PAGE = 8;

const sentiments = [
  'Positive',
  'Negative',
  'Neutral',
  'Mixed',
];

const Record = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const exportID = queryParams.get('export_id');

  const [records, setRecords] = useState([]);
  const [selectedSentiment, setSelectedSentiment] = useState('');
  const [paginationLoading, setPaginationLoading] = useState(false);

  const [pagination, setPagination] = useState({
    has_next: false,
    has_prev: false,
    prev_page: 0,
    next_page: 0,
    page: 0,
    total: 0,
  });

  const searchRecordMutation = useSearchRecordMutation();

  useEffect(() => {
    fetchData({
      page_number: 1,
      sentiment: selectedSentiment,
    });
  }, [selectedSentiment]);

  const fetchData = async ({
    sentiment,
    page_number
  }) => {
    setPaginationLoading(true);
    const response = await searchRecordMutation.mutateAsync({
      limit: ITEMS_PER_PAGE,
      page: page_number,
      sentiment,
      export_id: exportID,
    });
    const { records, page } = response;

    setPagination({ ...page });
    setRecords(records);
    setPaginationLoading(false);
  };

  const handleSentimentChange = (event) => {
    setSelectedSentiment(event.target.value);
  };

  const handleNext = async () => {
    if (pagination.next_page)
      await fetchData({
        page_number: pagination.next_page,
      });
  };

  const handlePrev = async () => {
    if (pagination.prev_page)
      await fetchData({
        page_number: pagination.prev_page,
      });
  };

  return (
    <>
      <Navbar />
      <Container>
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={2}>
          <FormControl variant="outlined" sx={{ minWidth: 200, mb: 2 }}>
            <InputLabel>Sentiment</InputLabel>
            <Select
              value={selectedSentiment}
              onChange={handleSentimentChange}
              label="Sentiment"
            ><MenuItem value="">
                <em>None</em>
              </MenuItem>
              {sentiments.map((sentiment) => (
                <MenuItem key={sentiment} value={sentiment}>
                  {sentiment}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box display="flex" alignItems="center" gap={2}>
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
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Sentiment</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Summary</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Export ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (records.map((recordItem) => (
                <TableRow key={recordItem.id}>
                  <TableCell align="center">{recordItem.id}</TableCell>
                  <TableCell align="center">{recordItem?.sentiment}</TableCell>
                  <TableCell align="center">{
                    recordItem?.sentiment === 'Neutral' || recordItem?.sentiment === 'Mixed' ?
                      '-' : recordItem?.summary}</TableCell>
                  <TableCell align="center">{recordItem?.export_id || '-'}</TableCell>
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

export default Record;
