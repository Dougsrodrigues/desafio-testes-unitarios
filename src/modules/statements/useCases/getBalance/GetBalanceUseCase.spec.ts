import { UsersRepository } from "../../../users/repositories/UsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import faker from "faker";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";

type SutTypes = {
  sut: GetBalanceUseCase;
  user_id: string;
};

const makeSut = async (): Promise<SutTypes> => {
  const inMemoryStatementsRepository: InMemoryStatementsRepository =
    new InMemoryStatementsRepository();

  const inMemoryUsersRepository: InMemoryUsersRepository =
    new InMemoryUsersRepository();

  const createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

  const sut: GetBalanceUseCase = new GetBalanceUseCase(
    inMemoryStatementsRepository,
    inMemoryUsersRepository
  );

  const { id } = await createUserUseCase.execute({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  });

  return { sut, user_id: id ?? "" };
};

describe("GetBalanceUseCase", () => {
  it("Should be able to list all deposit operations", async () => {
    const { sut, user_id } = await makeSut();

    const allStatements = await sut.execute({ user_id });

    expect(allStatements).toBeTruthy();
    expect(allStatements).toHaveProperty("statement");
    expect(allStatements).toHaveProperty("balance");
  });
});
