import { toast } from 'react-toastify';
import { CombinedError } from 'urql';

export const showApiError = (title: string, error: CombinedError) => {
  // TODO handle network errors too?
  toast.error(`${title}: ${error.graphQLErrors}`, {
    theme: 'light',
  });
};

export const showError = (message: string) => {
  toast.error(message, {
    theme: 'light',
  });
};
