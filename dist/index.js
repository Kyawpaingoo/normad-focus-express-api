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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const prisma_1 = __importDefault(require("./prisma"));
const authRouter_1 = __importDefault(require("./router/authRouter"));
const expenseRouter_1 = __importDefault(require("./router/expenseRouter"));
const taskRouter_1 = __importDefault(require("./router/taskRouter"));
const meetingScheduleRouter_1 = __importDefault(require("./router/meetingScheduleRouter"));
const countryLogRouter_1 = __importDefault(require("./router/countryLogRouter"));
const imageUploadRouter_1 = __importDefault(require("./router/imageUploadRouter"));
const body_parser_1 = __importDefault(require("body-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const allowedOrigin = process.env.ALLOWED_ORIGIN;
app.use((0, cors_1.default)({
    origin: allowedOrigin,
    credentials: true
}));
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({ limit: '50mb', extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, express_fileupload_1.default)());
const port = process.env.HTTP_PORT;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            app.use('/api/auth', authRouter_1.default);
            app.use('/api/expense', expenseRouter_1.default);
            app.use('/api/task', taskRouter_1.default);
            app.use('/api/meeting-schedule', meetingScheduleRouter_1.default);
            app.use('/api/country-log', countryLogRouter_1.default);
            app.use('/api/image', imageUploadRouter_1.default);
            app.listen(port, () => {
                console.log(`Server is running on port ${port}`);
            });
            yield prisma_1.default.$connect();
            console.log('Connected to the database successfully');
        }
        catch (error) {
            console.error('Error starting the server:', error);
            yield prisma_1.default.$disconnect();
            process.exit(1);
        }
    });
}
main();
//# sourceMappingURL=index.js.map