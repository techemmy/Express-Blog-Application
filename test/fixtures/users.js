const usersForRegistration = {
    withShortUsername: {
        username: "test",
        email: "test@gmail.com",
        password: "testuser",
        confirmPassword: "testuser"
    },
    withInvalidEmail: {
        username: "testuser",
        email: "test?",
        password: "testuser",
        confirmPassword: "testuser"
    },
    withShortPassword: {
        username: "testuser",
        email: "testuser@test.com",
        password: "test",
        confirmPassword: "test"
    },
    withPasswordAndConfirmPasswordFieldMismatched: {
        username: "testuser",
        email: "testuser@test.com",
        password: "testnouser",
        confirmPassword: "testuser"
    },
    validUser: {
        username: "testuser",
        email: "testuser@test.com",
        password: "testuser",
        confirmPassword: "testuser"
    }
}

const usersForLogin = {
    withInvalidEmail: {
        email: "test?",
        password: "testuser",
    },
    withShortPassword: {
        email: "testuser@test.com",
        password: ""
    },
    withIncorrectPassword: {
        email: "testuser@test.com",
        password: "test"
    },
    withUnexistingUser: {
        email: "idont@exist.com",
        password: "testnouser",
    },
    withValidUser: {
        username: "testuser",
        email: "testuser@test.com",
        password: "testuser",
        confirmPassword: "testuser"
    }
}

module.exports = {
    usersForRegistration,
    usersForLogin
}