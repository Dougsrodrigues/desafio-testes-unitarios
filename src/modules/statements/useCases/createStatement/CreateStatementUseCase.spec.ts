import faker from "faker";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

type SutTypes = {
  sut: CreateStatementUseCase;
  user_id: string;
};

const makeSut = async (): Promise<SutTypes> => {
  const inMemoryUsersRepository: InMemoryUsersRepository =
    new InMemoryUsersRepository();

  const inMemoryStatementsRepository: InMemoryStatementsRepository =
    new InMemoryStatementsRepository();

  const createUserUseCase: CreateUserUseCase = new CreateUserUseCase(
    inMemoryUsersRepository
  );

  const { id } = await createUserUseCase.execute({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  });

  const sut: CreateStatementUseCase = new CreateStatementUseCase(
    inMemoryUsersRepository,
    inMemoryStatementsRepository
  );

  return { sut, user_id: id ?? "" };
};

describe("CreateStatementUseCase", () => {
  it("Should be able to create one deposit", async () => {
    const { sut, user_id } = await makeSut();

    const deposit = await sut.execute({
      user_id,
      type: OperationType.DEPOSIT,
      amount: faker.datatype.number(),
      description: faker.lorem.words(),
    });

    expect(deposit).toBeTruthy();
    expect(deposit).toHaveProperty("id");
    expect(deposit.amount).toBeGreaterThan(0);
  });

  it("Should be able to create one withdraw if sufficient funds", async () => {
    const { sut, user_id } = await makeSut();

    await sut.execute({
      user_id,
      type: OperationType.DEPOSIT,
      amount: faker.datatype.number({ min: 100 }),
      description: faker.lorem.words(),
    });

    const withdraw = await sut.execute({
      user_id,
      type: OperationType.WITHDRAW,
      amount: faker.datatype.number({ max: 20 }),
      description: faker.lorem.words(),
    });

    expect(withdraw).toBeTruthy();
    expect(withdraw).toHaveProperty("id");
  });
});
