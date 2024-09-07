// SentimentChart.jsx
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { useLocation } from 'react-router-dom';
import { Container, Box, Typography, Paper, CircularProgress } from '@mui/material';

import { useSentimentCountMutation } from '../hooks/record';
import Navbar from '../components/Navbar';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Visualize = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const exportID = queryParams.get('export_id');

  const [sentiments, setSentiments] = useState({});
  const [summary, setSummary] = useState('');

  const [loading, setLoading] = useState(true);

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
        <Typography variant="h4" align="center" gutterBottom>
          Sentiment Analysis
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
              <CircularProgress />
            </Box>
          ) : (
            <Box height="300px"> {/* Adjust the chart size */}
              <Bar data={chartData} options={chartOptions} />
            </Box>
          )}
          <Box mt={3} textAlign="center"> {/* Summary section */}
            <Typography variant="h6">Summary</Typography>
            <Typography>{summary}</Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Visualize;
