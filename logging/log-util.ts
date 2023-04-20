
import logLevelData from "../log-level";
import pino from "pino";

const logLevels = new Map(Object.entries(logLevelData));

export function getLogLevel(logger: string) {
    return logLevels.get(logger) || logLevels.get("*") || "info";
}

export function getLogger(name: string) {
    return pino({ name, level: getLogLevel(name) });
}