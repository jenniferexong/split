import { toast } from 'react-toastify';

export const showError = (message: string) => {
  console.log('show error');
  toast.error(message, {
    theme: 'light',
  });
};
