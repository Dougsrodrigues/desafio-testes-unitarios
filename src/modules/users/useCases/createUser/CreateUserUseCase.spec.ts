import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import faker from "faker";

let inMemoryUsersRepository: InMemoryUsersRepository;

let sut: CreateUserUseCase;

const makeSut = async () => {
  inMemoryUsersRepository = new InMemoryUsersRepository();
  sut = new CreateUserUseCase(inMemoryUsersRepository);

  return { sut };
};

describe("CreateUserUseCase", () => {
  it("should be able to create a new user", async () => {
    const { sut } = await makeSut();

    const newUser = await sut.execute({
      name: faker.name.findName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    });

    expect(newUser).toHaveProperty("id");
  });
});
