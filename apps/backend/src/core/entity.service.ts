import { PrismaService } from '@reduced.to/prisma';
import { IPaginationOptions, IPaginationResult, orderByBuilder } from '../shared/utils';
import { SortOrder } from '../shared/enums/sort-order.enum';
import { filterBuilder } from '../shared/utils';
import { AppConfigService } from '@reduced.to/config';

export abstract class EntityService<Entity> {
  constructor(readonly configService: AppConfigService, readonly prismaService: PrismaService) { }

  abstract get model(): string;
  abstract get filterFields(): Record<keyof any, any>;
  abstract get selectFields(): Record<keyof any, boolean>;

  findAll = async (options: IFindAllOptions): Promise<IPaginationResult<Entity>> => {
    const { skip, limit, filter, sort, extraWhereClause } = options;


    const FILTER_CLAUSE = {};
    const ORDER_BY_CLAUSE = orderByBuilder<Partial<Entity>>(sort as any);

    if (filter) {
      Object.assign(FILTER_CLAUSE, { OR: filterBuilder(this.filterFields, filter) });
    }

    Object.entries(extraWhereClause || {}).forEach(([key, value]) => {
      if (value) {
        Object.assign(FILTER_CLAUSE, { [key]: value });
      }
    });

    const [total, data] = await this.prismaService.$transaction([
      this.prismaService[this.model].count({
        ...((filter || extraWhereClause) && {
          where: FILTER_CLAUSE,
        }),
      }),
      this.prismaService[this.model].findMany({
        select: this.selectFields,
        ...(skip && { skip }),
        take: limit,
        ...((filter || extraWhereClause) && {
          where: FILTER_CLAUSE,
        }),
        ...(sort && {
          orderBy: ORDER_BY_CLAUSE,
        }),
      }),
    ]);

    return {
      total,
      data,
      remainingUrlsCount: Math.max(this.configService.getConfig().general.urlLimitCounter - total, 0)
    };
  };
}

export interface IFindAllOptions extends IPaginationOptions {
  filter?: string;
  sort?: Record<string, SortOrder>;
  extraWhereClause?: Record<string, any>;
}
