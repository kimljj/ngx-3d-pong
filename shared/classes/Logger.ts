export class Logger {
    static log(message: string): void {
        console.log(`[log]: ${message}`);
    }

    static userLog(user: string, message: string): void {
        console.log(`[log] [${user}]: ${message}`);
    }

    static warn(message: string): void {
        console.log(`[warn]: ${message}`);
    }

    static error(message: string): void {
        console.log(`[ERROR]: ${message}`);
    }
}
