import Order from '../models/Order';
import { AppError } from '../../../shared/errors/AppError';

export default class DeleteOrderService {
    public async execute(id: string) {
        const OrderExist = await Order.findOne({
            where: { id },
        });

        if (!OrderExist) {
            throw new AppError('Pedido não encontrado!', 404);
        }
        if (OrderExist.status != 'Aberto') {
            throw new AppError(
                'Somente pedidos com status "Aberto" podem ser cancelados!',
                403,
            );
        }
        OrderExist.status = 'Cancelado';
        OrderExist.save();

        await OrderExist.destroy();

        return;
    }
}
