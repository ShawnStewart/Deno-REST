import { HTTPMethods, Status } from "../deps.ts";

type Url = string | URL;
type Method = string | HTTPMethods;

export class InternalServerError extends Error {
  status: number;
  message: string;

  constructor(
    message =
      "The server encountered an internal error and was unable to complete your request",
    status = Status.InternalServerError,
  ) {
    super();

    this.name = this.constructor.name;
    this.status = status;
    this.message = message;
  }
}

export class ArgumentsError extends InternalServerError {
  fields: { [key: string]: string };

  constructor(fields: { [key: string]: string }) {
    super("Invalid arguments were provided", Status.BadRequest);

    this.fields = fields;
  }
}

export class AuthenticationError extends InternalServerError {
  constructor(message = "Invalid login credentials") {
    super(message, Status.BadRequest);
  }
}

export class EnvironmentVariableMissing extends InternalServerError {
  constructor(key: string) {
    super(`Missing environment variable: ${key}`, 0);
  }
}

export class InternalDatabaseError extends InternalServerError {
  constructor(error: Error) {
    super(error.message, 0);
  }
}

export class InvalidEndpointError extends InternalServerError {
  constructor(method: Method, url: Url) {
    super(`Could not route request: ${method} ${url}`, Status.NotFound);
  }
}

export class RequestBodyMissing extends InternalServerError {
  constructor(
    message = "The request was expected to have a body, but did not have one",
  ) {
    super(message, Status.BadRequest);
  }
}
