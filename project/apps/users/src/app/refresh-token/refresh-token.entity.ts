import { JwtToken } from '@project/shared/app/types';
import { Entity } from '@project/shared/core';

export class RefreshTokenEntity implements JwtToken, Entity<string>{
  public createdAt: Date;
  public expiresIn: Date;
  public id: string;
  public tokenId: string;
  public userId: string;
  [key: string]: unknown;

  constructor(refreshToken: JwtToken) {
    this.populate(refreshToken);
  }

  public populate(data: JwtToken): void {
    this.createdAt = data.createdAt;
    this.expiresIn = data.expiresIn;
    this.id = data.id;
    this.tokenId = data.tokenId;
    this.userId = data.userId;
  }

  public toPOJO() {
    return {
      id: this.id,
      userId: this.userId,
      tokenId: this.tokenId,
      createdAt: this.createdAt,
      expiresIn: this.expiresIn,
    }
  }

  static fromObject(data: JwtToken): RefreshTokenEntity {
    return new RefreshTokenEntity(data);
  }
}
