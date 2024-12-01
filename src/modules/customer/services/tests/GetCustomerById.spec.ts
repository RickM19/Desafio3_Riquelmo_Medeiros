import CustomerService from '../CustomerServices';
import Customer from '@modules/customer/models/Customer';

jest.mock('@modules/customer/models/Customer');

describe('Get customer by ID', () => {
    const mockFindOne = jest.spyOn(Customer, 'findOne');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should get customer by ID', async () => {
        (Customer.findOne as jest.Mock).mockResolvedValue({ id: '123' });

        const result = await CustomerService.getCustomerById('123');

        expect(result).toEqual({ id: '123' });
        expect(mockFindOne).toHaveBeenCalledWith({
            where: { id: '123' },
        });
    });

    test('Should throw a error if customer not found', async () => {
        mockFindOne.mockResolvedValue(null);

        await expect(CustomerService.getCustomerById('123')).rejects.toThrow(
            'Cliente não encontrado',
        );
    });
});
