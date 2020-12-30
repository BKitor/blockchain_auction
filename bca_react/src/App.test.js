import React from 'react';
import { render, act, screen, waitFor, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import App from './App';
import Error404 from './components/Error404.js'
import Signin from './components/Signin.js';
import NavBar from './components/global/NavBar.js'
import { BrowserRouter as Router } from "react-router-dom";
import { server } from './mockServer.js'


beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Unit tests', () => {
  test('Error404 Component', () => {
    const { getByText } = render(<Error404 type={'User'} identifier={'Tester'}></Error404>)
    const linkElement = getByText(/User Tester/i)
    expect(linkElement).toBeInTheDocument();
  });

  test('The Sign in Page', async () => {

    render(<Signin />);

    userEvent.click(screen.getByText(/^Sign In$/i))

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i))
      expect(screen.getByText(/^Sign In!$/i))
    })

    userEvent.type(screen.getByPlaceholderText(/username/i), 'admin');
    userEvent.type(screen.getByPlaceholderText(/password/i), 'Passw0rd');

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/username/i)).toHaveValue('admin')
      expect(screen.getByPlaceholderText(/password/i)).toHaveValue('Passw0rd')
    })

  });

  test('The Nav Bar', () => {
    const { getByText } = render(<Router><NavBar /></Router>);
    const linkElement = getByText(/BlockChain Auctions/i);
    const profileButtonElement = getByText(/^Profile$/i);

    expect(linkElement).toBeInTheDocument();
    expect(profileButtonElement).toBeInTheDocument();
  })

  test('The App', () => {
    const { getByText } = render(<App />);
    const pageTitleElement = getByText(/Live Auctions/i);

    expect(pageTitleElement).toBeInTheDocument();
  });
})
