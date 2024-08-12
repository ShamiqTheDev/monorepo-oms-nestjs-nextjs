// import "reflect-metadata";

import { INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@atdb/server-config";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app/app.module.js";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

async function createApp() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  console.log("Initializing server app");

  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(Logger));
  app.use(helmet());
  app.use(cookieParser());
  app.use(bodyParser.json({ limit: "10mb" }));

  app.getHttpAdapter().getInstance().set("trust proxy", true);

  const config = app.get<ConfigService>(ConfigService);
  const cors = config.get("cors", { infer: true });

  app.enableCors({
    origin: cors,
  });

  return app;
}

export let viteNodeApp: Promise<INestApplication<any>>;

if (import.meta.env.PROD) {
  const bootstrapProd = async () => {
    const app = await createApp();
    const config = app.get<ConfigService>(ConfigService);
    const port = 3333 || config.get("port", { infer: true });

    await app.listen(port, () => {
      console.info("Listening at http://localhost:" + port);
    });
  };

  bootstrapProd();
} else {
  viteNodeApp = createApp();
}
