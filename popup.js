// Fakenamely form filler — popup logic. No build step, no dependencies.
// Data comes from the free Fakenamely API; the identity is fictional by
// construction (reserved phone ranges in the US, Canada and UK, RFC 2606 email
// domain, invented street).

const API = "https://fakenamely.com/api/v1/identity";

const COUNTRIES = [
  ["united-states", "United States"], ["united-kingdom", "United Kingdom"], ["canada", "Canada"],
  ["australia", "Australia"], ["germany", "Germany"], ["france", "France"], ["spain", "Spain"],
  ["italy", "Italy"], ["netherlands", "Netherlands"], ["belgium", "Belgium"], ["austria", "Austria"],
  ["switzerland", "Switzerland"], ["ireland", "Ireland"], ["portugal", "Portugal"], ["sweden", "Sweden"],
  ["norway", "Norway"], ["denmark", "Denmark"], ["finland", "Finland"], ["poland", "Poland"],
  ["hungary", "Hungary"], ["romania", "Romania"], ["greece", "Greece"], ["turkey", "Turkey"],
  ["ukraine", "Ukraine"], ["russia", "Russia"], ["israel", "Israel"], ["india", "India"],
  ["china", "China"], ["hong-kong", "Hong Kong"], ["taiwan", "Taiwan"], ["japan", "Japan"],
  ["south-korea", "South Korea"], ["vietnam", "Vietnam"], ["thailand", "Thailand"],
  ["indonesia", "Indonesia"], ["brazil", "Brazil"], ["mexico", "Mexico"], ["nigeria", "Nigeria"],
];

const $ = (id) => document.getElementById(id);
const status = (text, kind = "") => { const el = $("status"); el.textContent = text; el.className = `status ${kind}`; };

/** The flat set of values the popup shows and the page filler consumes. */
const flatten = (id) => ({
  name: id.name.full,
  first: id.name.first,
  last: id.name.last,
  email: id.contact.email,
  phone: id.contact.phone,
  street: id.address.street,
  city: id.address.city,
  region: id.address.stateOrRegion,
  regionCode: id.address.stateCode,
  postalCode: id.address.postalCode,
  country: id.address.country,
  countryCode: id.address.countryCode,
  birthday: id.personal.birthday,
  username: id.contact.username,
  password: id.online.password,
});

const LABELS = [
  ["name", "Name"], ["email", "Email"], ["phone", "Phone"], ["street", "Street"], ["city", "City"],
  ["region", "Region"], ["postalCode", "Postal code"], ["country", "Country"], ["birthday", "Birthday"],
  ["username", "Username"], ["password", "Password"],
];

let current = null;

function render(flat) {
  const dl = $("fields");
  dl.textContent = "";
  for (const [key, label] of LABELS) {
    const row = document.createElement("div");
    row.className = "row";
    const dt = document.createElement("dt"); dt.textContent = label;
    const dd = document.createElement("dd"); dd.textContent = flat[key] ?? "";
    const btn = document.createElement("button");
    btn.type = "button"; btn.className = "copy"; btn.textContent = "Copy";
    btn.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(String(flat[key] ?? "")); btn.textContent = "Copied"; btn.classList.add("done"); setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("done"); }, 1200); } catch { status("Clipboard unavailable", "err"); }
    });
    row.append(dt, dd, btn);
    dl.append(row);
  }
}

async function fetchIdentity(country) {
  const url = `${API}?country=${encodeURIComponent(country)}&count=1`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`API responded ${res.status}`);
  const body = await res.json();
  if (!body.success || !Array.isArray(body.data) || body.data.length === 0) throw new Error("Unexpected API response");
  return body.data[0];
}

async function newIdentity() {
  const country = $("country").value;
  $("new").disabled = true;
  status("Generating…");
  try {
    current = await fetchIdentity(country);
    const flat = flatten(current);
    render(flat);
    await chrome.storage.local.set({ country, identity: current });
    status("Fictional identity ready", "ok");
  } catch (e) {
    status(`Could not reach the API: ${e.message}`, "err");
  } finally {
    $("new").disabled = false;
  }
}

/**
 * Runs INSIDE the page. Matches inputs by autocomplete, name, id, placeholder,
 * aria-label and label text, sets values through the native setter and fires
 * input/change so React, Vue and Angular forms notice. Returns the fill count.
 */
