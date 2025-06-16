# Contributing to UAV-TeliWEB

First off, thanks for taking the time to contribute! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

- Ensure the bug was not already reported by searching on GitHub under [Issues](https://github.com/Utkarsh56016/UAV-TeliWEB/issues).
- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/Utkarsh56016/UAV-TeliWEB/issues/new). Be sure to include a title and clear description, as much relevant information as possible, and a code sample or an executable test case demonstrating the expected behavior.

### Suggesting Enhancements

- Open a new issue with a clear title and description.
- Explain why this enhancement would be useful.
- Include any relevant links, screenshots, or documentation.

### Pull Requests

1. Fork the repository and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Development Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/Utkarsh56016/UAV-TeliWEB.git
   cd UAV-TeliWEB
   ```
3. Set up a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
4. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
5. Make your changes and test them.
6. Commit your changes with a descriptive commit message.
7. Push to your fork and submit a pull request.

## Style Guide

### Python
- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) style guide.
- Use type hints where appropriate.
- Keep lines under 100 characters.
- Use docstrings for all public modules, functions, classes, and methods.

### JavaScript
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript).
- Use ES6+ features where possible.
- Use meaningful variable and function names.

### Git Commit Messages
- Use the present tense ("Add feature" not "Added feature").
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...").
- Limit the first line to 72 characters or less.
- Reference issues and pull requests liberally after the first line.

## License

By contributing, you agree that your contributions will be licensed under its MIT License.
