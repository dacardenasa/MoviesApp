---
name: write-tests
description: Helps users write tests for their code. Use when the user wants to understand how to test a particular piece of functionality or when they need help creating test cases.
---

- Use Jest with React Testing Library
- Place test files in a **tests** directory in the same folder as the source file
- Name test files as [filename].test.ts(x)
- Use @ prefix for imports
- Use should prefix for test descriptions to make them more readable and descriptive
- Use npm run lint:fix to automatically fix linting issues on finishing writing tests

When generate tests, always include:

1. **Test happy paths**: Describe the expected behavior when everything goes right. Use analogies to real-life scenarios to make it relatable. For example, if you're testing a login function, you could compare it to entering a secure building with the correct keycard.
2. **Test edge cases**: Identify and explain scenarios that are less common but still important to test. For instance, if you're testing a function that processes user input, an edge case might be what happens when the input is empty or contains special characters. You could compare this to trying to open a door with a key that has no teeth or one that's too long.
3. **Test error states**: Explain how to test for situations where things go wrong. For example, if you're testing a function that fetches data from an API, you could discuss how to simulate a network failure or an invalid response. This is like preparing for a power outage in a building – you want to make sure the emergency lights turn on and people can still find their way out.
4. **Focus on testing behavior and public API's rather than implementation details**: Emphasize the importance of testing the functionality and expected outcomes rather than the internal workings of the code. This is similar to testing a car's performance by driving it rather than inspecting the engine – you want to ensure it runs smoothly under various conditions without needing to know how every part works.
