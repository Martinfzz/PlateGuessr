import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeContext } from '../../Theme';
import { API, loadingTypes } from '../../shared/helpers';
import Index from '../index'; // Assurez-vous que le chemin est correct

jest.mock('../../shared/helpers', () => ({
  ...jest.requireActual('../../shared/helpers'),
  API: {
    get: jest.fn(),
  },
}));
jest.mock('../../shared/components', () => ({
  CustomSpinner: () => <div>Loading...</div>,
}));

i18n.init({
  lng: 'en',
  resources: {
    en: {
      translation: {
        'Loading...': 'Loading...',
      },
    },
  },
});

describe('Index Component', () => {
  const mockData = {
    _id: '1',
    email: 'test@example.com',
    password: 'password123',
    scores: [
      {
        game_mode_id: '1',
        best_score: 100,
        games_played: 10,
        average_score: 50,
      },
    ],
  };

  beforeEach(() => {
    (API.get as jest.Mock).mockResolvedValue({
      data: {
        data: mockData,
      },
    });
  });

  test('renders Index component and fetches data', async () => {
    render(
      <I18nextProvider i18n={i18n}>
        <Router>
          <ThemeContext.Provider value={{ theme: 'light', toggleTheme: jest.fn() }}>
            <Index />
          </ThemeContext.Provider>
        </Router>
      </I18nextProvider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith('/api/user/country/1?token=testtoken');
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    (API.get as jest.Mock).mockRejectedValue({ status: 404 });

    render(
      <I18nextProvider i18n={i18n}>
        <Router>
          <ThemeContext.Provider value={{ theme: 'light', toggleTheme: jest.fn() }}>
            <Index />
          </ThemeContext.Provider>
        </Router>
      </I18nextProvider>
    );

    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith('/api/user/country/1?token=testtoken');
      expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
    });
  });
});