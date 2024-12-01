import User from '@modules/User/models/User';
import ListUserService from '../ListUserService';
import { Op } from 'sequelize';

jest.mock('@modules/User/models/User');

describe('Should test user', () => {
    const mockFindAll = jest.spyOn(User, 'findAll');
    const mockCount = jest.spyOn(User, 'count');
    const listUserService = new ListUserService();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should return users', async () => {
        const mockUser1 = new User({
            id: 'abc1234-a',
            name: 'user',
            email: 'exists@email.com',
        }) as Partial<User> as User;

        const mockUser2 = new User({
            id: 'abc1234-b',
            name: 'user',
            email: 'exists@email.com',
        }) as Partial<User> as User;

        const mockUsers = [mockUser1, mockUser2];
        mockCount.mockResolvedValue(2);
        mockFindAll.mockResolvedValue(mockUsers);

        const users = await listUserService.execute(
            {},
            { nameOrder: 'ASC', createOrder: 'ASC', deleteOrder: 'ASC' },
            { page: 1, limit: 10 },
        );

        expect(users.users).toEqual(mockUsers);
        expect(users.pages).toBe(1);
    });

    test('should throw a error if cant find users', async () => {
        mockCount.mockResolvedValue(0);

        await expect(
            listUserService.execute(
                { name: 'User' },
                {
                    nameOrder: 'ASC',
                    createOrder: 'ASC',
                    deleteOrder: 'ASC',
                },
                { page: 1, limit: 10 },
            ),
        ).rejects.toThrow('No results match your search.');
    });

    test('should apply filters', async () => {
        const mockUser1 = new User({
            id: 'abc1234-a',
            name: 'user',
            email: 'exists@email.com',
        }) as Partial<User> as User;

        const mockUsers = [mockUser1];

        mockFindAll.mockResolvedValue(mockUsers);
        mockCount.mockResolvedValue(1);

        const response = await listUserService.execute(
            { name: 'user' },
            { nameOrder: 'ASC', createOrder: 'ASC', deleteOrder: 'ASC' },
            { page: 1, limit: 10 },
        );

        expect(response.pages).toBe(1);
        expect(response.users).toEqual(mockUsers);

        expect(mockFindAll).toHaveBeenCalledWith(
            expect.objectContaining({
                where: { name: { [Op.like]: '%user%' } },
            }),
        );
    });

    test('Should order list', async () => {
        const mockUser1 = new User({
            id: 'abc1234-a',
            name: 'user',
            email: 'exists@email.com',
        }) as Partial<User> as User;

        const mockUser2 = new User({
            id: 'abc1234-b',
            name: 'user',
            email: 'exists@email.com',
        }) as Partial<User> as User;

        const mockUsers = [mockUser1, mockUser2];
        mockCount.mockResolvedValue(2);
        mockFindAll.mockResolvedValue(mockUsers);

        const listUserService = new ListUserService();
        await listUserService.execute(
            {},
            { nameOrder: 'ASC', createOrder: 'ASC', deleteOrder: 'ASC' },
            { page: 1, limit: 10 },
        );

        expect(mockFindAll).toHaveBeenCalledWith(
            expect.objectContaining({
                order: [
                    ['name', 'ASC'],
                    ['createdAt', 'ASC'],
                    ['deletedAt', 'ASC'],
                ],
            }),
        );
    });
    test('Should paginate', async () => {
        const mockUser = new User({
            id: 'abc1234-b',
            name: 'user',
            email: 'exists@email.com',
        }) as Partial<User> as User;

        mockCount.mockResolvedValue(2);
        mockFindAll.mockResolvedValue([mockUser]);

        const listUserService = new ListUserService();
        const response = await listUserService.execute(
            {},
            { nameOrder: 'ASC', createOrder: 'ASC', deleteOrder: 'ASC' },
            { page: 2, limit: 1 },
        );

        expect(response.users).toEqual([mockUser]);
        expect(response.pages).toBe(2);
    });
});
