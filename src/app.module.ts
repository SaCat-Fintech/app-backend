import { Module } from '@nestjs/common';
import { ProcessesModule } from './processes/processes.module';

@Module({
  imports: [ProcessesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
