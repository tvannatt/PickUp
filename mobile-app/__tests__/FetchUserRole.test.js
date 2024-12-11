import '../firebaseMocks.js'
import { fetchUserRole } from '../config';

describe('fetchUserRole', () => {
  it('should return role for existing user', async () => {
    const email = 'existing@example.com';
    const role = await fetchUserRole(email);
    expect(role).toBe('guardian');
  });

  it('should return null for non-existing user', async () => {
    const email = 'nonexisting@example.com';
    const role = await fetchUserRole(email);
    expect(role).toBeNull();
  });

  it('should return null for null user', async () => {
    const email = '';
    const role = await fetchUserRole(email);
    expect(role).toBeNull();
  });

});