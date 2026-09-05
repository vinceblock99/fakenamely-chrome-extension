# Chrome Web Store listing copy

**Name (≤ 75 chars):** Fakenamely – Fictional Identity Form Filler

**Short description (≤ 132 chars):**
Fill test forms with a fictional identity: real-format address with a valid ZIP, 555 phone, example.com email, one click.

**Category:** Developer Tools · **Language:** English

**Detailed description:**

Fill sign-up, checkout and account forms with a fictional identity in one click.

Every value is fictional by construction, not by luck:
• Phone numbers come from 555-0100…0199, the range the North American Numbering Plan reserves for fiction — they cannot ring anyone.
• Emails use example.com/.net/.org (RFC 2606), which publish a null MX record and cannot receive mail.
• Addresses pair a real city, state and postal code that agree with each other with an invented street, so they pass form validation and point to no home. 38 countries, each in its own postal format.
• Names, birthdays, usernames and passwords are generated. Nothing describes a real person.

How it works: click the icon, get an identity for the country you choose, press “Fill this form”. Fields are matched by their autocomplete attribute, then by name, id, placeholder and label; state and country dropdowns are matched by option text or code. Works with React, Vue and Angular forms. Copy any field, or the whole record as JSON.

Built for QA engineers who fill the same form fifty times a day, developers testing validation, designers filling mockups, and anyone who would rather not give a real address to a site that only needs a plausible one.

Privacy: no analytics, no tracking, no account. The only request is to the free Fakenamely API. Your last identity is kept locally on your device.

Not for fraud, impersonation, shipping, billing, KYC, banking or government use. Data by fakenamely.com; methodology and sources published at fakenamely.com/methodology.

**Single purpose (store field):** Generate a fictional test identity and fill the current page's form fields with it.

**Permission justifications:**
- activeTab — to write values into the form on the tab where the user presses “Fill this form”, and only then.
- scripting — to run the fill function on that tab.
- storage — to remember the last identity and the chosen country locally.
- Host permission https://fakenamely.com/* — to request identities from the Fakenamely API.

**Privacy policy URL:** https://github.com/vinceblock99/fakenamely-chrome-extension/blob/main/PRIVACY.md (move to https://fakenamely.com/chrome-extension/privacy when that page exists)

**Screenshots to capture (1280×800):** 1) popup with an identity, 2) a checkout form before/after fill, 3) the country selector open, 4) the JSON copy.

**Support URL:** https://fakenamely.com/contact · **Homepage:** https://fakenamely.com
