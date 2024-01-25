import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository } from './repository/product.repository';
import { Product } from './repository/product.entity';
import { ProductResponse } from './dto/product-response.dto';
import { CreateProduct, UpdateProduct } from './dto';
import { title } from 'process';
import { UserRepository } from '../user/repository/user.repository';
import { ProductMessages } from './enum';
import { DeleteFailed, UpdateFailed } from 'src/share/exceptions';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly userRepository: UserRepository,
  ) {}
  async getPaginatedProducts(
    page: number,
    count: number,
    userId?: number,
  ): Promise<[ProductResponse[], number]> {
    const [result, resultCount] =
      await this.productRepository.findPaginatedProducts(page, count, userId);
    const productResponse: ProductResponse[] = result.map((item) => ({
      title: item.title,
      description: item.description,
      owner: item.creator.email,
    }));
    return [productResponse, resultCount];
  }
  async createProduct(
    userId: number,
    dto: CreateProduct,
  ): Promise<ProductResponse> {
    const { title, description } = dto;
    const existProduct = await this.productRepository.findOne('title', title);
    if (existProduct) {
      throw new ConflictException(ProductMessages.DUPLICATED_PRODUCT);
    }
    const user = await this.userRepository.findOneById(userId);
    if (!user) {
      throw new BadRequestException(ProductMessages.INVALID_OWNER);
    }
    const response = await this.productRepository.createProduct(
      userId,
      title,
      description,
    );
    return {
      title: response.title,
      description: response.title,
      owner: user.email,
    };
  }
  async updateProduct(id: number, dto: UpdateProduct): Promise<void> {
    const existProduct = await this.productRepository.findOneById(id);
    if (!existProduct) {
      throw new NotFoundException(ProductMessages.NOT_FOUND);
    }
    if (dto.title) {
      const existTitle = await this.productRepository.findOne(
        'title',
        dto.title,
      );

      if (existTitle) {
        throw new ConflictException(ProductMessages.DUPLICATED_PRODUCT);
      }
    }
    const result = await this.productRepository.update(id, dto);
    if (!result.affected) {
      throw new UpdateFailed();
    }
  }
  async deleteProduct(id: number): Promise<void> {
    const existProduct = await this.productRepository.findOneById(id);
    if (!existProduct) {
      throw new NotFoundException(ProductMessages.NOT_FOUND);
    }
    const result = await this.productRepository.delete(id);
    if (!result.affected) {
      throw new DeleteFailed();
    }
  }
}
