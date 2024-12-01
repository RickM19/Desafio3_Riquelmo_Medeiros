import ShowUserService from '../ShowUserService';
import User from '@modules/User/models/User';

jest.mock('@modules/User/models/User');

describe('Show user', () => {
    const mockFindOne = jest.spyOn(User, 'findOne');
    const showUserService = new ShowUserService();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should return a user with sucess!', async () => {
        const mockUser = new User({
            id: 'abc1234-a',
            name: 'user',
            email: 'exists@email.com',
        }) as Partial<User> as User;

        mockFindOne.mockResolvedValue(mockUser);

        const response = await showUserService.execute(mockUser.id);

        expect(response).toEqual(mockUser);
        expect(mockFindOne).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { id: mockUser.id },
            }),
        );
    });

    test('Should throw a error if dont find a user', async () => {
        mockFindOne.mockResolvedValue(null);

        await expect(showUserService.execute('123')).rejects.toThrow(
            'User not found!',
        );
    });
});
