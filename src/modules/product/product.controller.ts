import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller({
  path: 'product',
  version: '1',
})
export class ProductController {
  constructor(private readonly authService: ProductService) {}
}
