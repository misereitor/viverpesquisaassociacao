import app from '../app';

jest.mock('../app', () => ({
  __esModule: true,
  default: {
    listen: jest.fn(),
  },
}));

console.log = jest.fn();

describe('Server initialization', () => {
  it('should start the server and log the message', () => {
    require('../server');

    expect(app.listen).toHaveBeenCalledWith(5050, expect.any(Function));

    const listenCallback = (app.listen as jest.Mock).mock.calls[0][1];
    listenCallback();

    expect(console.log).toHaveBeenCalledWith('Server is running at http://localhost:5050');
  });
});