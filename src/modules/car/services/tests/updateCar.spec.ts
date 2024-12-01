import Car from '@modules/car/models/car.model';
import UpdateCarService from '../updateCarService';

jest.mock('@modules/car/models/car.model');
interface IUpdatedProperties {
    plate?: string;
    brand?: string;
    model?: string;
    km?: number;
    year?: number;
    items?: string[];
    price?: number;
    status?: 'active' | 'inactive';
}
describe('Update user', () => {
    const mockFindOne = jest.spyOn(Car, 'findOne');
    const updateCarService = new UpdateCarService();

    const mockUpdatedData: IUpdatedProperties = {
        plate: 'ABC1234',
        items: ['a', 'b', 'c'],
        status: 'active',
        year: new Date().getFullYear(),
    };

    const mockCarFound = {
        id: '12345',
        status: 'active',
        update: jest.fn(),
    } as Partial<Car> as Car;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Should update car with sucess!', async () => {
        mockFindOne.mockResolvedValueOnce(mockCarFound);
        mockFindOne.mockResolvedValueOnce(null);

        await updateCarService.execute('12345', mockUpdatedData);

        expect(mockFindOne).toHaveBeenCalledTimes(2);
        expect(mockCarFound.update).toHaveBeenCalledWith(mockUpdatedData);
    });

    test('Should not update a car not found!', async () => {
        mockFindOne.mockResolvedValue(null);

        await expect(
            updateCarService.execute('abc1', mockUpdatedData),
        ).rejects.toThrow('Car not found');
    });

    test('Should not able to update a status to a value different active/inactive!', async () => {
        mockFindOne.mockResolvedValue(mockCarFound);

        await expect(
            updateCarService.execute('12345', {
                ...mockUpdatedData,
                status: 'abcea',
            }),
        ).rejects.toThrow('Status can only be updated to active or inactive');
    });

    test('Should not able to update a status to a value different active/inactive!', async () => {
        mockFindOne.mockResolvedValue({
            ...mockCarFound,
            status: 'deleted',
        } as Partial<Car> as Car);

        await expect(
            updateCarService.execute('12345', {
                ...mockUpdatedData,
                status: 'abcea',
            }),
        ).rejects.toThrow('Cannot update a car with status deleted');
    });

    test('Should throw a error when try to update a year to a old car!', async () => {
        mockFindOne.mockResolvedValue(mockCarFound);

        await expect(
            updateCarService.execute('12345', {
                ...mockUpdatedData,
                year: new Date().getFullYear() - 20,
            }),
        ).rejects.toThrow(
            'The year of the car must be within the last 11 years.',
        );
    });
});
