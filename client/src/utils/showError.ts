import { toast } from 'react-toastify';
import { CombinedError } from 'urql';

export const showError = (title: string, error: CombinedError) => {
  console.log('show error', JSON.stringify(error));

  // TODO handle network errors too?
  toast.error(`${title}: ${error.graphQLErrors}`, {
    theme: 'light',
  });
};
