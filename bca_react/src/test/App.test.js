import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import App from '../App';
import Signin from './components/Signin.js';
import NavBar from '../components/global/NavBar.js'
import English from '../components/English.js'
import WithdrawSealedBid from '../components/WithdrawSB.js'
import PlaceEnglish from '../components/PlaceEnglish.js'
import PlaceSealedBid from '../components/PlaceSealedBid.js'
import { BrowserRouter as Router } from "react-router-dom";
import { server } from '../mockServer.js'
import 'jest-canvas-mock'


beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Unit tests', () => {
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

  test('Create English', () => {
    const {} = render(<Router><English /></Router>);
  })

  test('Withdraw SB', () => {
    const {} = render(<Router><WithdrawSealedBid /></Router>);
  })

})
