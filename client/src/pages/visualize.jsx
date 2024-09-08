import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  CircularProgress,
  ButtonGroup,
  IconButton
} from '@mui/material';
import { BarChart, PieChart } from '@mui/icons-material';

import { useSentimentCountQuery } from '../hooks/record';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
);

const Visualize = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const exportID = queryParams.get('export_id');

  const [chartType, setChartType] = useState('bar');

  const {
    data,
    isLoading,
    refetch,
  } = useSentimentCountQuery({ export_id: exportID });

  useEffect(() => {
    refetch();
  }, [exportID, refetch]);

  const chartData = {
    labels: ['Positive', 'Negative', 'Neutral', 'Mixed'],
    datasets: [
      {
        label: 'Sentiment Counts',
        data: [
          data?.sentiments.positive || 0,
          data?.sentiments.negative || 0,
          data?.sentiments.neutral || 0,
          data?.sentiments.mixed || 0,
        ],
        backgroundColor: ['#4caf50', '#f44336', '#2196f3', '#ff9800'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box mb={2} textAlign="center">
            <ButtonGroup variant="contained" aria-label="chart type selector">
              <IconButton
                onClick={() => setChartType('bar')}
                color={chartType === 'bar' ? 'primary' : 'default'}
              >
                <BarChart />
              </IconButton>
              <IconButton
                onClick={() => setChartType('pie')}
                color={chartType === 'pie' ? 'primary' : 'default'}
              >
                <PieChart />
              </IconButton>
            </ButtonGroup>
          </Box>
          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
              <CircularProgress />
            </Box>
          ) : (
            <Box height="300px">
              {chartType === 'bar' ? (
                <Bar data={chartData} options={chartOptions} />
              ) : (
                <Pie data={chartData} options={chartOptions} />
              )}
            </Box>
          )}
          {data?.summary && (
            <Box mt={3} textAlign="center">
              <Typography>{data?.summary}</Typography>
            </Box>
          )}
        </Paper>
      </Container>
      <Footer />
    </>
  );
};

export default Visualize;
