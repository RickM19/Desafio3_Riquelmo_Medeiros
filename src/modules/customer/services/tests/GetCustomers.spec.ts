import Customer from '@modules/customer/models/Customer';
import CustomerService from '../CustomerServices';

jest.mock('@modules/customer/models/Customer');

describe('Get all customers', () => {
    const mockFindAll = Customer.findAll as jest.Mock;
    const mockCount = jest.spyOn(Customer, 'count');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should list all customers', async () => {
        const mockCustomers = [{ id: '1' }, { id: '2' }];
        mockCount.mockResolvedValue(2);
        mockFindAll.mockResolvedValue(mockCustomers);

        const response = await CustomerService.getCustomers({
            page: 1,
            limit: 10,
        });

        expect(response).toEqual({ customers: mockCustomers, pages: 1 });
        expect(response.customers).toEqual(mockCustomers);
        expect(response.pages).toBe(1);
    });

    test('Should apply filters in search', async () => {
        const mockCustomers = [
            {
                id: '1',
                nome: 'Joao',
                email: 'joao@example',
                cpf: '56184939402',
            },
            {
                id: '2',
                nome: 'Ruan',
                email: 'Ruan@example',
                cpf: '70484849405',
            },
        ];
        mockCount.mockResolvedValue(1);
        mockFindAll.mockResolvedValue(mockCustomers[1]);

        const response = await CustomerService.getCustomers({
            nome: 'Joao',
            email: 'Joao@example',
            cpf: '56184939402',
            page: 1,
            limit: 10,
        });

        expect(response).toEqual({ customers: mockCustomers[1], pages: 1 });
    });

    test('Should throw a error if cant find any customer', async () => {
        mockCount.mockResolvedValue(0);
        mockFindAll.mockResolvedValue(null);

        await expect(
            CustomerService.getCustomers({
                nome: 'Joao',
                email: 'Joao@example',
                cpf: '56184939402',
                page: 1,
                limit: 10,
            }),
        ).rejects.toThrow('Nenhum cliente encontrado');
    });
});
