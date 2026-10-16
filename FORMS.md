# Form submissions

All enquiries and job applications are submitted through **Web3Forms**.

- Endpoint: `https://api.web3forms.com/submit`
- Access key: configured in each form’s `access_key` hidden field (same key used across the site)
- Delivery: submissions are emailed to the inbox linked to that Web3Forms key and are visible in the Web3Forms dashboard

## Forms

| Form | Page | Subject tag |
|------|------|-------------|
| Contact | `/contact/` | New Website Enquiry |
| Sales application | `/careers/apply/` | New Sales Representative Application |
| Free demo | `/free-demo/` | (existing) |
| Premium / Acquisition | respective pages | (existing) |

## Activating / changing delivery

1. Sign in at [web3forms.com](https://web3forms.com/) with the account that owns the access key.
2. Confirm the destination email (currently expected: Collabcreatemarketing@gmail.com).
3. To rotate the key, replace the `access_key` value in every form (search the repo for `access_key`).

No additional server or database is required for the static GitHub Pages deployment. Application data is persisted via Web3Forms (email + dashboard), not discarded in the browser.
