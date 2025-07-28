// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Connected to MongoDB via Prisma!');
    } catch (err) {
      console.error('❌ Failed to connect to MongoDB via Prisma:', err);
    }
  }
}
