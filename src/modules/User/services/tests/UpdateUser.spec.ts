import User from '@modules/User/models/User';
import UpdateUserService from '../UpdateUserService';
import { hash } from 'bcryptjs';

jest.mock('@modules/User/models/User');
jest.mock('bcryptjs');

describe('Update user', () => {
    const mockFindOne = jest.spyOn(User, 'findOne');
    const updateUserService = new UpdateUserService();
    const mockUpdate = jest.spyOn(User, 'update');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should update user', async () => {
        const mockUser = new User({
            id: 'abc1234-a',
            name: 'user',
            email: 'user@email.com',
            password: 'hashed-password',
        }) as Partial<User> as User;

        mockFindOne.mockResolvedValue(mockUser);
        (hash as jest.Mock).mockResolvedValue('hashed-updated-password');

        await updateUserService.execute(mockUser.id, {
            email: 'updated@email.com',
            password: 'updated-password',
        });

        expect(hash).toHaveBeenCalledWith('updated-password', 8);
        expect(mockUpdate).toHaveBeenCalledWith(
            {
                email: 'updated@email.com',
                password: 'hashed-updated-password',
            },
            {
                where: { id: mockUser.id },
            },
        );
    });

    test('Should throw a Error if user not found', async () => {
        mockFindOne.mockResolvedValue(null);

        await expect(
            updateUserService.execute('123', { name: 'newName' }),
        ).rejects.toThrow('User not found!');

        expect(mockUpdate).not.toHaveBeenCalledWith();
    });

    test('Should throw a Error if user with updated email already exists', async () => {
        const mockExistingUser = new User({
            id: 'bce4567-b',
            name: 'existingUser',
            email: 'email@email.com',
            password: 'hashed-password',
        }) as Partial<User> as User;

        const mockUserWithEmail = new User({
            id: 'abc1234-a',
            name: 'user',
            email: 'existing@email.com',
            password: 'hashed-password',
        }) as Partial<User> as User;

        mockFindOne.mockResolvedValueOnce(mockExistingUser);

        mockFindOne.mockResolvedValueOnce(mockUserWithEmail);

        await updateUserService.execute(mockExistingUser.id, {
            email: mockUserWithEmail.id,
        });

        expect(hash as jest.Mock).not.toHaveBeenCalledWith();
        expect(mockUpdate).not.toHaveBeenCalledWith();
    });
});
