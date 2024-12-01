import Order from '@modules/Order/models/Order';
import DeleteOrderService from '../DeleteOrderService';

jest.mock('@modules/Order/models/Order');

describe('Delete order tests', () => {
    const mockFindOne = Order.findOne as jest.Mock;

    const mockOrder = {
        id: '1',
        status: 'Aberto',
        destroy: jest.fn(),
        save: jest.fn(),
    };

    const deleteOrderService = new DeleteOrderService();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should delete a order', async () => {
        mockFindOne.mockResolvedValue(mockOrder);
        mockOrder.destroy.mockResolvedValue(1);

        await deleteOrderService.execute(mockOrder.id);

        expect(mockOrder.destroy).toHaveBeenCalledTimes(1);
        expect(mockOrder.status).toBe('Cancelado');
    });

    test('Should throw a error when try to delete a nonexisting order', async () => {
        mockFindOne.mockResolvedValue(null);

        await expect(deleteOrderService.execute(mockOrder.id)).rejects.toThrow(
            'Pedido não encontrado!',
        );

        expect(mockOrder.destroy).not.toHaveBeenCalledTimes(1);
    });

    test('Should throw a error when try to delete a order with incorrect status', async () => {
        mockFindOne.mockResolvedValue({ ...mockOrder, status: 'Cancelado' });

        await expect(deleteOrderService.execute(mockOrder.id)).rejects.toThrow(
            'Somente pedidos com status "Aberto" podem ser cancelados!',
        );

        expect(mockOrder.destroy).not.toHaveBeenCalledTimes(1);
    });
});
