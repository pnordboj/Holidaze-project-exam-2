import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders the App component with the home page', () => {
	render(
		<MemoryRouter>
			<App />
		</MemoryRouter>
	);

	expect(screen.getByRole('banner')).toBeInTheDocument();
	expect(screen.getByRole('contentinfo')).toBeInTheDocument();
});

test('renders the App component with the login page', () => {
	render(
		<MemoryRouter initialEntries={['/login']}>
			<App />
		</MemoryRouter>
	);

	expect(screen.getByText('Login Page')).toBeInTheDocument();

	expect(screen.getByRole('banner')).toBeInTheDocument();
	expect(screen.getByRole('contentinfo')).toBeInTheDocument();
});

