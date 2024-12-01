import CreateUserService from '../CreateUserService';
import User from '@modules/User/models/User';
import { hash } from 'bcryptjs';

jest.mock('@modules/User/models/User');
jest.mock('bcryptjs');

describe('Create user', () => {
    const mockCreate = jest.spyOn(User, 'create');
    const mockFindOne = jest.spyOn(User, 'findOne');

    const createUserService = new CreateUserService();
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should create user', async () => {
        mockFindOne.mockResolvedValue(null);
        (hash as jest.Mock).mockResolvedValue('hashed-password');

        const mockUser = { id: 'abc1234-a' };
        mockCreate.mockResolvedValue(mockUser);

        const id = await createUserService.execute({
            name: 'teste',
            email: 'email@example.com',
            password: 'password',
        });

        expect(hash).toHaveBeenCalledWith('password', 8);
        expect(mockCreate).toHaveBeenLastCalledWith({
            name: 'teste',
            email: 'email@example.com',
            password: 'hashed-password',
        });

        expect(id).toBe('abc1234-a');
    });
    test('Should not create a user if email exists', async () => {
        const mockUser = new User({
            id: 'abc1234-a',
            name: 'user',
            email: 'exists@email.com',
            password: 'hashed-password',
        }) as Partial<User> as User;

        mockFindOne.mockResolvedValue(mockUser);

        await expect(
            createUserService.execute({
                name: 'user2',
                email: 'exists@email.com',
                password: 'password',
            }),
        ).rejects.toThrow('An account with this email already exists.');

        expect(mockFindOne).toHaveBeenCalledWith({
            where: { email: 'exists@email.com' },
        });
        expect(mockCreate).not.toHaveBeenCalled();
    });
});
