import faker from "faker";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType, Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

type SutTypes = {
  sut: GetStatementOperationUseCase;
  statement_id: string;
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

  const createStatementUseCase: CreateStatementUseCase =
    new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );

  const sut: GetStatementOperationUseCase = new GetStatementOperationUseCase(
    inMemoryUsersRepository,
    inMemoryStatementsRepository
  );

  const user = await createUserUseCase.execute({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  });

  const user_id = user.id ?? "";

  const statement = await createStatementUseCase.execute({
    user_id,
    type: OperationType.DEPOSIT,
    amount: faker.datatype.number({ min: 100 }),
    description: faker.lorem.words(),
  });

  const statement_id = statement.id ?? "";

  return { sut, statement_id, user_id };
};

describe("GetStatementOperationUseCase", () => {
  it("Should be able to list statement by id", async () => {
    const { sut, statement_id, user_id } = await makeSut();

    const findStatementByIdStatement = await sut.execute({
      user_id,
      statement_id,
    });

    expect(findStatementByIdStatement).toBeTruthy();
    expect(findStatementByIdStatement).toHaveProperty("id");
    expect(findStatementByIdStatement.user_id).toBe(user_id);
  });
});
