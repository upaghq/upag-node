# Changelog

All notable changes to `upag-node` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-01-XX

### Added
- Initial release of upag-node SDK
- Customer resource with CRUD operations
- Payment Methods resource with tokenization support
- Payments resource with create, capture, and cancel operations
- Full TypeScript support with type definitions
- Error handling with detailed error types
- HTTP client with axios
- Comprehensive documentation

### Features
- **Customers**: create, retrieve, update, delete, list
- **Payment Methods**: create, retrieve, delete, list, listByCustomer
- **Payments**: create, retrieve, capture, cancel, list, listByCustomer

[Unreleased]: https://github.com/upag/upag-node/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/upag/upag-node/releases/tag/v1.0.0

