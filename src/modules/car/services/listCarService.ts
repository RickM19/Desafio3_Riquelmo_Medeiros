import { AppError } from '../../../shared/errors/AppError';
import Car from '../models/car.model';

export default async function getAllCars() {
    const cars = await Car.findAll();
    if (cars.length == 0) {
        throw new AppError('Cars not found', 404);
    }
    return cars;
}
