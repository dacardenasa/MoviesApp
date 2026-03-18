---
name: search-vulnerabilities
description: Helps users identify and fix security vulnerabilities in their code. Use when the user wants to understand how to test for security issues or when they need help creating security tests.
---

Follow these steps to identify and fix security vulnerabilities in your code:

1. **Run a security audit**: Use tools like `yarn audit` to scan your project for known vulnerabilities in your dependencies. This will give you a list of any packages that have security issues.
2. **Apply fixes**: Use `yarn-audit-fix` to automatically update vulnerable packages to their latest secure versions. This will help ensure that your project is protected against known vulnerabilities.
3. **Review code for security best practices**: In addition to fixing known vulnerabilities, review your code for common security issues such as SQL injection, cross-site scripting (XSS), and insecure data handling. Implement best practices to mitigate these risks.
4. **Run tests**: After applying updates, run your test suite to verify that the updates didn't break any functionality. This is crucial to ensure that your application continues to work as expected while also being secure.
