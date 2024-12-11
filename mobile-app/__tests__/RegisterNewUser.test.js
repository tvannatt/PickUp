import '../firebaseMocks.js'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { registerNewUser } from "../config";

describe('registerNewUser function', () => {
    beforeEach(() => {
        jest.resetModules(); // This resets the state of all modules
        jest.clearAllMocks(); // This clears the usage data of all mocks
      });

  it('successfully registers a new user and sends verification email when email exists', async () => {
    const setErrorStateMock = jest.fn();

    createUserWithEmailAndPassword.mockResolvedValue({
      user: { email: 'existing@example.com' }
    });
    sendEmailVerification.mockResolvedValue();

    await registerNewUser('existing@example.com', 'password123', setErrorStateMock);

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'existing@example.com', 'password123');
    expect(sendEmailVerification).toHaveBeenCalled();
    expect(setErrorStateMock).not.toHaveBeenCalled();
  });

  it('sets error state when email does not exist', async () => {
    const setErrorStateMock = jest.fn();

    await registerNewUser('nonexisting@example.com', 'password123', setErrorStateMock);

    expect(setErrorStateMock).toHaveBeenCalledWith("Email does not exist in our records.");
  });
});
