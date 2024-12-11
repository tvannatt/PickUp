import { generateQRData } from '../components/UserQRCode';
import { decryptData } from '../components/QRCodeScanner';
import { getKey } from '../config';

jest.mock('../config', () => ({
  getKey: jest.fn(),
  auth: {
    currentUser: {
      email: 'test@example.com',
    },
  },
}));

describe('generateQRData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('generates encrypted QR data successfully', async () => {
    const mockKey = 'keyA';
    const mockEmail = 'test@example.com';
    const currentTime = new Date().toISOString();

    getKey.mockResolvedValue(mockKey);

    const qrData = await generateQRData('keyA');

    expect(getKey).toHaveBeenCalledWith('encryptionKeys/keyA');
    expect(qrData).not.toContain(mockEmail);
    expect(qrData).not.toContain(currentTime);

    expect(qrData).toContain('keyA:');
  });

  it('encrypts and decrypts data to the original', async () => {
    const mockKey = 'secretKey';
    const mockEmail = 'test@example.com';
    const currentTime = new Date().toISOString();

    getKey.mockResolvedValue(mockKey);

    const qrData = await generateQRData('keyA');
    expect(qrData).toContain('keyA:');
    expect(qrData).not.toContain(mockEmail);
    expect(qrData).not.toContain(currentTime);

    const encryptedData = qrData.split(':')[1];
    const decryptedData = decryptData(encryptedData, mockKey);
    const parsedDecryptedData = JSON.parse(decryptedData);

    expect(parsedDecryptedData.email).toBe(mockEmail);
    expect(parsedDecryptedData.timestamp).toBe(currentTime)
  });

  it('returns an empty string if the key is not found', async () => {
    getKey.mockResolvedValue('');

    const qrData = await generateQRData('keyA');

    expect(qrData).toBe('');
  });

  it('handles errors gracefully', async () => {
    getKey.mockRejectedValue(new Error('Error fetching key'));

    const qrData = await generateQRData('keyA');

    expect(qrData).toBe('');
  });
});
