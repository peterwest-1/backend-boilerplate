import { faker } from "@faker-js/faker";
import request, { gql } from "graphql-request";

const mutation = gql`
  mutation {
  register(input: {
    email: "${faker.internet.email()}",
    password: "${faker.internet.password()}"
  }) {
    user {
      id
      email
      confirmed
    }
    errors {
      field
      message
    }
  }
}
`;

describe("creating a user", () => {
  test("expects a user to be created", async () => {
    const response = await request("http://localhost:4000/graphql", mutation);
    console.log(response);
    expect(response.register.errors).toBeNull();
    expect(response.register.user.confirmed).toBeFalsy();
  });
});
