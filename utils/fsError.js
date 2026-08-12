import fs from 'fs';

function ErrorLog(error, context = '') {
    const message = error instanceof Error ? error.stack || error.message : String(error);
    const line = `[${new Date().toISOString()}]${context ? ` [${context}]` : ''} ${message}\n`;
    console.error(line.trim());
    fs.appendFile('./errorlog.log', line, (writeError) => {
        if (writeError) console.error('[ErrorLog] failed to write log:', writeError.message);
    });
}
export default ErrorLog;
