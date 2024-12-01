import Car from '@modules/car/models/car.model';
import getAllCars from '../listCarService';

jest.mock('@modules/car/models/car.model');

describe('list cars', () => {
    const mockCarList = [{ id: '123' }, { id: '456' }];
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('Should return a car list', async () => {
        (Car.findAll as jest.Mock).mockResolvedValue(mockCarList);

        const response = await getAllCars();
        expect(response).toEqual(mockCarList);
    });
    test('Should throw a error if cant find any car', async () => {
        (Car.findAll as jest.Mock).mockResolvedValue([]);

        await expect(getAllCars()).rejects.toThrow('Cars not found');
    });
});
