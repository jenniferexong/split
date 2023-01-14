import { createClient } from 'urql';

export const splitClient = createClient({
  url: 'http://localhost:5133/query',
  fetchOptions: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});
