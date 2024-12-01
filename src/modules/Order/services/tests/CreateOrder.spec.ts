import Customer from '@modules/customer/models/Customer';
import Car from '@modules/car/models/car.model';
import Order from '@modules/Order/models/Order';
import axios from 'axios';
import CreaterOrderService from '../CreaterOrderService';

jest.mock('@modules/customer/models/Customer');
jest.mock('@modules/car/models/car.model');
jest.mock('@modules/Order/models/Order');
jest.mock('sequelize', () => {
    const ActualSequelize = jest.requireActual('sequelize');
    return {
        ...ActualSequelize,
        Model: class extends ActualSequelize.Model {
            static belongsTo(_model: unknown, _options: unknown) {}
        },
    };
});
jest.mock('axios');

describe('Create order', () => {
    const mockCustomerFindOne = jest.spyOn(Customer, 'findOne');
    const mockCarFindOne = jest.spyOn(Car, 'findOne');
    const mockOrderFindOne = Order.findOne as jest.Mock;
    const mockCreate = jest.spyOn(Order, 'create');
    const createOrderService = new CreaterOrderService();

    const mockCustomer = {
        id: '1',
        email: 'test@example.com',
    } as Partial<Customer> as Customer;

    const mockCar = {
        id: '1',
        plate: 'ABC1234',
        price: 10000,
    } as Partial<Car> as Car;

    const mockOrder = {
        id: '1',
        cliente: '1',
        CarroPedido: '1',
        status: 'Aberto',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should create a order', async () => {
        mockCustomerFindOne.mockResolvedValue(mockCustomer);
        mockCarFindOne.mockResolvedValue(mockCar);
        mockOrderFindOne.mockResolvedValue(null);

        (axios.get as jest.Mock).mockResolvedValue({
            data: {
                uf: 'RN',
                localidade: 'Natal',
                erro: false,
            },
        });
        mockCreate.mockResolvedValue(mockOrder);

        const Order = await createOrderService.execute({
            email: 'test@example.com',
            plate: 'ABC1234',
            CEP: '59020400',
        });

        expect(mockCreate).toHaveBeenCalledWith({
            cliente: mockCustomer.id,
            CarroPedido: mockCar.id,
            CEP: '59020400',
            Cidade: 'Natal',
            UF: 'RN',
            ValorTotal: 10000,
            dataFinal: null,
            dataCancelamento: null,
            status: 'Aberto',
        });

        expect(Order).toEqual(mockOrder);
    });

    test('Should throw a error if cant find customer', async () => {
        mockCustomerFindOne.mockResolvedValue(null);

        await expect(
            createOrderService.execute({
                email: 'test@example.com',
                plate: 'ABC1234',
                CEP: '59020400',
            }),
        ).rejects.toThrow('Cliente não encontrado');

        expect(mockCarFindOne).not.toHaveBeenCalledWith();
        expect(mockOrderFindOne).not.toHaveBeenCalledWith();
        expect(mockCreate).not.toHaveBeenCalledWith();
    });

    test('Should throw a error if cant find car', async () => {
        mockCustomerFindOne.mockResolvedValue(mockCustomer);
        mockCarFindOne.mockResolvedValue(null);

        await expect(
            createOrderService.execute({
                email: 'test@example.com',
                plate: 'ABC1234',
                CEP: '59020400',
            }),
        ).rejects.toThrow('Carro não encontrado');

        expect(mockOrderFindOne).not.toHaveBeenCalledWith();
        expect(mockCreate).not.toHaveBeenCalledWith();
    });

    test('Should throw a error if find a equal order active', async () => {
        mockCustomerFindOne.mockResolvedValue(mockCustomer);
        mockCarFindOne.mockResolvedValue(mockCar);
        mockOrderFindOne.mockResolvedValue(mockOrder);

        await expect(
            createOrderService.execute({
                email: 'test@example.com',
                plate: 'ABC1234',
                CEP: '59020400',
            }),
        ).rejects.toThrow('Cliente já possui pedido em aberto');

        expect(mockCreate).not.toHaveBeenCalledWith();
    });
});
