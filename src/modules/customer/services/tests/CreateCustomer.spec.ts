import { Op } from 'sequelize';
import CustomerService from '../CustomerServices';
import Customer from '@modules/customer/models/Customer';

jest.mock('@modules/customer/models/Customer');

describe('Create customer', () => {
    const mockCreate = jest.spyOn(Customer, 'create');

    const mockCustomer = {
        nome: 'João Silva',
        dataNascimento: new Date('1990-05-15'),
        cpf: '123.456.789-00',
        email: 'joao.silva@example.com',
        telefone: '(11) 11111-1111',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should create user', async () => {
        (Customer.findOne as jest.Mock).mockResolvedValue(null);
        const { cpf, email } = mockCustomer;
        mockCreate.mockResolvedValue({ ...mockCustomer, id: '1' });
        const response = await CustomerService.createCustomer(mockCustomer);

        expect(Customer.findOne).toHaveBeenCalledWith({
            where: {
                [Op.or]: [{ cpf }, { email }],
            },
        });

        expect(Customer.create).toHaveBeenCalledWith({
            ...mockCustomer,
            dataRegistro: expect.any(Date),
        });

        expect(response).toEqual({ ...mockCustomer, id: '1' });
    });

    test('Should throw a Error if a required field is missing!', async () => {
        await expect(
            CustomerService.createCustomer({ ...mockCustomer, email: '' }),
        ).rejects.toThrow('Todos os campos são obrigatórios');
    });

    test('Should throw an error if a Customer with the same email/cpf exists', async () => {
        (Customer.findOne as jest.Mock).mockResolvedValue(mockCustomer);

        await expect(
            CustomerService.createCustomer(mockCustomer),
        ).rejects.toThrow('Cliente com CPF ou email já cadastrado');
    });
});
