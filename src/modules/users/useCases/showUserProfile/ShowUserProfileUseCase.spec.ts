import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import faker from "faker";

type SutType = {
  sut: ShowUserProfileUseCase;
  userId: string;
};

const makeSut = async (): Promise<SutType> => {
  const inMemoryUsersRepository: InMemoryUsersRepository =
    new InMemoryUsersRepository();

  const createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

  const { id } = await createUserUseCase.execute({
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  });

  const sut = new ShowUserProfileUseCase(inMemoryUsersRepository);

  return {
    sut,
    userId: id ?? "",
  };
};

describe("ShowUserProfileUseCase", () => {
  it("Should be able to list a user profile", async () => {
    const { sut, userId } = await makeSut();

    const findUser = await sut.execute(userId);

    expect(findUser).toBeTruthy();
    expect(findUser.id).toBe(userId);
  });
});
