type Url = string | URL;

export class InternalServerError extends Error {
  status: number;
  message: string;

  constructor(
    status = 500,
    message =
      "The server encountered an internal error and was unable to complete your request",
  ) {
    super();

    this.name = this.constructor.name;
    this.status = status;
    this.message = message;
  }
}

export class InvalidEndpointError extends InternalServerError {
  constructor(url: Url) {
    super(404, `${url} is not a valid endpoint`);
  }
}
