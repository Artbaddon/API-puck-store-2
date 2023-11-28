"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Product_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Product"));
const ProductStoreValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/ProductStoreValidator"));
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const path_1 = __importDefault(require("path"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const Drive_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Drive"));
const Category_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Category"));
const ProductUpdateValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/ProductUpdateValidator"));
class ProductsController {
    constructor() {
        this.index = async ({}) => {
            const products = await Product_1.default.query().preload('category');
            return products;
        };
        this.show = async ({ params }) => {
            const product = await Product_1.default.find(params.id);
            if (product) {
                return product;
            }
        };
        this.store = async ({ auth, response, request, bouncer }) => {
            const payload = await request.validate(ProductStoreValidator_1.default);
            try {
                await bouncer.with('AdminPolicy').authorize('create');
            }
            catch (error) {
                console.log('error');
                return response.status(403).json({ error: error.message });
            }
            const user_dir = String(auth.user.id);
            const new_image_name = `${(0, Helpers_1.cuid)()}.${payload.image.extname}`;
            const product_img = path_1.default.posix.join(user_dir.toString(), new_image_name);
            const trx = await Database_1.default.transaction();
            try {
                const existingProduct = await Product_1.default.findBy('name', payload.name);
                const existingCategory = await Category_1.default.findBy('id', payload.category_id);
                if (existingProduct) {
                    await trx.rollback();
                    throw new Error('Product with this name already exists');
                }
                else if (!existingCategory) {
                    await trx.rollback();
                    throw new Error('Category with this name does not exists');
                }
                const product = await Product_1.default.storeProduct({
                    name: payload.name,
                    category_id: payload.category_id,
                    image: this.generateImageUrl(product_img),
                    price: payload.price,
                    description: payload.description,
                }, trx);
                await payload.image.moveToDisk(user_dir, { name: new_image_name }, Env_1.default.get('DRIVE_DISK'));
                await trx.commit();
                return response.ok(product);
            }
            catch (error) {
                console.error(error);
                return response.status(500).json({ error: error.message });
            }
        };
        this.update = async ({ params, request, response, bouncer, auth }) => {
            const { id } = params;
            const payload = await request.validate(ProductUpdateValidator_1.default);
            let product;
            const user_dir = String(auth.user.id);
            let product_image = '';
            let new_image_name = '';
            try {
                await bouncer.with('AdminPolicy').authorize('update');
            }
            catch (error) {
                console.log('error');
                return response.status(403).json({ error: error.message });
            }
            try {
                product = await Product_1.default.findOrFail(id);
            }
            catch (error) {
                console.error(error);
                return response.status(500).json({ error: error.message });
            }
            if (payload.image) {
                new_image_name = `${(0, Helpers_1.cuid)()}.${payload.image.extname}`;
                product_image = path_1.default.posix.join(user_dir.toString(), new_image_name);
            }
            const trx = await Database_1.default.transaction();
            try {
                const updated_product = await Product_1.default.updateProduct({
                    id,
                    name: payload.name,
                    description: payload.description,
                    image: this.generateImageUrl(product_image),
                    price: payload.price,
                    category_id: payload.category_id,
                }, trx);
                if (payload.image) {
                    await payload.image.moveToDisk(user_dir, { name: new_image_name }, Env_1.default.get('DRIVE_DISK'));
                    if (product.image) {
                        let img = product.image;
                        let img_path = img.replace('http://localhost:3333/uploads/', '');
                        console.log(img_path);
                        await Drive_1.default.delete(img_path);
                    }
                }
                await trx.commit();
                return updated_product;
            }
            catch (error) {
                await trx.rollback();
                console.error(error);
                return response.status(500).json({ error: error.message });
            }
        };
        this.destroy = async ({ params, response, bouncer }) => {
            const { id } = params;
            try {
                await bouncer.with('AdminPolicy').authorize('delete');
            }
            catch (error) {
                console.log('error');
                return response.status(403).json({ error: error.message });
            }
            const trx = await Database_1.default.transaction();
            let product;
            try {
                product = await Product_1.default.findOrFail(id, { client: trx });
            }
            catch (error) {
                console.error(error);
                return response.status(500).json({ error: error.message });
            }
            try {
                await product.delete();
                let img = product.image;
                let img_path = img.replace('http://localhost:3333/uploads/', '');
                console.log(img_path);
                await Drive_1.default.delete(img_path);
                await trx.commit();
                return response.status(200).json({ success: 'Product Deleted' });
            }
            catch (error) {
                console.error(error);
                return response.status(500).json({ error: error.message });
            }
        };
    }
    generateImageUrl(imageName) {
        return `http://localhost:3333/uploads/${imageName}`;
    }
}
exports.default = ProductsController;
//# sourceMappingURL=ProductsController.js.map