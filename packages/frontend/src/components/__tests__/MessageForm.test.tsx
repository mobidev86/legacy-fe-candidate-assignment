import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../../test/utils';
import userEvent from '@testing-library/user-event';
import MessageForm from '../MessageForm';
import * as api from '../../services/api';

// Mock the API
vi.mock('../../services/api');

describe('MessageForm', () => {
  const mockAddToHistory = vi.fn();
  const mockPrimaryWallet = {
    address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
    signMessage: vi.fn(),
  };
  const mockUser = {
    email: 'test@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the form', async () => {
    render(
      <MessageForm
        addToHistory={mockAddToHistory}
        user={mockUser}
        primaryWallet={mockPrimaryWallet}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Sign a Message')).toBeInTheDocument();
    });
  });

  it('should display loading state initially', () => {
    render(
      <MessageForm
        addToHistory={mockAddToHistory}
        user={mockUser}
        primaryWallet={mockPrimaryWallet}
      />
    );

    expect(screen.getByText('Sign a Message')).toBeInTheDocument();
  });

  it('should allow user to type a message', async () => {
    const user = userEvent.setup();
    
    render(
      <MessageForm
        addToHistory={mockAddToHistory}
        user={mockUser}
        primaryWallet={mockPrimaryWallet}
      />
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter a message to sign/i)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/Enter a message to sign/i);
    await user.type(textarea, 'Hello World');

    expect(textarea).toHaveValue('Hello World');
  });

  it('should show character count when message is entered', async () => {
    const user = userEvent.setup();
    
    render(
      <MessageForm
        addToHistory={mockAddToHistory}
        user={mockUser}
        primaryWallet={mockPrimaryWallet}
      />
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter a message to sign/i)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/Enter a message to sign/i);
    await user.type(textarea, 'Test');

    await waitFor(() => {
      expect(screen.getByText('4 characters')).toBeInTheDocument();
    });
  });

  it('should display wallet address', async () => {
    render(
      <MessageForm
        addToHistory={mockAddToHistory}
        user={mockUser}
        primaryWallet={mockPrimaryWallet}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/0x742d/)).toBeInTheDocument();
    });
  });

  it('should display user email', async () => {
    render(
      <MessageForm
        addToHistory={mockAddToHistory}
        user={mockUser}
        primaryWallet={mockPrimaryWallet}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  it('should disable submit button when message is empty', async () => {
    render(
      <MessageForm
        addToHistory={mockAddToHistory}
        user={mockUser}
        primaryWallet={mockPrimaryWallet}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Sign & Verify Message')).toBeInTheDocument();
    });

    // The button should be disabled when message is empty
    const submitButton = screen.getByText('Sign & Verify Message').closest('button');
    expect(submitButton).toBeDisabled();
  });

  it('should sign and verify message successfully', async () => {
    const user = userEvent.setup();
    const mockSignature = '0xabcdef123456';
    
    mockPrimaryWallet.signMessage.mockResolvedValue(mockSignature);
    (api.verifySignature as any).mockResolvedValue({
      isValid: true,
      signer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
      originalMessage: 'Hello World',
    });

    render(
      <MessageForm
        addToHistory={mockAddToHistory}
        user={mockUser}
        primaryWallet={mockPrimaryWallet}
      />
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter a message to sign/i)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/Enter a message to sign/i);
    await user.type(textarea, 'Hello World');

    const submitButton = screen.getByText('Sign & Verify Message');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Signature Valid')).toBeInTheDocument();
    });

    expect(mockPrimaryWallet.signMessage).toHaveBeenCalledWith('Hello World');
    expect(api.verifySignature).toHaveBeenCalledWith('Hello World', mockSignature);
    expect(mockAddToHistory).toHaveBeenCalled();
  });

  it('should handle signing error', async () => {
    const user = userEvent.setup();
    
    mockPrimaryWallet.signMessage.mockRejectedValue(new Error('User rejected'));

    render(
      <MessageForm
        addToHistory={mockAddToHistory}
        user={mockUser}
        primaryWallet={mockPrimaryWallet}
      />
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter a message to sign/i)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/Enter a message to sign/i);
    await user.type(textarea, 'Hello World');

    const submitButton = screen.getByText('Sign & Verify Message');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/User rejected/i)).toBeInTheDocument();
    });
  });

  it('should handle verification error gracefully', async () => {
    const user = userEvent.setup();
    const mockSignature = '0xabcdef123456';
    
    mockPrimaryWallet.signMessage.mockResolvedValue(mockSignature);
    (api.verifySignature as any).mockRejectedValue(new Error('Network error'));

    render(
      <MessageForm
        addToHistory={mockAddToHistory}
        user={mockUser}
        primaryWallet={mockPrimaryWallet}
      />
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter a message to sign/i)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/Enter a message to sign/i);
    await user.type(textarea, 'Hello World');

    const submitButton = screen.getByText('Sign & Verify Message');
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockAddToHistory).toHaveBeenCalled();
    });
  });

  it('should show "Sign Another Message" button after successful verification', async () => {
    const user = userEvent.setup();
    const mockSignature = '0xabcdef123456';
    
    mockPrimaryWallet.signMessage.mockResolvedValue(mockSignature);
    (api.verifySignature as any).mockResolvedValue({
      isValid: true,
      signer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
      originalMessage: 'Hello World',
    });

    render(
      <MessageForm
        addToHistory={mockAddToHistory}
        user={mockUser}
        primaryWallet={mockPrimaryWallet}
      />
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter a message to sign/i)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/Enter a message to sign/i);
    await user.type(textarea, 'Hello World');

    const submitButton = screen.getByText('Sign & Verify Message');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Sign Another Message')).toBeInTheDocument();
    });
  });

  it('should reset form when clicking "Sign Another Message"', async () => {
    const user = userEvent.setup();
    const mockSignature = '0xabcdef123456';
    
    mockPrimaryWallet.signMessage.mockResolvedValue(mockSignature);
    (api.verifySignature as any).mockResolvedValue({
      isValid: true,
      signer: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0',
      originalMessage: 'Hello World',
    });

    render(
      <MessageForm
        addToHistory={mockAddToHistory}
        user={mockUser}
        primaryWallet={mockPrimaryWallet}
      />
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter a message to sign/i)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/Enter a message to sign/i);
    await user.type(textarea, 'Hello World');

    const submitButton = screen.getByText('Sign & Verify Message');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Sign Another Message')).toBeInTheDocument();
    });

    const resetButton = screen.getByText('Sign Another Message');
    await user.click(resetButton);

    await waitFor(() => {
      expect(textarea).toHaveValue('');
      expect(screen.queryByText('Signature Valid')).not.toBeInTheDocument();
    });
  });


  it('should show error when wallet is not connected', async () => {
    const user = userEvent.setup();
    
    render(
      <MessageForm
        addToHistory={mockAddToHistory}
        user={mockUser}
        primaryWallet={null}
      />
    );

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Enter a message to sign/i)).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText(/Enter a message to sign/i);
    await user.type(textarea, 'Hello World');

    const submitButton = screen.getByText('Sign & Verify Message');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Wallet not connected')).toBeInTheDocument();
    });
  });
});
