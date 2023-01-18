import { APP_TIMEOUT } from "../shared/constants/timeout.constant";

export const CONNECTION_DB = {
  client: "mysql",
  connection: {
    host: "sql566.main-hosting.eu",
    port: "3306",
    user: "u371677739_sa",
    password: "Laranja10",
    database: "u371677739_challengeBD",
    connectTimeout: APP_TIMEOUT,
  },
};

export const CONNECTION_DB_DEV = {
  client: "mysql",
  connection: {
    host: "sql566.main-hosting.eu",
    port: "3306",
    user: "u371677739_dev",
    password: "Laranja10",
    database: "u371677739_challengeDEV",
    connectTimeout: APP_TIMEOUT,
  },
};
