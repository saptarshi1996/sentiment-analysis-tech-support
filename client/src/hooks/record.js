import { useQuery } from 'react-query';

import axios from '../utils/axios';

export const useSearchRecordQuery = params => {
  const {
    limit,
    page,
    export_id,
    sentiment,
  } = params;

  const searchRecord = useQuery(['recordData', params], async () => {
    try {
      let url = '/record';
      url += `?limit=${limit}`;

      if (page) {
        url += `&page=${page}`;
      }

      if (export_id) {
        url += `&export_id=${export_id}`;
      }

      if (sentiment) {
        url += `&sentiment=${sentiment}`;
      }

      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      return err.response || err.message || 'Error';
    }
  });

  return searchRecord;
}

export const useSentimentCountQuery = params => {
  const { export_id } = params;

  const sentimentCount = useQuery(['sentimentCount', params], async () => {
    try {
      let url = '/record/sentiment';

      if (export_id) {
        url += `?export_id=${export_id}`;
      }

      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      return err.response || err.message || 'Error';
    }
  });

  return sentimentCount;
}
