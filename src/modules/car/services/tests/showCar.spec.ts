import Car from '@modules/car/models/car.model';
import getCarById from '../showCarService';

jest.mock('@modules/car/models/car.model');

describe('Should get a car by ID', () => {
    const mockFindByPk = jest.spyOn(Car, 'findByPk');
    const mockCar = {
        id: '123abc',
        plate: 'AED-456',
        destroy: jest.fn(),
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should get a car by ID with sucess!', async () => {
        (Car.findByPk as jest.Mock).mockResolvedValue(mockCar);

        const result = await getCarById(mockCar.id);
        expect(mockFindByPk).toHaveBeenCalledWith(mockCar.id);
        expect(result).toEqual(mockCar);
    });

    test('Should throw a error if car not found', async () => {
        mockFindByPk.mockResolvedValue(null);

        await expect(getCarById(mockCar.id)).rejects.toThrow('Car not found');
    });
});
