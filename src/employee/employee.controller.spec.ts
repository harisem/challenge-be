import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';

describe('EmployeeController', () => {
  let employee: EmployeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      employees: [EmployeeController],
    }).compile();

    employee = module.get<EmployeeController>(EmployeeController);
  });

  it('should be defined', () => {
    expect(employee).toBeDefined();
  });
});
