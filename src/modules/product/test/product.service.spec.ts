import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../product.service';
import { ConfigModuleConf, TypeOrmModuleConf } from 'src/share';
import { RedisModuleConf } from 'src/share/config/modules/redis-module.conf';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../repository/product.entity';
import { UserModule } from 'src/modules/user/user.module';
import { CommonModule } from 'src/modules/common/common.module';
import { ProductRepository } from '../repository/product.repository';
import { UserRepository } from 'src/modules/user/repository';
import { CreateProduct, ProductResponse, UpdateProduct } from '../dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ProductMessages } from '../enum';
import { UpdateFailed } from 'src/share/exceptions';

describe('ProductService', () => {
  let productService: ProductService;
  let productRepository: ProductRepository;
  let userRepository: UserRepository;
  const productRepositoryMock = {
    findPaginatedProducts: jest.fn(),
    createProduct: jest.fn(),
    findOne: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
  };
  const userRepositoryMock = {
    findOneById: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModuleConf,
        TypeOrmModuleConf,
        RedisModuleConf,
        TypeOrmModule.forFeature([Product]),
        UserModule,
        CommonModule,
      ],
      providers: [ProductService, ProductRepository],
    })
      .overrideProvider(ProductRepository)
      .useValue(productRepositoryMock)
      .overrideProvider(UserRepository)
      .useValue(userRepositoryMock)
      .compile();

    productService = module.get<ProductService>(ProductService);
    productRepository = module.get<ProductRepository>(ProductRepository);
    userRepository = module.get<UserRepository>(UserRepository);
  });
  it('ProductService should be defined', () => {
    expect(ProductService).toBeDefined();
  });
  describe('getPaginatedProducts', () => {
    const sampleProducts = [
      {
        title: 'Product 1',
        description: 'Description 1',
        creator: { email: 'user1@example.com' },
      },
      {
        title: 'Product 2',
        description: 'Description 2',
        creator: { email: 'user2@example.com' },
      },
    ];
    const sampleProductResult = [
      {
        title: 'Product 1',
        description: 'Description 1',
        owner: 'user1@example.com',
      },
      {
        title: 'Product 2',
        description: 'Description 2',
        owner: 'user2@example.com',
      },
    ];
    it('should return paginated products with user owner', async () => {
      const page = 1;
      const count = 10;
      const userId = 1;

      const sampleResultCount = 2;
      productRepositoryMock.findPaginatedProducts.mockResolvedValue([
        sampleProducts,
        sampleResultCount,
      ]);

      const [products, resultCount] = await productService.getPaginatedProducts(
        page,
        count,
        userId,
      );

      expect(products).toEqual(sampleProductResult);
      expect(resultCount).toEqual(sampleResultCount);
      expect(productRepositoryMock.findPaginatedProducts).toHaveBeenCalledWith(
        page,
        count,
        userId,
      );
    });

    it('should return paginated products without user owner', async () => {
      const page = 1;
      const count = 10;

      const sampleResultCount = 2;
      productRepositoryMock.findPaginatedProducts.mockResolvedValue([
        sampleProducts,
        sampleResultCount,
      ]);

      const [products, resultCount] = await productService.getPaginatedProducts(
        page,
        count,
      );

      expect(products).toEqual(sampleProductResult);
      expect(resultCount).toEqual(sampleResultCount);
      expect(productRepositoryMock.findPaginatedProducts).toHaveBeenCalledWith(
        page,
        count,
        undefined,
      );
    });
  });
  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      const userId = 1;
      const createProductDto: CreateProduct = {
        title: 'New Product',
        description: 'Product Description',
      };

      const createProductResponse = {
        title: 'New Product',
        description: 'Product Description',
        owner: 'user@example.com',
      };

      userRepositoryMock.findOneById.mockResolvedValue({
        email: 'user@example.com',
      });
      productRepositoryMock.findOne.mockResolvedValue(null);
      productRepositoryMock.createProduct.mockResolvedValue(
        createProductResponse,
      );

      const result: ProductResponse = await productService.createProduct(
        userId,
        createProductDto,
      );

      expect(result).toEqual(createProductResponse);
      expect(userRepositoryMock.findOneById).toHaveBeenCalledWith(userId);
      expect(productRepositoryMock.findOne).toHaveBeenCalledWith(
        'title',
        createProductDto.title,
      );
      expect(productRepositoryMock.createProduct).toHaveBeenCalledWith(
        userId,
        createProductDto.title,
        createProductDto.description,
      );
    });

    it('should fail if the product already exists', async () => {
      const userId = 1;
      const createProductDto: CreateProduct = {
        title: 'Existing Product',
        description: 'Product Description',
      };

      productRepositoryMock.findOne.mockResolvedValue({
        title: 'Existing Product',
      });

      userRepositoryMock.findOneById.mockResolvedValue({
        email: 'user@example.com',
      });

      await expect(
        productService.createProduct(userId, createProductDto),
      ).rejects.toThrow(ConflictException);
      expect(productRepositoryMock.findOne).toHaveBeenCalledWith(
        'title',
        createProductDto.title,
      );
    });

    it('should fail if the user does not exist', async () => {
      const userId = 1;
      const createProductDto: CreateProduct = {
        title: 'New Product',
        description: 'Product Description',
      };
      productRepositoryMock.findOne.mockResolvedValue(null);
      userRepositoryMock.findOneById.mockResolvedValue(null);

      await expect(
        productService.createProduct(userId, createProductDto),
      ).rejects.toThrow(BadRequestException);
      expect(userRepositoryMock.findOneById).toHaveBeenCalledWith(userId);
    });
  });
  describe('UpdateProduct', () => {
    it('should update a product successfully', async () => {
      const id = 1;
      const dto: UpdateProduct = {
        title: 'New Title',
        description: 'New Description',
      };

      productRepositoryMock.findOneById.mockResolvedValue({
        id,
        title: 'Old Title',
        description: 'Old Description',
      });
      productRepositoryMock.findOne.mockResolvedValue(null);
      productRepositoryMock.update.mockResolvedValue({ affected: 1 });

      await productService.updateProduct(id, dto);

      expect(productRepositoryMock.findOneById).toHaveBeenCalledWith(id);
      expect(productRepositoryMock.findOne).toHaveBeenCalledWith(
        'title',
        dto.title,
      );
      expect(productRepositoryMock.update).toHaveBeenCalledWith(id, dto);
    });

    it('should fail when product does not exist', async () => {
      const id = 1;
      const dto: UpdateProduct = {
        title: 'New Title',
        description: 'New Description',
      };

      productRepositoryMock.findOneById.mockResolvedValue(null);

      await expect(productService.updateProduct(id, dto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(productService.updateProduct(id, dto)).rejects.toMatchObject(
        {
          message: ProductMessages.NOT_FOUND,
        },
      );

      expect(productRepositoryMock.findOneById).toHaveBeenCalledWith(id);
      expect(productRepositoryMock.findOne).toHaveBeenCalledTimes(4);
    });

    it('should fail when updating to a duplicate title', async () => {
      const id = 1;
      const dto: UpdateProduct = {
        title: 'New Title',
        description: 'New Description',
      };

      productRepositoryMock.findOneById.mockResolvedValue({
        id,
        title: 'Old Title',
        description: 'Old Description',
      });
      productRepositoryMock.findOne.mockResolvedValue({
        id: 2,
        title: 'New Title',
      });

      await expect(productService.updateProduct(id, dto)).rejects.toThrowError(
        ConflictException,
      );
      await expect(productService.updateProduct(id, dto)).rejects.toThrowError(
        ProductMessages.DUPLICATED_PRODUCT,
      );

      expect(productRepositoryMock.findOneById).toHaveBeenCalledWith(id);
      expect(productRepositoryMock.findOne).toHaveBeenCalledWith(
        'title',
        dto.title,
      );
    });

    it('should fail when the update operation fails', async () => {
      const id = 1;
      const dto: UpdateProduct = {
        title: 'New Title',
        description: 'New Description',
      };

      productRepositoryMock.findOneById.mockResolvedValue({
        id,
        title: 'Old Title',
        description: 'Old Description',
      });
      productRepositoryMock.findOne.mockResolvedValue(null);
      productRepositoryMock.update.mockResolvedValue({ affected: 0 });

      await expect(productService.updateProduct(id, dto)).rejects.toThrowError(
        UpdateFailed,
      );

      expect(productRepositoryMock.findOneById).toHaveBeenCalledWith(id);
      expect(productRepositoryMock.findOne).toHaveBeenCalledWith(
        'title',
        dto.title,
      );
      expect(productRepositoryMock.update).toHaveBeenCalledWith(id, dto);
    });
  });
});
