import { HTTPMethods, Status } from "../deps.ts";

type Url = string | URL;
type Method = string | HTTPMethods;

export class InternalServerError extends Error {
  status: number;
  message: string;

  constructor(
    status = Status.InternalServerError,
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
  constructor(method: Method, url: Url) {
    super(Status.NotFound, `Could not route request: ${method} ${url}`);
  }
}
