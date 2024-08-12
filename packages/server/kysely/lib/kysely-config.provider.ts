import { Provider } from "@nestjs/common";
import { KYSELY_CONFIG } from "./kysely.constants";
import { ConfigService } from "@atdb/server-config";
import { Logger } from "nestjs-pino";
import { CamelCasePlugin, KyselyConfig, LogEvent, PostgresDialect } from "kysely";
import { Pool } from "pg";

export const kyselyConfigProvider: Provider = {
  provide: KYSELY_CONFIG,
  inject: [ConfigService, Logger],
  useFactory: (config: ConfigService, logger: Logger): KyselyConfig => {
    const dbName = config.get("database.name", { infer: true });
    const dbUser = config.get("database.user", { infer: true });
    const dbPassword = config.get("database.password", { infer: true });
    const dbRef = config.get("database.ref", { infer: true });
    const dbPort = config.get("database.port", { infer: true });
    const dbRegion = config.get("database.region", { infer: true });

    const dbConfig = {
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: `postgres://${dbUser}.${dbRef}:${dbPassword}@aws-0-${dbRegion}.pooler.supabase.com:5432/postgres`,
        }),
      }),

      log: (event: LogEvent) => {
        logger.verbose({
          message: "Running Query",
          query: event.query.query,
          parameters: event.query.parameters,
          raw: event.query.sql,
        });

        if (event.level === "query") {
          logger.verbose({
            message: "Query Timing",
            duration: event.queryDurationMillis,
          });
        }

        if (event.level === "error") {
          logger.error({
            message: "Error running query",
            error: event.error,
          });
        }
      },

      plugins: [new CamelCasePlugin()],
    };

    logger.debug(`Connecting to database ${dbName} on host ${dbPort}`);
    return dbConfig;
  },
};
