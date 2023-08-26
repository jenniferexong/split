import { toast, ToastOptions } from 'react-toastify';
import { CombinedError } from 'urql';

const toastOptions: ToastOptions = {
  theme: 'dark',
};

export const showApiError = (title: string, error: CombinedError) => {
  // TODO handle network errors too?
  toast.error(`${title}: ${error.graphQLErrors}`, toastOptions);
};

export const showError = (message: string, id: string) => {
  toast.error(message, { ...toastOptions, toastId: id });
};

export const showSuccess = (message: string, id: string) => {
  toast.success(message, { ...toastOptions, toastId: id });
};

export const showInfo = (message: string, id: string) => {
  toast.info(message, { ...toastOptions, toastId: id });
};
