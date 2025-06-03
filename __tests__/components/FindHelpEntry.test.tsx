import { render, screen } from '@testing-library/react';
import FindHelpEntry from '@/components/FindHelp/FindHelpEntry';
import { LocationProvider } from '@/contexts/LocationContext';

describe('FindHelpEntry', () => {
  function renderWithContext(ui: React.ReactElement) {
    return render(<LocationProvider>{ui}</LocationProvider>);
  }

  it('renders without crashing', () => {
    renderWithContext(<FindHelpEntry />);
    expect(screen.getByText(/Find Help Near You/i)).toBeInTheDocument();
  });

  it('renders postcode input field', () => {
    renderWithContext(<FindHelpEntry />);
    expect(screen.getByLabelText(/enter your postcode/i)).toBeInTheDocument();
  });

  it('renders continue button', () => {
    renderWithContext(<FindHelpEntry />);
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
  });

  it('does not show location status initially', () => {
    renderWithContext(<FindHelpEntry />);
    expect(screen.queryByText(/Location set:/i)).not.toBeInTheDocument();
  });
});
