/* Copyright (c) 2022 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "./IRequestOptions.js";

/**
 * There are 5 potential error codes that might be thrown by {@linkcode ArcGISTokenRequestError}. 2 of these codes are used by both
 * {@linkcode ArcGISIdentityManager} or {@linkcode ApplicationCredentialsManager}:
 *
 * * `TOKEN_REFRESH_FAILED` - When a request for an new access token fails.
 * * `UNKNOWN_ERROR_CODE` - The error is unknown. More information may be available in {@linkcode ArcGISTokenRequestError.response}
 *
 * The 3 remaining error codes will only be thrown when using {@linkcode ArcGISIdentityManager}:
 *
 * * `GENERATE_TOKEN_FOR_SERVER_FAILED` - When a request for a token for a specific federated server fails.
 * * `REFRESH_TOKEN_EXCHANGE_FAILED` - When a request for a new refresh token fails.
 * * `NOT_FEDERATED` - When the requested server isn't federated with the portal specified in {@linkcode ArcGISIdentityManager.portal}.
 */
export enum ArcGISTokenRequestErrorCodes {
  TOKEN_REFRESH_FAILED = "TOKEN_REFRESH_FAILED",
  GENERATE_TOKEN_FOR_SERVER_FAILED = "GENERATE_TOKEN_FOR_SERVER_FAILED",
  REFRESH_TOKEN_EXCHANGE_FAILED = "REFRESH_TOKEN_EXCHANGE_FAILED",
  NOT_FEDERATED = "NOT_FEDERATED",
  UNKNOWN_ERROR_CODE = "UNKNOWN_ERROR_CODE"
}

/**
 * This error is thrown when {@linkcode ArcGISIdentityManager} or {@linkcode ApplicationCredentialsManager} fails to refresh a token or generate a new token
 * for a request. Generally in this scenario the credentials are invalid for the request and the you should recreate the {@linkcode ApplicationCredentialsManager}
 * or prompt the user to authenticate again with {@linkcode ArcGISIdentityManager}. See {@linkcode ArcGISTokenRequestErrorCodes} for a more detailed description of
 * the possible error codes.
 *
 * ```js
 * request(someUrl, {
 *   authentication: someAuthenticationManager
 * }).catch(e => {
 *   if(e.name === "ArcGISTokenRequestError") {
 *     // ArcGIS REST JS could not generate an appropriate token for this request
 *     // All credentials are likely invalid and the authentication process should be restarted
 *   }
 * })
 * ```
 */
export class ArcGISTokenRequestError extends Error {
  /**
   * The name of this error. Will always be `"ArcGISTokenRequestError"` to conform with the [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) class.
   */
  public name: string;

  /**
   * Formatted error message. See the [`Error`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) class for more details.
   */
  public message: string;

  /**
   * The error message return from the request.
   */
  public originalMessage: string;

  /**
   * The error code for the request.
   */
  public code: ArcGISTokenRequestErrorCodes;

  /**
   * The original JSON response the caused the error.
   */
  public response: any;

  /**
   * The URL of the original request that caused the error
   */
  public url: string;

  /**
   * The options of the original request that caused the error
   */
  public options: IRequestOptions;

  /**
   * Create a new `ArcGISTokenRequestError`  object.
   *
   * @param message - The error message from the API
   * @param code - The error code from the API
   * @param response - The original response from the API that caused the error
   * @param url - The original url of the request
   * @param options - The original options and parameters of the request
   */
  constructor(
    message = "UNKNOWN_ERROR",
    code = ArcGISTokenRequestErrorCodes.UNKNOWN_ERROR_CODE,
    response?: any,
    url?: string,
    options?: IRequestOptions
  ) {
    // 'Error' breaks prototype chain here
    super(message);

    // restore prototype chain, see https://stackoverflow.com/questions/41102060/typescript-extending-error-class
    // we don't need to check for Object.setPrototypeOf as in the answers because we are ES2017 now.
    // Also see https://github.com/Microsoft/TypeScript-wiki/blob/main/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    // and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error#custom_error_types
    const actualProto = new.target.prototype;
    Object.setPrototypeOf(this, actualProto);

    this.name = "ArcGISTokenRequestError";
    this.message = `${code}: ${message}`;
    this.originalMessage = message;
    this.code = code;
    this.response = response;
    this.url = url;
    this.options = options;
  }
}
