import Customer from '@modules/customer/models/Customer';
import CustomerService from '../CustomerServices';

jest.mock('@modules/customer/models/Customer');

describe('Update Customer', () => {
    const mockFindOne = Customer.findOne as jest.Mock;
    const mockUpdate = jest.spyOn(Customer, 'update');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should update a User', async () => {
        const mockCustomer = { id: 'abc123', nome: 'José' };

        mockFindOne.mockResolvedValue(mockCustomer);

        const updatedCustomerID = await CustomerService.updateCustomer(
            'abc123',
            {
                nome: 'Jonas',
            },
        );

        expect(updatedCustomerID).toBe(mockCustomer.id);
        expect(mockUpdate).toHaveBeenCalledTimes(1);
    });

    test('Should throw a error if try to update a nonexisting customer', async () => {
        mockFindOne.mockResolvedValue(null);

        await expect(
            CustomerService.updateCustomer('abc123', {
                nome: 'Jonas',
            }),
        ).rejects.toThrow('Cliente não encontrado');

        expect(mockUpdate).not.toHaveBeenCalledWith();
    });
});
