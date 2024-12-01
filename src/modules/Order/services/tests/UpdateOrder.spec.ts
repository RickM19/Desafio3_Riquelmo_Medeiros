import Order from '@modules/Order/models/Order';
import UpdateOrderService from '../UpdateOrderService';
import axios from 'axios';

jest.mock('@modules/Order/models/Order');
jest.mock('axios');

describe('Update orders tests', () => {
    const mockFindByPk = Order.findByPk as jest.Mock;
    const updateOrderService = new UpdateOrderService();
    const mockAxiosGet = axios.get as jest.Mock;

    const mockOrderFound = {
        id: '1',
        cliente: '1',
        CarroPedido: '1',
        status: 'Aberto',
        update: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should update a order', async () => {
        const fixedDate = new Date(2000, 1, 1);
        jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);
        mockFindByPk.mockResolvedValue(mockOrderFound);
        const CEP = '59020400';
        mockAxiosGet.mockResolvedValue({
            data: {
                uf: 'RN',
                localidade: 'Natal',
                erro: false,
            },
        });

        await updateOrderService.execute({
            id: mockOrderFound.id,
            DataInicial: new Date(2024, 1, 1),
            DataFinal: new Date(2025, 1, 1),
            CEP,
            status: 'Aprovado',
        });

        expect(mockFindByPk).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(
            `https://viacep.com.br/ws/${CEP}/json/`,
        );
        expect(mockOrderFound.update).toHaveBeenCalledTimes(1);
    });

    test('Should throw a error when try to update a nonexisting order', async () => {
        mockFindByPk.mockResolvedValue(null);

        await expect(
            updateOrderService.execute({
                id: mockOrderFound.id,
                DataInicial: new Date(2024, 1, 1),
                DataFinal: new Date(2025, 1, 1),
                CEP: '1232314',
                status: 'Aprovado',
            }),
        ).rejects.toThrow('Pedido não encontrado!');
    });

    test('Should change status to "Cancelado"', async () => {
        const fixedDate = new Date(2000, 1, 1);
        jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);
        mockFindByPk.mockResolvedValue(mockOrderFound);
        const CEP = '59020400';
        mockAxiosGet.mockResolvedValue({
            data: {
                uf: 'RN',
                localidade: 'Natal',
                erro: false,
            },
        });

        await updateOrderService.execute({
            id: mockOrderFound.id,
            DataInicial: new Date(2024, 1, 1),
            DataFinal: new Date(2025, 1, 1),
            CEP,
            status: 'Cancelado',
        });

        expect(mockFindByPk).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith(
            `https://viacep.com.br/ws/${CEP}/json/`,
        );
        expect(mockOrderFound.update).toHaveBeenCalledTimes(1);
        expect(mockOrderFound).toHaveProperty('DataCancelamento');
    });

    test('Should throw a error when inser a unavailable CEP"', async () => {
        const fixedDate = new Date(2000, 1, 1);
        jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);
        mockFindByPk.mockResolvedValue(mockOrderFound);
        const CEP = '111111111';
        mockAxiosGet.mockResolvedValue({
            data: {
                uf: 'SP',
                localidade: 'São Paulo',
                erro: false,
            },
        });

        await expect(
            updateOrderService.execute({
                id: mockOrderFound.id,
                DataInicial: new Date(2024, 1, 1),
                DataFinal: new Date(2025, 1, 1),
                CEP,
                status: 'Aprovado',
            }),
        ).rejects.toThrow('SP no momento não temos filiais nessa região');

        expect(mockOrderFound.update).not.toHaveBeenCalledWith();
    });

    test('Should throw a error when inser a unavailable CEP"', async () => {
        const fixedDate = new Date(2000, 1, 1);
        jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);
        mockFindByPk.mockResolvedValue(mockOrderFound);
        const CEP = '111111111';
        mockAxiosGet.mockResolvedValue({ data: { erro: true } });

        await expect(
            updateOrderService.execute({
                id: mockOrderFound.id,
                DataInicial: new Date(2024, 1, 1),
                DataFinal: new Date(2025, 1, 1),
                CEP,
                status: 'Aprovado',
            }),
        ).rejects.toThrow('CEP inválido');

        expect(mockOrderFound.update).not.toHaveBeenCalledWith();
    });

    test('Should throw a error when required field is missing', async () => {
        const fixedDate = new Date(2000, 1, 1);
        jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);
        mockFindByPk.mockResolvedValue(mockOrderFound);
        mockAxiosGet.mockResolvedValue({
            data: {
                uf: 'RN',
                localidade: 'Natal',
                erro: false,
            },
        });

        await expect(
            updateOrderService.execute({
                id: mockOrderFound.id,
                DataInicial: new Date(2024, 1, 1),
                DataFinal: new Date(2025, 1, 1),
                CEP: '',
                status: 'Aprovado',
            }),
        ).rejects.toThrow(
            'Todos os campos devem estar preenchidos para aprovar o pedido',
        );

        expect(mockOrderFound.update).not.toHaveBeenCalledWith();
    });

    test('Should throw an error when trying to approve non-open orders', async () => {
        const fixedDate = new Date(2000, 1, 1);
        jest.spyOn(global, 'Date').mockImplementation(() => fixedDate);
        mockFindByPk.mockResolvedValue({
            ...mockOrderFound,
            status: 'Fechado',
        });
        mockAxiosGet.mockResolvedValue({
            data: {
                uf: 'RN',
                localidade: 'Natal',
                erro: false,
            },
        });

        await expect(
            updateOrderService.execute({
                id: mockOrderFound.id,
                DataInicial: new Date(2024, 1, 1),
                DataFinal: new Date(2025, 1, 1),
                CEP: '1323243',
                status: 'Aprovado',
            }),
        ).rejects.toThrow('O pedido deve estar em aberto para ser aprovado');

        expect(mockOrderFound.update).not.toHaveBeenCalledWith();
    });
});
