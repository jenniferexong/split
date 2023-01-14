import { toast, ToastOptions } from 'react-toastify';
import { CombinedError } from 'urql';

const toastOptions: ToastOptions = {
  theme: 'dark',
};

export const showApiError = (title: string, error: CombinedError) => {
  // TODO handle network errors too?
  toast.error(`${title}: ${error.graphQLErrors}`, toastOptions);
};

export const showError = (message: string) => {
  toast.error(message, toastOptions);
};

export const showSuccess = (message: string) => {
  toast.success(message, toastOptions);
};
