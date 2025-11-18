"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield core_1.NestFactory.create(app_module_1.AppModule, {
            bodyParser: true,
        });
        const allowedOrigin = process.env.ALLOWED_ORIGIN;
        app.enableCors({
            origin: allowedOrigin,
            credentials: true,
        });
        app.use((0, cookie_parser_1.default)());
        app.useGlobalPipes(new common_1.ValidationPipe({
            transform: true,
            whitelist: true,
        }));
        const port = process.env.HTTP_PORT || 3000;
        yield app.listen(port);
        console.log(`Server is running on port ${port}`);
        console.log('Connected to the database successfully');
    });
}
bootstrap().catch((error) => {
    console.error('Error starting the server:', error);
    process.exit(1);
});
//# sourceMappingURL=main.js.map