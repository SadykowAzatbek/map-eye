import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users/users.controller';
import { AuthService } from './auth/auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './auth/local.strategy';
import { TokenAuthGuard } from './auth/token-auth.guard';
import { InstitutionsController } from './institutions/institutions.controller';
import { Institution, InstitutionSchema } from './schemas/institution.schema';
import { PermitGuard } from './auth/permit.guard';
import { ReviewController } from './review/review.controller';
import { Review, ReviewSchema } from './schemas/review.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/map'),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Institution.name, schema: InstitutionSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    PassportModule,
  ],
  controllers: [
    AppController,
    UsersController,
    InstitutionsController,
    ReviewController,
  ],
  providers: [
    AppService,
    AuthService,
    LocalStrategy,
    TokenAuthGuard,
    PermitGuard,
  ],
})
export class AppModule {}
