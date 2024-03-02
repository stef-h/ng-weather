import { formatDate } from "@angular/common";
import { Inject, Injectable, InjectionToken } from "@angular/core";

export enum LogLevel {
  ALL = 0,
  DEBUG = 10,
  INFO = 20,
  WARN = 30,
  ERROR = 40,
  FATAL = 50,
  OFF = 100,
}

export const LOG_LEVEL = new InjectionToken<LogLevel>("Log level token", {
  providedIn: "root",
  factory: () => LogLevel.ERROR,
});

@Injectable({
  providedIn: "root",
})
export class LoggingService {
  static DATE_FORMAT = "yyyy-MM-dd HH:mm:ss";
  static LOCALE = "en-US";

  constructor(@Inject(LOG_LEVEL) private logLevel: LogLevel) {}

  debug(msg: string) {
    this.log(msg, LogLevel.DEBUG);
  }

  info(msg: string) {
    this.log(msg, LogLevel.INFO);
  }

  warn(msg: string) {
    this.log(msg, LogLevel.WARN);
  }

  error(msg: string) {
    this.log(msg, LogLevel.ERROR);
  }

  fatal(msg: string) {
    this.log(msg, LogLevel.FATAL);
  }

  private log(msg: string, level: LogLevel) {
    if (level >= this.logLevel)
      console.log(`${this.getStringDate()}: ${LogLevel[level]} ${msg}`);
  }

  private getStringDate(): string {
    return formatDate(
      new Date(),
      LoggingService.DATE_FORMAT,
      LoggingService.LOCALE
    );
  }
}
