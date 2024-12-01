import Car from '@modules/car/models/car.model';
import createCar from '../createCarService';

jest.mock('@modules/car/models/car.model');
interface CarData {
    plate: string;
    brand: string;
    model: string;
    km: number;
    year: number;
    items: string[];
    price: number;
    status: 'active' | 'inactive' | 'deleted';
}

describe('Create Car', () => {
    const mockCreate = jest.spyOn(Car, 'create');
    const mockFindOne = jest.spyOn(Car, 'findOne');

    const mockCar: CarData = {
        plate: 'ABC-1234',
        brand: 'Toyota',
        model: 'Corolla',
        km: 25000,
        year: new Date().getFullYear(),
        items: ['Air Conditioning', 'ABS', 'Airbags', 'Bluetooth'],
        price: 85000,
        status: 'active',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should create a car', async () => {
        mockFindOne.mockResolvedValue(null);

        mockCreate.mockResolvedValue({ ...mockCar, id: 1 });

        const result = await createCar(mockCar);

        expect(Car.findOne).toHaveBeenCalledWith({
            where: { plate: mockCar.plate, status: ['active', 'inactive'] },
        });

        expect(Car.create).toHaveBeenCalledWith({
            ...mockCar,
            registrationDate: expect.any(Date),
        });

        expect(result).toEqual({ ...mockCar, id: 1 });
    });

    test('Should throw a Error if a required field is missing!', async () => {
        await expect(createCar({ ...mockCar, plate: '' })).rejects.toThrow(
            'All required fields must be filled.',
        );
    });
    test('should throw an error if the car year is older than 11 years', async () => {
        await expect(
            createCar({ ...mockCar, year: new Date().getFullYear() - 12 }),
        ).rejects.toThrow(
            'The year of the car must be within the last 11 years.',
        );
    });

    test('should throw an error if a car with the same plate already exists', async () => {
        (Car.findOne as jest.Mock).mockResolvedValue(mockCar);

        await expect(createCar(mockCar)).rejects.toThrow(
            'A car with this plate already exists.',
        );
    });
});
