import User from '../models/User';
import { AppError } from '../../../shared/errors/AppError';
import { hash } from 'bcryptjs';

interface IUpdatedProperties {
    name?: string;
    email?: string;
    password?: string;
}

export default class UpdateUserService {
    public async execute(
        id: string,
        { name, email, password }: IUpdatedProperties,
    ): Promise<void> {
        const userExists = await User.findOne({ where: { id } });
        if (!userExists) {
            throw new AppError('User not found!', 404);
        }
        if (email) {
            const userWithEmail = await User.findOne({ where: { email } });
            if (userWithEmail && userWithEmail.id != userExists.id) {
                throw new AppError(
                    'An account with this email already exists.',
                    409,
                );
            }
        }

        const updatedValues: IUpdatedProperties = {};
        if (email) {
            updatedValues.email = email;
        }
        if (name) {
            updatedValues.name = name;
        }
        if (password) {
            const hashedPassword = await hash(password, 8);
            updatedValues.password = hashedPassword;
        }
        await User.update(updatedValues, { where: { id } });
        return;
    }
}
