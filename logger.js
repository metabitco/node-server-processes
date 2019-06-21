
const padLeft = (month) => month < 10 ? '0' + month : month;
const formatDate = () => {
    const now = new Date;
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    return [
        year,
        padLeft(month),
        padLeft(day),
    ].join('/') + ' ' + [
        padLeft(hour),
        padLeft(minutes),
        padLeft(seconds),
    ].join(':')
};
const nginxFormat = info => formatDate() + ` [${info.level}] ${process.pid}: ${info.message}`;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    defaultMeta: {service: 'user-service'},
    transports: [
        new winston.transports.File({
            filename: path.join(LOG_DIR, 'error.log'),
            level: 'error',
            format: format.combine(
                format.splat(),
                format.printf(nginxFormat)
            )
        }),
        new winston.transports.Console({
            format: format.combine(
                format.splat(),
                format.printf(nginxFormat)
            )
        }),
    ]
});

module.exports = logger;