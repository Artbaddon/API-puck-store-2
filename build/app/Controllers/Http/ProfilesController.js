"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Profile_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Models/Profile"));
const ProfileUpdateValidator_1 = __importDefault(global[Symbol.for('ioc.use')]("App/Validators/ProfileUpdateValidator"));
const Helpers_1 = global[Symbol.for('ioc.use')]("Adonis/Core/Helpers");
const path_1 = __importDefault(require("path"));
const Database_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Lucid/Database"));
const Env_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Env"));
const Drive_1 = __importDefault(global[Symbol.for('ioc.use')]("Adonis/Core/Drive"));
class ProfilesController {
    constructor() {
        this.show = async ({ params, bouncer, response }) => {
            const { id } = params;
            try {
                const fetched_profile = await Profile_1.default.getProfileById(id);
                try {
                    await bouncer.with('ProfilePolicy').authorize('viewList', fetched_profile);
                }
                catch (error) {
                    console.log('error');
                    return response.status(403).json({ error: error.message });
                }
                return fetched_profile;
            }
            catch (error) {
                console.error(error);
                return response.status(500).json({ error: error.message });
            }
        };
        this.update = async ({ auth, params, request, response, bouncer }) => {
            const { id } = params;
            const payload = await request.validate(ProfileUpdateValidator_1.default);
            let profile;
            try {
                profile = await Profile_1.default.findOrFail(id);
            }
            catch (error) {
                console.error(error);
                return response.status(500).json({ error: 'Profile Not Found' });
            }
            try {
                await bouncer.with('ProfilePolicy').authorize('update', profile);
            }
            catch (error) {
                console.log('error');
                return response.status(403).json({ error: error.message });
            }
            let user_dir = String(auth.user.id);
            let profile_picture = '';
            let new_image_name = '';
            if (payload.profile_picture) {
                new_image_name = `${(0, Helpers_1.cuid)()}.${payload.profile_picture.extname}`;
                profile_picture = path_1.default.posix.join(user_dir.toString(), new_image_name);
            }
            const trx = await Database_1.default.transaction();
            try {
                const updated_profile = await Profile_1.default.updateProfile({
                    id,
                    first_name: payload.first_name,
                    last_name: payload.last_name,
                    password: payload.password,
                    profile_picture: this.generateImageUrl(profile_picture),
                }, trx);
                if (payload.profile_picture) {
                    await payload.profile_picture.moveToDisk(user_dir, { name: new_image_name }, Env_1.default.get('DRIVE_DISK'));
                    if (profile.profile_picture) {
                        let img = profile.profile_picture;
                        let img_path = img.replace('http://localhost:3333/uploads/', '');
                        await Drive_1.default.delete(img_path);
                    }
                }
                await trx.commit();
                return updated_profile;
            }
            catch (error) {
                await trx.rollback();
                const uploaded = await Drive_1.default.exists(profile_picture);
                if (uploaded) {
                    const pic_path = profile.profile_picture.replace('http://127.0.0.1:3333/uploads/', '');
                    await Drive_1.default.delete(pic_path);
                }
                return response.status(500).json({ error: error.message });
            }
        };
    }
    generateImageUrl(imageName) {
        return `http://localhost:3333/uploads/${imageName}`;
    }
}
exports.default = ProfilesController;
//# sourceMappingURL=ProfilesController.js.map