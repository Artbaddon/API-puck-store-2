"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CategoryCreateValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/CategoryCreateValidator"));
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const path_1 = __importDefault(require("path"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const Category_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Category"));
const CategoryUpdateValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/CategoryUpdateValidator"));
const Drive_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Drive"));
class CategoriesController {
    constructor() {
        this.index = async ({}) => {
            const categories = await Category_1.default.all();
            return categories;
        };
        this.show = async ({ params }) => {
            const category = await Category_1.default.find(params.id);
            if (category) {
                return category;
            }
        };
        this.store = async ({ request, auth, response, bouncer }) => {
            const payload = await request.validate(CategoryCreateValidator_1.default);
            const user_dir = String(auth.user.id);
            const new_image_name = `${(0, Helpers_1.cuid)()}.${payload.category_img.extname}`;
            const category_image = path_1.default.posix.join(user_dir.toString(), new_image_name);
            try {
                await bouncer.with('AdminPolicy').authorize('create');
            }
            catch (error) {
                console.log('error');
                return response.status(403).json({ error: error.message });
            }
            const trx = await Database_1.default.transaction();
            try {
                const existingCategory = await Category_1.default.findBy('name', payload.name, { client: trx });
                if (existingCategory) {
                    await trx.rollback();
                    throw new Error('Category with this name already exists');
                }
                const category = await Category_1.default.storeCategory({
                    name: payload.name,
                    description: payload.description,
                    category_image: this.generateImageUrl(category_image),
                }, trx);
                await payload.category_img.moveToDisk(user_dir, { name: new_image_name }, Env_1.default.get('DRIVE_DISK'));
                await trx.commit();
                return category;
            }
            catch (error) {
                console.error(error);
                return response.status(500).json({ error: error.message });
            }
        };
        this.update = async ({ params, auth, response, request, bouncer }) => {
            const { id } = params;
            const payload = await request.validate(CategoryUpdateValidator_1.default);
            const user_dir = String(auth.user.id);
            let category;
            try {
                await bouncer.with('AdminPolicy').authorize('update');
            }
            catch (error) {
                console.log('error');
                return response.status(403).json({ error: error.message });
            }
            try {
                category = await Category_1.default.findOrFail(id);
            }
            catch (error) {
                console.error(error);
                return response.status(500).json({ error: error.message });
            }
            const trx = await Database_1.default.transaction();
            try {
                let category_image = category.category_img;
                let new_image_name = '';
                if (payload.category_img) {
                    new_image_name = `${(0, Helpers_1.cuid)()}.${payload.category_img.extname}`;
                    category_image = path_1.default.posix.join(user_dir.toString(), new_image_name);
                }
                const updatedData = {
                    name: payload.name,
                    description: payload.description,
                    category_img: this.generateImageUrl(category_image),
                };
                const updatedCategory = await Category_1.default.updateCategory({ id, ...updatedData }, trx);
                if (payload.category_img) {
                    await payload.category_img.moveToDisk(user_dir, { name: new_image_name }, Env_1.default.get('DRIVE_DISK'));
                    if (category.category_img) {
                        let img = category.category_img;
                        let img_path = img.replace('http://localhost:3333/uploads/', '');
                        console.log(img_path);
                        await Drive_1.default.delete(img_path);
                    }
                }
                await trx.commit();
                return updatedCategory;
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
            let category;
            try {
                category = await Category_1.default.findOrFail(id, { client: trx });
            }
            catch (error) {
                console.error(error);
                return response.status(500).json({ error: error.message });
            }
            try {
                await category.delete();
                let img = category.category_img;
                let img_path = img.replace('http://localhost:3333/uploads/', '');
                console.log(img_path);
                await Drive_1.default.delete(img_path);
                await trx.commit();
                return response.status(200).json({ success: 'Category Deleted' });
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
exports.default = CategoriesController;
//# sourceMappingURL=CategoriesController.js.map