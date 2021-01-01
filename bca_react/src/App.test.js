import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
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

  test('User Sign Up', async () => {
    render(<Signin />);

    userEvent.click(screen.getByText(/^Sign Up$/i))
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Wallet/i)).toBeInTheDocument();
    })
    userEvent.type(screen.getByPlaceholderText(/Username/i), 'reqw')
    userEvent.type(screen.getByPlaceholderText(/Password/i), 'reqw')
    userEvent.type(screen.getByPlaceholderText(/Wallet/i), 'reqw')
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Username/i)).toHaveValue('reqw');
      expect(screen.getByPlaceholderText(/Password/i)).toHaveValue('reqw');
      expect(screen.getByPlaceholderText(/Wallet/i)).toHaveValue('reqw');
    })
    // userEvent.click(screen.getByText(/Sign up!/i))

  })

  test('User Sign in', async () => {

    render(<Signin />);

    userEvent.click(screen.getByText(/^Sign In$/i))

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
      expect(screen.getByText(/^Sign In!$/i)).toBeInTheDocument();
    })

    userEvent.type(screen.getByPlaceholderText(/username/i), 'admin');
    userEvent.type(screen.getByPlaceholderText(/password/i), 'Passw0rd');

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/username/i)).toHaveValue('admin')
      expect(screen.getByPlaceholderText(/password/i)).toHaveValue('Passw0rd')
    })
    // userEvent.click(screen.getByText(/Sign in!/i))

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
