export const morgan = (app) => {
  if (NODE_ENV === "production") {
    app.use(
      morgan("combined", {
        stream: { write: (message) => logger.info(message.trim()) },
      })
    );
  } else {
    app.use(morgan("dev"));
  }
};
