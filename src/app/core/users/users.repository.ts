import { POSTGRE_CONNECTION } from '@/common/const/config';
import { type DatabasePool } from '@/database/provider/postgresql.provider';
import { users } from '@/database/schema';
import { Inject, Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';

export type DataUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: string;
};
@Injectable()
export class UsersRepository {
  private _entityName = 'users';
  constructor(
    @Inject(POSTGRE_CONNECTION)
    private readonly db: DatabasePool,
  ) {}

  async findAll() {
    const result = await this.db.query.users.findMany({
      columns: { password: false },
      where: and(isNull(users.deletedAt)),
      with: { role: true },
    });
    return result;
  }

  async findByEmail(email: string) {
    const result = await this.db.query.users.findFirst({
      where: and(eq(users.email, email), isNull(users.deletedAt)),
      with: { role: true },
    });
    return result;
  }

  async store(data: DataUser) {
    const [user] = await this.db
      .insert(users)
      .values({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        roleId: data.roleId,
      })
      .returning();
    return user;
  }
}
