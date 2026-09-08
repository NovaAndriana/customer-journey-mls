import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './dto/auth.service';
import { PrismaService } from '../../prisma/prisma.service.js';
import { JwtService } from '@nestjs/jwt';
import { vi, describe, beforeEach, it, expect } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: { user: { findUnique: vi.fn() } },
        },
        {
          provide: JwtService,
          useValue: { signAsync: vi.fn().mockResolvedValue('mock_token') },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});