import Order from '@modules/Order/models/Order';
import ReadAllOrderService from '../ReadAllOrderService';
import Customer from '@modules/customer/models/Customer';

jest.mock('@modules/Order/models/Order');
jest.mock('@modules/customer/models/Customer');
jest.mock('sequelize', () => {
    const ActualSequelize = jest.requireActual('sequelize');
    return {
        ...ActualSequelize,
        Model: class extends ActualSequelize.Model {
            static belongsTo(_model: unknown, _options: unknown) {}
        },
    };
});

describe('Read all orders test', () => {
    const DataInicial = new Date().toISOString();
    const DataFinal = new Date().toISOString();
    const mockFindAndCountAll = Order.findAndCountAll as jest.Mock;
    const mockCustomerFindOne = Customer.findOne as jest.Mock;
    const mockOrders = [
        { id: '1', status: 'Aberto', cpf: '11111111', DataInicial, DataFinal },
        { id: '2', status: 'Aberto', cpf: '11111111', DataInicial, DataFinal },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should return a orders', async () => {
        mockFindAndCountAll.mockResolvedValue({
            count: mockOrders.length,
            rows: mockOrders,
        });

        mockCustomerFindOne.mockResolvedValue({ id: '1' });

        const Data = await ReadAllOrderService.getOrders({
            status: 'Aberto',
            CPF: mockOrders[0].cpf,
            DataFinal: DataFinal,
            DataInicial: DataInicial,
            pageSize: 2,
        });

        expect(Data).toEqual({
            totalOrders: mockOrders.length,
            totalPages: Math.ceil(mockOrders.length / 2),
            orders: mockOrders,
        });
    });
});
