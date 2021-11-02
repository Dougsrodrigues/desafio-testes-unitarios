import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import faker from "faker";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { User } from "../../entities/User";

type SutTypes = {
  sut: AuthenticateUserUseCase;
  user: User;
  userPassword: string;
};

const makeSut = async (): Promise<SutTypes> => {
  const inMemoryUsersRepository: InMemoryUsersRepository =
    new InMemoryUsersRepository();

  const createUserUseCase: CreateUserUseCase = new CreateUserUseCase(
    inMemoryUsersRepository
  );

  const sut: AuthenticateUserUseCase = new AuthenticateUserUseCase(
    inMemoryUsersRepository
  );

  const userPassword = faker.internet.password();

  const user = await createUserUseCase.execute({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: userPassword,
  });

  return { sut, user, userPassword };
};

describe("AuthenticateUserUseCase", () => {
  it("should be able to authenticate user", async () => {
    const { sut, user, userPassword } = await makeSut();

    const response = await sut.execute({
      email: user.email,
      password: userPassword,
    });

    expect(response.user.email).toBe(user.email);
    expect(response.token).toBeTruthy();
  });
});
