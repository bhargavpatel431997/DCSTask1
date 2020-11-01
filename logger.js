const log4js = require("log4js");
var logger = log4js.getLogger();
logger.level = "debug";


module.exports = (object, type = 'info') => {
    if (type == "info")
        logger.info("|" + object.fileName + "|" + object.methodName + "|" + object.logMsg);
    else
        logger.error("|" + object.fileName + "|" + object.methodName + "|" + object.logMsg);
}
