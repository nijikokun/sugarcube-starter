import { createRequire } from "module";
const require = createRequire(import.meta.url);
export const config = require("../config.json");