import path from 'path';
import { fileURLToPath } from 'url';
import { withThepopebot } from 'thepopebot/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default withThepopebot({
    outputFileTracingRoot: __dirname,
});
