import User from '@modules/User/models/User';
import DeleteUserService from '../DeleteUserService';

jest.mock('@modules/User/models/User');

describe('Delete user', () => {
    const mockDestroy = jest.spyOn(User, 'destroy');
    const mockFindOne = jest.spyOn(User, 'findOne');

    const deleteUserService = new DeleteUserService();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should delete a user with sucess!', async () => {
        const mockUser = new User({
            id: 'abc1234-a',
            name: 'user',
            email: 'exists@email.com',
            password: 'hashed-password',
        }) as Partial<User> as User;

        mockFindOne.mockResolvedValue(mockUser);
        mockDestroy.mockResolvedValue(1);

        await deleteUserService.execute('abc1234-a');

        expect(mockFindOne).toHaveBeenCalledWith({
            where: { id: 'abc1234-a' },
        });

        expect(mockDestroy).toHaveBeenCalledWith({
            where: { id: 'abc1234-a' },
        });
    });

    test('Should throw a error if dont find a user', async () => {
        mockFindOne.mockResolvedValue(null);

        await expect(deleteUserService.execute('123')).rejects.toThrow(
            'User not found!',
        );

        expect(mockDestroy).not.toHaveBeenCalled();
    });
});
