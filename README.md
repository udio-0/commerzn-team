# Nexus Studio — Digital Team Card

A mobile-first digital business card / team directory, designed for QR code and NFC tag sharing.  
Built with vanilla HTML, CSS, and JavaScript — no build step required.

---

## Project Structure

```
/
├── index.html          # Team directory (home page)
├── member.html         # Individual card — loads member via ?id= URL param
├── data/
│   └── team.json       # ← All content lives here. Edit this file to update the site.
├── assets/
│   ├── css/style.css
│   ├── js/
│   │   ├── main.js     # Powers index.html
│   │   └── member.js   # Powers member.html
│   └── img/logo.svg
└── .github/workflows/
    └── deploy.yml      # GitHub Actions auto-deploy
```

---

## Deploying to GitHub Pages

### Option A — GitHub Actions (recommended)

1. Push the repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select **GitHub Actions**.
4. Push a commit to `main`. The workflow in `.github/workflows/deploy.yml` will deploy automatically.
5. Your site will be live at `https://<username>.github.io/<repo-name>/`.

### Option B — Deploy from branch (no workflow needed)

1. Push the repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**, select `main`, and set the folder to `/ (root)`.
4. Save. GitHub will deploy within a minute.

### Custom domain (later)

1. In **Settings → Pages → Custom domain**, enter your domain (e.g. `team.nexusstudio.co`).
2. Add a `CNAME` file at the repo root containing just your domain name.
3. Configure a `CNAME` DNS record at your registrar pointing to `<username>.github.io`.

---

## Editing Content

All site content is in **`data/team.json`**. You never need to touch HTML.

### Add a team member

```jsonc
{
  "id": "jane-doe",           // used in the URL: member.html?id=jane-doe
  "name": "Jane Doe",
  "role": "Creative Director",
  "photo": "https://...",     // any image URL, or a relative path like assets/img/jane.jpg
  "email": "jane@nexusstudio.co",
  "phone": "+1 (555) 000-0000",
  "linkedin":  "https://linkedin.com/in/jane-doe",
  "instagram": "https://instagram.com/janedoe",
  "facebook":  "https://facebook.com/janedoe",
  "ceo": false
}
```

- Set `"ceo": true` on exactly one member to feature them in the hero card.
- Any social field can be omitted — its button simply won't appear.

### Add a project

```jsonc
{
  "name": "Project Name",
  "description": "One-sentence summary.",
  "year": 2025,
  "tags": ["Tag1", "Tag2"]
}
```

---

## Local Development

Because the pages use `fetch()` to load `data/team.json`, they must be served over HTTP (not opened as `file://`).

**Quickest option — Node.js:**
```bash
npx serve .
# Visit http://localhost:3000
```

**VS Code:** Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension, right-click `index.html` → *Open with Live Server*.

**Python:**
```bash
python -m http.server 8000
# Visit http://localhost:8000
```

---

## Customising the Theme

Open `assets/css/style.css` and change the two accent variables at the top of `:root`:

```css
--accent:   #7c3aed;   /* primary purple */
--accent-2: #6366f1;   /* secondary indigo */
```

That's it — the gradient, glow, buttons, and badges all update automatically.
