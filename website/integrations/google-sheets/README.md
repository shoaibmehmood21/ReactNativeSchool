# Record website orders in Google Sheets

Every sign-up from the website (Free, Basic or Enterprise) becomes a row in a Google Sheet, and you get an email for each one. It's free and runs on your Google account.

**About 5 minutes, one time.** The Apps Script editor works best on a computer; on a phone, switch the browser to "Desktop site".

## 1. Create the sheet and add the script

1. Go to [sheets.new](https://sheets.new) and name the spreadsheet, for example **School Connect Orders**.
2. Open **Extensions → Apps Script**.
3. Delete what's in `Code.gs` and paste in the contents of [`Code.gs`](Code.gs) from this folder.
4. Optional: to send notifications somewhere other than your Google account's address, set `NOTIFY_EMAIL` at the top.
5. Click **Save** (the disk icon).

## 2. Publish it as a web app

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**, then **Authorize access**. Choose your account, click **Advanced → Go to (project name)**, then **Allow**. Google shows this warning for any script you write yourself.
5. Copy the **Web app URL**. It looks like `https://script.google.com/macros/s/AKfy…/exec`.

To check it, open that URL in your browser. You should see `{"ok":true,"service":"School Connect order inbox"}`.

## 3. Connect the website

In the GitHub repo, go to **Settings → Secrets and variables → Actions → Variables → New repository variable**:

- **Name:** `ORDER_WEBHOOK_URL`
- **Value:** the web app URL from step 2

Then re-run **Actions → Deploy website to GitHub Pages → Run workflow**. From then on, each order appears as a row with a status (*Awaiting payment*, *New sign-up* or *New lead*), and you get an email you can reply to directly.

## Notes

- **Changing the script later:** use **Deploy → Manage deployments → Edit → Version: New version**. This keeps the URL the same. A *new* deployment gets a new URL.
- **If the sheet is unreachable,** customers still see the bank details and the "Email payment slip" button, so no order is lost.
- The script checks each order (plan, reference format, email) and neutralizes spreadsheet formulas in text fields. The form's hidden spam-trap field stops simple bots.
- Anyone who finds the URL could post fake orders. If that happens, delete the deployment and create a new one to get a new URL.
