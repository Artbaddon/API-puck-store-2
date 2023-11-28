"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Address_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Address"));
const User_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/User"));
const AddressCreateValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/AddressCreateValidator"));
const AddressUpdateValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/AddressUpdateValidator"));
class AddressesController {
    constructor() {
        this.index = async ({ auth, response }) => {
            const user_id = auth.user.id;
            try {
                const addresses = await User_1.default.query().where('user_id', user_id).preload('addresses');
                return addresses;
            }
            catch (error) {
                console.error(error);
                return response.status(500).json({ error: error.message });
            }
        };
        this.store = async ({ auth, request, response }) => {
            const user_id = auth.user.id;
            const payload = await request.validate(AddressCreateValidator_1.default);
            const trx = await Database_1.default.transaction();
            try {
                const existingAddress = await Address_1.default.findBy('address_line_1', payload.address_line_1);
                if (existingAddress) {
                    await trx.rollback();
                    throw new Error('Address already exist');
                }
                const address = await Address_1.default.create({
                    address_line_1: payload.address_line_1,
                    address_line_2: payload.address_line_2,
                    city: payload.city,
                    user_id: user_id,
                });
                return address;
            }
            catch (error) {
                console.error(error);
                return response.status(500).json({ error: error.message });
            }
        };
        this.update = async ({ params, request, response, bouncer }) => {
            const { id } = params;
            const payload = await request.validate(AddressUpdateValidator_1.default);
            const trx = await Database_1.default.transaction();
            try {
                try {
                    const address = await Address_1.default.find(id);
                    if (!address) {
                        await trx.rollback();
                        throw new Error('Address does not exist');
                    }
                    try {
                        await bouncer.with('AddressPolicy').authorize('update', address);
                    }
                    catch (error) {
                        console.log('error');
                        return response.status(403).json({ error: error.message });
                    }
                    if (payload.address_line_1) {
                        address.address_line_1 = payload.address_line_1;
                    }
                    if (payload.address_line_2) {
                        address.address_line_2 = payload.address_line_2;
                    }
                    if (payload.city) {
                        address.city = payload.city;
                    }
                    address.save();
                    await trx.commit();
                    return address;
                }
                catch (error) { }
            }
            catch (error) {
                await trx.rollback();
                console.error(error);
                return response.status(500).json({ error: error.message });
            }
        };
        this.destroy = async ({ params, response, bouncer }) => {
            const { id } = params;
            const trx = await Database_1.default.transaction();
            try {
                const existingAddress = await Address_1.default.find(id);
                if (!existingAddress) {
                    await trx.rollback();
                    throw new Error('Address does not exist');
                }
                try {
                    await bouncer.with('AddressPolicy').authorize('update', existingAddress);
                }
                catch (error) {
                    console.log('error');
                    return response.status(403).json({ error: error.message });
                }
                await existingAddress.delete();
                await trx.commit();
                return response.status(200).json({ success: 'Address Deleted' });
            }
            catch (error) {
                await trx.rollback();
                console.error(error);
                return response.status(500).json({ error: error.message });
            }
        };
    }
}
exports.default = AddressesController;
//# sourceMappingURL=AddressesController.js.map