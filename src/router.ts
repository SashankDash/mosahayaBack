import * as Hapi from '@hapi/hapi';
import RegistrationRoutes from './api/registration/routes';
import EnrollmentRoutes from './api/enrollment/routes';
import AdminRoutes from './api/admin/routes';
import SeverHealthRoutes from './api/health';
import SeverFileRoutes from './api/file';
import SkillRoutes from './api/skill/routes';
import EmployerRoutes from './api/employer/routes';
import EmployeeRoutes from './api/employee/routes';
import BusinessUserRoutes from './api/business/businessUser/routes';
import ProjectRoutes from './api/business/project/routes';
import Logger from './helper/logger';

class Router {
    public loadRoutes =  async (server: Hapi.Server): Promise<any> => {
        try {
            Logger.info('Router - Start adding routes.');
            await SeverHealthRoutes.register(server);
            await SeverFileRoutes.register(server);
            await RegistrationRoutes.register(server);
            await EnrollmentRoutes.register(server);
            await AdminRoutes.register(server);
            await SkillRoutes.register(server);
            await EmployerRoutes.register(server);
            await EmployeeRoutes.register(server);
            await BusinessUserRoutes.register(server);
            await ProjectRoutes.register(server);
            Logger.info('Router - Finish adding routes.');
        } catch (error) {
            Logger.error(`Error in loading routers: `, error);
            throw error;
        }
    };
}
export default new Router();
