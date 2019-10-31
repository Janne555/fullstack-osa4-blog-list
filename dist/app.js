"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config = __importStar(require("./utils/config"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const blogs_1 = __importDefault(require("./controllers/blogs"));
const morgan_1 = __importDefault(require("morgan"));
const middleware_1 = require("./utils/middleware");
const logger = __importStar(require("./utils/logger"));
const users_1 = __importDefault(require("./controllers/users"));
const login_1 = __importDefault(require("./controllers/login"));
const app = express_1.default();
logger.info('connecting to', config.MONGODB_URI);
mongoose_1.default.set('useFindAndModify', false);
mongoose_1.default.connect(config.MONGODB_URI, { useNewUrlParser: true })
    .then(() => logger.info('connected to MongoDB'))
    .catch(error => logger.error('error connecting to mongoDB:', error.message));
morgan_1.default.token('post_body', (req) => {
    return req.headers['content-type'] && req.headers['content-type'].includes('application/json') ? JSON.stringify(req.body) : '';
});
app.use(cors_1.default());
// if (process.env.NODE_ENV !== 'test')
app.use(morgan_1.default(':method :url :status :res[content-length] - :response-time ms :post_body'));
app.use(express_1.default.static('build'));
app.use(body_parser_1.default.json());
app.use('/api/login', login_1.default);
app.use('/api/blog', blogs_1.default);
app.use('/api/user', users_1.default);
app.use(middleware_1.unknownEndpoint);
app.use(middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map