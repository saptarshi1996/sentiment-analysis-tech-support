import {
  useMutation,
} from 'react-query';

import axios from '../utils/axios';

export const useSearchRecordMutation = () => {
  const searchRecordMutation = useMutation(async ({
    limit,
    page,
    export_id,
    sentiment,
  }) => {
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

  })

  return searchRecordMutation
}

export const useSentimentCountMutation = () => {
  const sentimentCountMutation = useMutation(async ({ export_id }) => {
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

  return sentimentCountMutation
} 
