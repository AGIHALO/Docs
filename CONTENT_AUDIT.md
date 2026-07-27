# Documentation coverage audit

Reviewed against:

- backend production commit `607f79764bbeb0d6776cbdb1b4e05efcacaadcd6`
- frontend production commit `8541b76171d8100bcb8a0de52f8018a4ef801c1b`
- Node SDK and Python SDK source plus existing Memory guides

## Previously documented

- SDK installation and x402 auto-payment
- Memory function calling and direct capture/retrieve
- Custom Keeper endpoint contract, validation, metering, and payouts

## Previously missing or fragmented

- Project ownership, project keys, and client API key boundaries
- Gemini, OpenAI, Anthropic, DeepSeek, and open-source gateway endpoints
- Model selection and project-scoped routing
- Authentication publishable keys and public endpoint flow
- Email/password, Resend delivery, HTML templates, and redirect allowlists
- Google, Apple, GitHub, and Microsoft callback setup
- Session rotation, RS256 access tokens, and JWKS verification
- OAuth Apps authorization-code/PKCE flow
- ERC-8004 registry flow, DNS proof, metadata, and owner proof
- Usage, balance, billing, and x402 behavior
- Unified endpoint and error reference

## Preview-only

The connected-account/token-reuse layer found in the local development tree is
not deployed in the production backend. It is documented only as a product
boundary and does not expose callable production endpoints.