function fillForm(flat) {
  const RULES = [
    ["first", /(^|[^a-z])(given|first)[-_ ]?name|^fname$|^firstname$/i],
    ["last", /(family|last|sur)[-_ ]?name|^lname$|^lastname$/i],
    ["email", /e-?mail/i],
    ["phone", /^tel$|phone|mobile|cell|telephone/i],
    ["street", /street|address[-_ ]?(line)?[-_ ]?1?$|^address$|^addr(ess)?1?$|^street-address$|^address-line1$/i],
    ["city", /city|town|locality|address-level2/i],
    ["region", /state|region|province|county|address-level1/i],
    ["postalCode", /zip|postal|postcode|post[-_ ]?code/i],
    ["country", /country/i],
    ["birthday", /birth|^bday$|^dob$|date[-_ ]?of[-_ ]?birth/i],
    ["username", /user[-_ ]?name|^nick(name)?$|^login$|^handle$/i],
    ["password", /pass(word)?|^pwd$/i],
    ["name", /^name$|full[-_ ]?name|your[-_ ]?name|^fullname$|^cardholder/i],
  ];
  const SKIP = /search|query|captcha|coupon|promo|card[-_ ]?number|cc-|cvc|cvv|company|organization|address-line2|address2|apt|suite|unit/i;

  const labelText = (el) => {
    const parts = [];
    if (el.id) { for (const l of document.querySelectorAll(`label[for="${CSS.escape(el.id)}"]`)) parts.push(l.textContent); }
    const wrap = el.closest("label"); if (wrap) parts.push(wrap.textContent);
    return parts.join(" ");
  };
  const keyFor = (el) => {
    const ac = (el.getAttribute("autocomplete") || "").toLowerCase();
    const hint = [ac, el.name, el.id, el.placeholder, el.getAttribute("aria-label") || "", labelText(el)].join(" ").trim();
    if (!hint || SKIP.test(hint)) return null;
    if (el.type === "password") return "password";
    if (el.type === "email") return "email";
    if (el.type === "tel") return "phone";
    if (el.type === "date") return /birth|dob|bday/i.test(hint) ? "birthday" : null;
    // autocomplete tokens are the most reliable signal, so test them first.
    const AC = { "given-name": "first", "family-name": "last", "name": "name", "email": "email", "tel": "phone", "tel-national": "phone", "street-address": "street", "address-line1": "street", "address-level2": "city", "address-level1": "region", "postal-code": "postalCode", "country": "country", "country-name": "country", "bday": "birthday", "username": "username", "new-password": "password", "current-password": "password" };
    for (const token of ac.split(/\s+/)) if (AC[token]) return AC[token];
    for (const [key, re] of RULES) if (re.test(hint)) return key;
    return null;
  };
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== "hidden" && cs.display !== "none"; };
  const setValue = (el, value) => {
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : el instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, "value")?.set;
    el.focus();
    if (setter) setter.call(el, value); else el.value = value;
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.dispatchEvent(new Event("blur", { bubbles: true }));
  };
  const pickOption = (select, candidates) => {
    const norm = (s) => String(s || "").trim().toLowerCase();
    const wanted = candidates.filter(Boolean).map(norm);
    for (const opt of select.options) {
      const t = norm(opt.textContent), v = norm(opt.value);
      if (wanted.includes(t) || wanted.includes(v)) return opt.value;
    }
    for (const opt of select.options) {
      const t = norm(opt.textContent);
      if (wanted.some((w) => w.length > 3 && t.includes(w))) return opt.value;
    }
    return null;
  };

  let filled = 0;
  const seenKeys = new Set();
  const fields = [...document.querySelectorAll("input, textarea, select")].filter((el) => !el.disabled && !el.readOnly && visible(el) && !["hidden", "submit", "button", "checkbox", "radio", "file", "image", "reset", "range", "color"].includes(el.type));
  for (const el of fields) {
    const key = keyFor(el);
    if (!key) continue;
    if (el instanceof HTMLSelectElement) {
      const value = key === "country" ? pickOption(el, [flat.country, flat.countryCode]) : key === "region" ? pickOption(el, [flat.region, flat.regionCode]) : null;
      if (value !== null) { setValue(el, value); filled++; }
      continue;
    }
    // Passwords: fill every password box with the same value (confirm fields).
    if (key !== "password" && seenKeys.has(key) && key !== "name") continue;
    let value = flat[key];
    if (key === "region" && el.maxLength > 0 && el.maxLength <= 3) value = flat.regionCode;
    if (key === "country" && el.maxLength > 0 && el.maxLength <= 3) value = flat.countryCode;
    if (value == null || value === "") continue;
    setValue(el, String(value));
    seenKeys.add(key);
    filled++;
  }
  return filled;
}

async function fillActiveTab() {
  if (!current) { status("Generate an identity first", "err"); return; }
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id || !/^https?:/.test(tab.url || "")) { status("Open a normal web page first", "err"); return; }
  $("fill").disabled = true;
  try {
    const results = await chrome.scripting.executeScript({ target: { tabId: tab.id, allFrames: true }, func: fillForm, args: [flatten(current)] });
    const n = results.reduce((sum, r) => sum + (Number(r.result) || 0), 0);
    status(n > 0 ? `Filled ${n} field${n === 1 ? "" : "s"} with fictional data` : "No matching fields found on this page", n > 0 ? "ok" : "");
  } catch (e) {
    status(`Could not fill this page: ${e.message}`, "err");
  } finally {
    $("fill").disabled = false;
  }
}

async function init() {
  const select = $("country");
  for (const [slug, label] of COUNTRIES) { const o = document.createElement("option"); o.value = slug; o.textContent = label; select.append(o); }
  const saved = await chrome.storage.local.get(["country", "identity"]);
  select.value = saved.country || "united-states";
  if (saved.identity) { current = saved.identity; render(flatten(current)); status("Last fictional identity restored", "ok"); }
  else await newIdentity();
  select.addEventListener("change", newIdentity);
  $("new").addEventListener("click", newIdentity);
  $("fill").addEventListener("click", fillActiveTab);
  $("copy-json").addEventListener("click", async () => {
    if (!current) return;
    try { await navigator.clipboard.writeText(JSON.stringify(current, null, 2)); status("Identity copied as JSON", "ok"); } catch { status("Clipboard unavailable", "err"); }
  });
}

init();
