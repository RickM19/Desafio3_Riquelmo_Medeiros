import User from '@modules/User/models/User';
import CreateSessionService from '../CreateSessionService';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

jest.mock('@modules/User/models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Create session', () => {
    const mockFindOne = jest.spyOn(User, 'findOne');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should return a token and user data when insert a correct password/email combination', async () => {
        const mockUser = new User({
            id: 'abc1234-a',
            name: 'test',
            email: 'test@example.com',
            password: 'hashed-password',
        }) as Partial<User> as User;

        mockFindOne.mockResolvedValue(mockUser);
        (compare as jest.Mock).mockResolvedValue(true);
        (sign as jest.Mock).mockReturnValue('valid-jwt-token');

        const createSessionService = new CreateSessionService();
        const response = await createSessionService.execute({
            email: 'test@example.com',
            password: 'password',
        });
        expect(compare).toHaveBeenCalledWith('password', mockUser.password);

        expect(response).toEqual({
            data: {
                id: mockUser.id,
                name: mockUser.name,
                email: mockUser.email,
            },
            token: 'valid-jwt-token',
        });
    });

    test('Should return an error if an invalid email is provided', async () => {
        mockFindOne.mockResolvedValue(null);

        const createSessionService = new CreateSessionService();

        await expect(
            createSessionService.execute({
                email: 'invalid@example.com',
                password: 'password',
            }),
        ).rejects.toThrow(
            'Incorrect email and password combination. Please try again!',
        );
    });

    test('Should return an error if an invalid password is provided', async () => {
        (compare as jest.Mock).mockResolvedValue(false);

        const createSessionService = new CreateSessionService();

        await expect(
            createSessionService.execute({
                email: 'email@example.com',
                password: 'invalid-password',
            }),
        ).rejects.toThrow(
            'Incorrect email and password combination. Please try again!',
        );
    });
});
