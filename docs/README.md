# Documentation

This directory contains the documentation for the Kanva application:

- [High-Level Design (HLD)](./hld.md)
- [Low-Level Design (LLD)](./lld.md)
- [API Reference](../api-reference.md)

Notes:
- The mail/invite flow now uses Nodemailer (SMTP). Configure SMTP by setting `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, and `SMTP_PASS` in `backend/.env`.