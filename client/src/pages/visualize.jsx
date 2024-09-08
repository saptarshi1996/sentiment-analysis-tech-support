import { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import { useLocation } from 'react-router-dom';
import { Container, Box, Typography, Paper, CircularProgress, ButtonGroup, Button } from '@mui/material';

import { useSentimentCountMutation } from '../hooks/record';
import Navbar from '../components/Navbar';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const Visualize = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const exportID = queryParams.get('export_id');

  const [sentiments, setSentiments] = useState({});
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState('bar');

  const sentimentCountMutation = useSentimentCountMutation();

  useEffect(() => {
    fetchSentiments();
  }, []);

  const fetchSentiments = async () => {
    try {
      const response = await sentimentCountMutation.mutateAsync({
        export_id: exportID,
      });
      setSentiments({ ...response.sentiments });
      setSummary(response.summary);
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = {
    labels: ['Positive', 'Negative', 'Neutral', 'Mixed'],
    datasets: [
      {
        label: 'Sentiment Counts',
        data: [
          sentiments.positive || 0,
          sentiments.negative || 0,
          sentiments.neutral || 0,
          sentiments.mixed || 0,
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
              <Button onClick={() => setChartType('bar')} color={chartType === 'bar' ? 'primary' : 'default'}>
                Bar Chart
              </Button>
              <Button onClick={() => setChartType('pie')} color={chartType === 'pie' ? 'primary' : 'default'}>
                Pie Chart
              </Button>
            </ButtonGroup>
          </Box>
          {loading ? (
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
          {summary && (
            <Box mt={3} textAlign="center">
              <Typography variant="h6">Summary</Typography>
              <Typography>{summary}</Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default Visualize;
