import { InvalidValueObjectException } from '@core/exceptions/domain-exceptions';

export class ThrottleLimit {
  private constructor(
    private readonly ttl: number,
    private readonly limit: number,
  ) {
    if (ttl <= 0) {
      throw new InvalidValueObjectException('TTL must be a positive number');
    }

    if (limit <= 0) {
      throw new InvalidValueObjectException('Limit must be a positive number');
    }
  }

  static create(ttl: number, limit: number): ThrottleLimit {
    return new ThrottleLimit(ttl, limit);
  }

  static createDefault(): ThrottleLimit {
    return new ThrottleLimit(60, 60);
  }

  get getTtl(): number {
    return this.ttl;
  }

  get getLimit(): number {
    return this.limit;
  }

  toString(): string {
    return `${this.limit} requests per ${this.ttl} seconds`;
  }
}
