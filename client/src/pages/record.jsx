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
import Footer from '../components/Footer';

import { useSearchRecordQuery } from '../hooks/record';

const ITEMS_PER_PAGE = 5;

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

  const [page, setPage] = useState(1);
  const [selectedSentiment, setSelectedSentiment] = useState('');

  const {
    data,
    isLoading,
    refetch,
  } = useSearchRecordQuery({
    limit: ITEMS_PER_PAGE,
    page: page,
    export_id: exportID,
    sentiment: selectedSentiment,
    }, {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [page, selectedSentiment, refetch]);

  const handleSentimentChange = (event) => {
    setSelectedSentiment(event.target.value);
  };

  const handleNext = async () => {
    setPage(data?.page?.next_page);
  };

  const handlePrev = async () => {
    setPage(data?.page?.prev_page);
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
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Sentiment</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Summary</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Export ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.records?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No records found
                  </TableCell>
                </TableRow>
              ) : (data?.records?.map((recordItem) => (
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
      <Footer />
    </>
  );
};

export default Record;
