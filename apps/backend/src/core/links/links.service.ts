import { Injectable } from '@nestjs/common';
import { EntityService } from '../entity.service';
import { Link, Prisma, PrismaService } from '@reduced.to/prisma';
import { AppConfigService } from '@reduced.to/config';

@Injectable()
export class LinksService extends EntityService<Link> {
  constructor(configService: AppConfigService, prismaService: PrismaService) {
    super(configService, prismaService);
  }

  get model(): string {
    return 'link';
  }

  get selectFields(): Partial<Record<keyof Prisma.LinkWhereInput, boolean>> {
    return {
      id: true,
      url: true,
      key: true,
      clicks: true,
      description: true,
      utm: true,
      expirationTime: true,
      createdAt: true,
    };
  }

  get filterFields(): Partial<Record<keyof Prisma.LinkWhereInput, boolean>> {
    return {
      url: true,
      key: true,
    };
  }

  totalLinks(opts: Prisma.LinkWhereInput): Promise<number> {
    return this.prismaService.link.count({
      where: opts
    });
  }

  findBy(opts: Prisma.LinkWhereInput): Promise<Link> {
    return this.prismaService.link.findFirst({
      where: opts,
    });
  }

  delete(id: string): Promise<Link> {
    return this.prismaService.link.delete({
      where: {
        id,
      },
      include: {
        visit: true,
      },
    });
  }
}
