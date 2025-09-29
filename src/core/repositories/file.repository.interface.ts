import { File } from '../entities/file.entity';

/**
 * File repository interface
 *
 * Implementations:
 * - {@link FileRepository} - Production Prisma/PostgreSQL implementation
 */
export interface IFileRepository {
  findById(id: string): Promise<File | null>;
  findByUserId(userId: string): Promise<File[]>;
  findAll(page?: number, limit?: number): Promise<{ files: File[]; total: number }>;
  save(file: File): Promise<File>;
  update(file: File): Promise<File>;
  delete(id: string): Promise<void>;
  findByPath(path: string): Promise<File | null>;
}
