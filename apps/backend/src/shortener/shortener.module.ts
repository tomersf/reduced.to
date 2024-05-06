import { Module } from '@nestjs/common';
import { ShortenerController } from './shortener.controller';
import { ShortenerService } from './shortener.service';
import { PrismaModule } from '@reduced.to/prisma';
import { ShortenerProducer } from './producer/shortener.producer';
import { QueueManagerModule, QueueManagerService } from '@reduced.to/queue-manager';
import { SafeUrlModule } from '@reduced.to/safe-url';
import { LinksModule } from '../core/links/links.module';

@Module({
  imports: [PrismaModule, QueueManagerModule, SafeUrlModule.forRootAsync(), LinksModule],
  controllers: [ShortenerController],
  providers: [ShortenerService, QueueManagerService, ShortenerProducer],
  exports: [ShortenerService],
})
export class ShortenerModule { }
