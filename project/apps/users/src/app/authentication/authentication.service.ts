import { ConflictException, HttpException, HttpStatus, Inject, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../user/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { AUTH_USER_EXISTS, AUTH_USER_NOT_FOUND, AUTH_USER_PASSWORD_WRONG } from './authentication.constant';
import { UserEntity } from '../user/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { Token, User,} from '@project/shared/app/types';
import { JwtService } from '@nestjs/jwt';
import { jwtConfig } from '@project/shared/config/users';
import { ConfigType } from '@nestjs/config';
import { createJWTPayload } from '@project/shared/helpers';

@Injectable()
export class AuthenticationService {
    private readonly logger = new Logger(AuthenticationService.name);

    constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    @Inject (jwtConfig.KEY) private readonly jwtOptions: ConfigType<typeof jwtConfig>,
  ) {}

  public async register(dto: CreateUserDto) {
    const {email, name, password} = dto;

    const user = {
      email, name, avatar: '', passwordHash: '', postsCount: 0, followers: 0, following: 0, dateRegistry: new Date
    };

    const existUser = await this.userRepository
      .findByEmail(email);

    if (existUser) {
      throw new ConflictException(AUTH_USER_EXISTS);
    }

    const userEntity = await new UserEntity(user)
      .setPassword(password)

    return this.userRepository
      .save(userEntity);
  }

  public async verifyUser(dto: LoginUserDto) {
    const {email, password} = dto;
    const existUser = await this.userRepository.findByEmail(email);

    if (!existUser) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }

    if (!await existUser.comparePassword(password)) {
      throw new UnauthorizedException(AUTH_USER_PASSWORD_WRONG);
    }

    return existUser;
  }

  public async getUser(id: string) {
    const existUser = await this.userRepository.findById(id);

    if (! existUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return existUser;
  }

  public async getUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findByEmail(email);

    if (! user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  public async createUserToken(user: User): Promise<Token> {
    const accessTokenPayload = createJWTPayload(user);
    const refreshTokenPayload = { ...accessTokenPayload, tokenId: crypto.randomUUID() };

    try {
      const accessToken = await this.jwtService.signAsync(accessTokenPayload);
      const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.jwtOptions.refreshTokenSecret,
        expiresIn: this.jwtOptions.refreshTokenExpiresIn
      });
      return { accessToken, refreshToken };
    } catch (error) {
      this.logger.error('[Token generation error]: ' + error.message);
      throw new HttpException('Ошибка при создании токена.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async changePassword(
    userId: string,
    dto: { currentPassword: string; newPassword: string }
  ) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }

    const isPasswordValid = await user.comparePassword(dto.currentPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_USER_PASSWORD_WRONG);
    }

    await user.setPassword(dto.newPassword);
    await this.userRepository.update(userId, user);
  }
}
