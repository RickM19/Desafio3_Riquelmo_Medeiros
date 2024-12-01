import Car from '@modules/car/models/car.model';
import deleteCar from '../deleteCarService';

jest.mock('@modules/car/models/car.model');

describe('Should delete a Car', () => {
    const mockFindByPk = jest.spyOn(Car, 'findByPk');
    const mockCar = {
        id: '123abc',
        plate: 'AED-456',
        destroy: jest.fn(),
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should delete a car with sucess!', async () => {
        (Car.findByPk as jest.Mock).mockResolvedValue(mockCar);
        mockCar.destroy.mockResolvedValue(1);

        const result = await deleteCar(mockCar.id);
        expect(mockFindByPk).toHaveBeenCalledWith(mockCar.id);
        expect(result.message).toBe('Car deleted successfully');
    });

    test('Should throw a error if car not found', async () => {
        mockFindByPk.mockResolvedValue(null);

        await expect(deleteCar(mockCar.id)).rejects.toThrow('Car not found');
        expect(mockCar.destroy).not.toHaveBeenCalledWith();
    });
});
