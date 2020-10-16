export class DeserializeNullException extends Error {
    message: string;

    constructor(message: string) {
      super();
      this.message = message;
      this.name = 'DeserializeNullException';
    }
}

export class HttpRequestException extends Error {
    message: string;

    httpErrorCode: number;

    errorCode: string | undefined;

    constructor(httpErrorCode: number, message: string, errorCode: string = undefined) {
      super();
      this.name = 'HttpRequestException';
      this.httpErrorCode = httpErrorCode;
      this.message = message;
      this.errorCode = errorCode;
    }
}
