import Order from '@modules/Order/models/Order';
import ReadOrderService from '../ReadOrderService';

jest.mock('@modules/Order/models/Order');

describe('Read order by id', () => {
    const mockFindOne = Order.findOne as jest.Mock;

    const readOrderService = new ReadOrderService();

    const mockOrder = {
        id: '1',
        status: 'Aberto',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should get order by id', async () => {
        mockFindOne.mockResolvedValue(mockOrder);

        const searchOrder = await readOrderService.execute(mockOrder.id);

        expect(searchOrder).toEqual(mockOrder);
    });

    test('Should throw a error if try to get a nonexisting order', async () => {
        mockFindOne.mockResolvedValue(null);

        await expect(readOrderService.execute('1234')).rejects.toThrow(
            'Pedido não encontrado',
        );
    });
});
