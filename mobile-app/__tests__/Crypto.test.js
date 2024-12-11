import CryptoES from 'crypto-es';

describe('aes', () => {
  it('encrypt keySize 128', () => {
    const encrypted = CryptoES.AES.encrypt(
      CryptoES.enc.Hex.parse('00112233445566778899aabbccddeeff'),
      CryptoES.enc.Hex.parse('000102030405060708090a0b0c0d0e0f'),
      { mode: CryptoES.mode.ECB, padding: CryptoES.pad.NoPadding }
    ).ciphertext.toString(CryptoES.enc.Hex);
    expect(encrypted).toBe('69c4e0d86a7b0430d8cdb78070b4c55a');
  });

  it('decrypt keySize 128', () => {
    const decrypted = CryptoES.AES.decrypt(
      { ciphertext: CryptoES.enc.Hex.parse('69c4e0d86a7b0430d8cdb78070b4c55a') },
      CryptoES.enc.Hex.parse('000102030405060708090a0b0c0d0e0f'),
      { mode: CryptoES.mode.ECB, padding: CryptoES.pad.NoPadding }
    ).toString(CryptoES.enc.Hex);
    expect(decrypted).toBe('00112233445566778899aabbccddeeff');
  });
});