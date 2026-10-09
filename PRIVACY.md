# Hunch privacy policy

Hunch is a browser extension that finds the paragraph on a web page that answers a question you type. This page describes what it does with data.

## What is sent, and when

When you open the Hunch bar on a page and type a search, the text of that page and your search are sent to your configured API host so that its model can score each paragraph. By default that host is TypeSafe AI (`api.typesafe.ai`). If you set a custom API base URL in settings, requests go to that host instead. Nothing is sent before you open the bar, and nothing is sent from pages where you have not opened it. Closing the bar stops any request in flight.

The page's URL and title are included with the text so the model has context. Your API key is sent in the request's authorization header.

When you use the official TypeSafe endpoint, TypeSafe's handling of that data is governed by their own policies at <https://typesafe.ai/legal/privacy-policy>. If you point Hunch at another host, that host's policies apply instead. Hunch has no server of its own: requests go directly from your browser to the configured API.

## What is stored

Your API key, optional API base URL, and chosen model are stored in the browser's extension storage on your device. They are not synced anywhere by Hunch and are not sent to anyone other than the API host you configured.

## What is not collected

Hunch has no analytics, no telemetry, no crash reporting, no accounts, and no tracking. It does not read your browsing history, other tabs, cookies, or form contents. It does not run on pages you have not opened it on.

## Permissions

- **Access to the API host**: to send searches. `api.typesafe.ai` is allowed by default. A custom base URL requests permission for that host when you save it in settings (or when you open the bar).
- **Active tab and scripting**: to read the text of the page you invoked Hunch on and draw the highlights.
- **Storage**: to keep your key, optional base URL, and model choice.

## Contact

Questions about this policy: open an issue at <https://github.com/tymscar/hunch>.
