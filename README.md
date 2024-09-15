# Book book bot

## Run
### `npm run start`
### `ngrok http 8000`

## Dashboard
https://dash.deno.com/projects/book-book-bot

## Hosting
https://book-book-bot.deno.dev/

## Local testing
1. Run the app
2. Register server in Telegram `curl https://api.telegram.org/bot<token>/setWebhook?url=<url>`
   replacing <token> with your bot token, and <url> with the full URL of your app along with the path to the webhook handler.
3. Open the bot https://t.me/MySchool_Book_Book_Bot