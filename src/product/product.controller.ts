import { Body, Controller } from '@nestjs/common';

@Controller('product')
export class ProductController {
  constructor() {}
  @Post()
  createProduct(
    @Body('name') name: string,
    @Body('price') price: string,
    @Body('description') description?: string,
  ) {
    return this.productService.createProduct(name, price, description);
  }
}
