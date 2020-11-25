import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  // const linkElement = getByText(/Home Page/i);
  const linkElement = getByText(/Live Auctions/i);
  expect(linkElement).toBeInTheDocument();
});
