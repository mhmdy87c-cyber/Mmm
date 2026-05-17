# Ultimate AI Assistant

A small Netlify app that can:

- Send chat prompts to OpenAI through a serverless function.
- Generate images through OpenAI's image generation API.
- Return a video prompt or an optional placeholder video URL from a Netlify function.

## Project structure

```text
.
├── index.html
├── style.css
├── script.js
├── package.json
├── netlify.toml
├── .env.example
└── netlify/
    └── functions/
        ├── chat.js
        ├── image.js
        └── video.js
```


## How to open the app

You can open the project in two ways:

### Preview the page only

If you only want to see the interface, open `index.html` directly in your browser or serve the folder locally:

```bash
python3 -m http.server 4173
```

Then visit <http://127.0.0.1:4173>. Chat and image generation require the Netlify Functions, so the buttons will only fully work when you use Netlify Dev or deploy to Netlify.

### Run the full app locally

1. Copy `.env.example` to `.env`.
2. Put your OpenAI API key in `.env`.
3. Start Netlify Dev:

   ```bash
   npx netlify-cli dev
   ```

4. Open the local URL printed by Netlify, usually <http://localhost:8888>.

### Open it after deploying

Deploy the folder to Netlify, add `OPENAI_API_KEY` in the Netlify site's environment variables, and open the site URL Netlify gives you.

## Local setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Add your API key to `.env`:

   ```bash
   OPENAI_API_KEY=your_openai_api_key
   ```

3. Start the app with Netlify Dev:

   ```bash
   npx netlify-cli dev
   ```

4. Open the local URL Netlify prints in your terminal.

## Environment variables

| Name | Required | Description |
| --- | --- | --- |
| `OPENAI_API_KEY` | Yes | Server-side OpenAI API key used by the Netlify functions. |
| `OPENAI_TEXT_MODEL` | No | Defaults to `gpt-5.4-mini`. |
| `OPENAI_IMAGE_MODEL` | No | Defaults to `gpt-image-1.5`. |
| `VIDEO_PLACEHOLDER_URL` | No | If set, the video endpoint returns this hosted video URL for previews. |

## Notes

- Never put API keys in `script.js` or any browser file. Keep secrets in Netlify environment variables.
- The video function is intentionally provider-neutral. Add your preferred video provider in `netlify/functions/video.js` when you are ready.
- Run `npm run check` to validate JavaScript syntax.
