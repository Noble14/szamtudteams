# Szamtud Teams app

This is my thesis project for Corvinus University of Budapest.

This project is a Teams, app but unlike Microsoft sample apps, you have to configrue Azure AD
manually. It runs via ngrok to provide a more realistic scenario. This is not a production app. It
is mostly made for my thesis and therefore it is a proof of concept.

You can run it with docker after modifying `ngrok.yml` with your authtoken and domain  (which you should configure in ngrok)

```bash
docker build -t user/teamsapp:1.0 . && docker compose up -d --no-deps --build web
```
