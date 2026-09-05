# Privacy policy — Fakenamely Chrome extension

**What the extension does.** It requests a fictional identity from the Fakenamely API
(`https://fakenamely.com/api/v1/identity`) and, when you press "Fill this form", writes that
fictional data into the form fields of the page you are looking at.

**What it collects.** Nothing. The extension has no analytics, no tracking, no accounts, and
sends nothing about you or the pages you visit to anyone. The only network request it makes is
the identity request to fakenamely.com, which carries no page data — only the country you chose.

**What it stores.** The last generated identity and your chosen country, in `chrome.storage.local`
on your own device, so the popup opens with the same fictional person. Nothing is stored anywhere
else. Uninstalling the extension removes it.

**Page access.** The extension reads and writes form fields only on the tab where you press
"Fill this form", through Chrome's `activeTab` permission, and only at that moment. It never
runs in the background and never reads pages you do not act on.

**The data is fictional.** Phone numbers come from the 555-0100…0199 range that the North American
Numbering Plan reserves for fiction; email addresses use example.com/.net/.org, which publish a
null MX record and cannot receive mail; streets are invented. None of it describes a real person.
Use it for testing, demos and privacy on forms that do not need your real details — never for
fraud, impersonation or anything that requires a real identity.

Contact: https://fakenamely.com/contact · Site privacy policy: https://fakenamely.com/privacy
