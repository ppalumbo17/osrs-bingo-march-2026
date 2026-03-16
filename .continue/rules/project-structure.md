---
name: Project Structure
alwaysApply: false
description: This document provides an overview of the project structure including purpose and file layout
---

# Project Structure Overview

This document provides a high-level overview of the repository structure, including key packages, their purposes, and important components.

---

## Packages

### 1. `/packages/admin-api`

**Purpose**:
The core API package responsible for handling business logic, data processing, and exposing endpoints for client applications.

**Key Components**:

- **Handlers**: Implements API endpoint logic in `handlers/`.
- **Services**: Contains business logic in `features/[feature]/service/`.
- **Schemas**: Validates data using Zod schemas in `features/[feature]/schema/`.
- **Routers**: Defines API routes using TRPC in `features/[feature]/router/`.

**Important Features**:

- Text fields management
- Product-related operations (upsells, labels)
- PDF generation and management
- Order processing and fulfillment

**Database Management**:

- Uses TypeORM-based ORM setup.
- Tracks schema changes with Knex migrations.

---

### 2. `/packages/admin-ui`

**Purpose**:
Provides the administrative interface for managing user accounts, system settings, and monitoring operations.

**Key Components**:

- **Dashboards**: Overview of system health, user activity, and performance metrics.
- **User Management**: Tools for creating, editing, and managing user accounts and permissions.
- **System Settings**: Configuration options for various system parameters.

---

### 3. `/packages/amazon-pdf-gen`

**Purpose**:
Generates PDF documents related to Amazon operations, such as order confirmations, invoices, and packing slips.

**Key Components**:

- **PDF Generation Service**: Core functionality for creating PDFs from templates.
- **Template Management**: Manages PDF templates used for different types of documents.
- **Integration with Amazon API**: Interfaces with Amazon's services to retrieve necessary data for generating PDFs.

---

### 4. `/packages/cart-item-cleanup-cron`

**Purpose**:
Maintains the integrity of cart items by periodically cleaning up outdated or abandoned entries.

**Key Components**:

- **Cron Job Scheduler**: Runs scheduled tasks to identify and remove inactive cart items.
- **Cleanup Logic**: Implements rules for determining which cart items are eligible for cleanup.
- **Logging and Monitoring**: Tracks the execution of cleanup operations and logs relevant events.

---

## Important Components

### 1. Database and Schema

- **ORM Setup**: Defined in `db/database.ts`.
- **Schema Migrations**: SQL schema changes tracked via Knex migrations in `migrations/`.

### 2. Architecture Decisions

- Documented in `adr/[ADR0001-...]` files, following the ADR (Architecture Decision Records) pattern.

### 3. Documentation

- Key documentation files:
  - `docs/access-control.md`: System security and access control policies.
  - `docs/create-bastion-server.md`: Guide for creating a secure bastion server.
  - `docs/cross-env-db-sync.md`: Cross-environment database sync instructions.

### 4. CI/CD

- GitHub Actions workflows:
  - `.github/workflows/pipeline-[env].yaml` for different environments (dev, qa, uat, prod).

### 5. Pre-commit Hooks

- Code quality enforced via Husky in `.husky/pre-commit`.

---

## Key Patterns and Concepts

1. **TRPC Pattern**
   - Uses TRPC for API routing with validation through Zod schemas.
2. **State Management**

   - Follows ADR0003 for state management patterns.

3. **Editable PDFs**

   - Implemented as per ADR0004 using PDF.js and custom annotation layers.

4. **Image Delivery**
   - Uses Cloudinary for image delivery (see ADR0005).

---

## Quick Reference

- **API Endpoints**: Defined in `handlers/`.
- **Business Logic**: Implemented in `features/[feature]/service/`.
- **Validation Schemas**: Located in `features/[feature]/schema/`.
- **Types**: Core types defined in `features/shared/types.ts`.

This structure ensures that each package is clearly documented, providing a comprehensive yet concise overview for quick understanding.
