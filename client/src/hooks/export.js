import {
  useQuery,
  useMutation,
} from 'react-query';

import { toast } from 'react-toastify';

import axios from '../utils/axios';

export const useExportDataQuery = (params) => {
  const {
    limit,
    page,
    file_name
  } = params;

  return useQuery(['exportData', params], async () => {
    try {
      let url = '/export';

      url += `?limit=${limit}`;

      if (page) {
        url += `&page=${page}`;
      }

      if (file_name) {
        url += `&file_name=${file_name}`;
      }

      console.log(url);

      const response = await axios.get(url);
      console.log(response.data);
      return response.data;
    } catch (err) {
      return err.response || err.message || 'Error';
    }
  }, {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};

export const useExportCSVMutation = () => {
  const exportCSVMutation = useMutation(async ({
    export_id,
  }) => {
    try {
      const countURL = `export/${export_id}/count`;
      const countResponse = await axios.get(countURL);
      console.log(countResponse.data);

      toast.info(countResponse.data.message);

      const exportURL = `export/${export_id}/csv`;
      const exportResponse = await axios.get(exportURL);
      console.log(exportResponse);
      return exportResponse?.data;
    } catch (err) {
      return err.response || err.message || 'Error';
    }
  })

  return exportCSVMutation
}

export const useUploadCSVMutation = () => {
  const uploadCSV = useMutation(async (formData) => {
    try {
      const response = await axios.post('/export', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const { message } = response.data; // Handle the response as needed
      if (message) {
        toast.success(message);
      }
    } catch (error) {
      console.log(error);
      toast.error('File upload failed');
    }
  });

  return uploadCSV;
}
