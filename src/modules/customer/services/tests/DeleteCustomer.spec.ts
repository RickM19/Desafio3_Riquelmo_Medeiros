import CustomerService from '../CustomerServices';
import Customer from '@modules/customer/models/Customer';

jest.mock('@modules/customer/models/Customer');

describe('Delete customer', () => {
    const mockFindOne = Customer.findOne as jest.Mock;
    const mockDestroy = jest.spyOn(Customer, 'destroy');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should delete a customer', async () => {
        const mockCustomer = { id: '1234abc' };

        mockFindOne.mockResolvedValue(mockCustomer);
        mockDestroy.mockResolvedValue(1);

        await CustomerService.deleteCustomer(mockCustomer.id);
        expect(mockFindOne).toHaveBeenCalledWith({
            where: { id: mockCustomer.id },
        });

        expect(mockDestroy).toHaveBeenCalledWith({
            where: { id: mockCustomer.id },
        });
    });

    test('Should throw a error if try to delete a nonexistent user', async () => {
        mockFindOne.mockResolvedValue(null);

        await expect(CustomerService.deleteCustomer('123')).rejects.toThrow(
            'Cliente não encontrado',
        );
    });
});
