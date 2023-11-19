export class EmptyResultSetError extends Error {
  constructor(message = "Empty result set") {
    super(message);
    this.name = "EmptyResultSetError";
  }
}