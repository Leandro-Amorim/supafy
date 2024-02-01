
<h1 align="center">
  <br>
  <a href="http://supafy.vercel.app"><img src="https://raw.githubusercontent.com/Leandro-Amorim/supafy/main/setup/img/logo.png" alt="Supafy" width="200"></a>
  <br>
  Supafy
  <br>
</h1>

<h4 align="center">A full-stack Spotify clone made with <a href="https://nextjs.org/" target="_blank">Next.js</a> and <a href="https://supabase.com/" target="_blank">Supabase</a>. You can see a working example at <a href="https://supafy.vercel.app/" target="_blank">supafy.vercel.app</a>.</h4>

> **Note**
> This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Spotify or Supabase.

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#setup">Setup</a> •
  <a href="#credits">Credits</a> •
  <a href="#donate">Donate</a> •
  <a href="#license">License</a>
</p>

![screenshot](https://raw.githubusercontent.com/Leandro-Amorim/supafy/main/setup/img/cover.png)
![screenshot](https://raw.githubusercontent.com/Leandro-Amorim/supafy/main/setup/img/cover2.png)

## Key Features

* User authentication
* RLS Policies
* Search songs by name, artist or album
* Add your favorite playlists to your library or add musics to your Liked Songs
* Create playlists and add songs
* Edit playlists and upload custom covers
* History of playlists played
* Keep listening to your musics without breaks while browsing the site
* Persistent song queue

## Setup

### Prerequisites

Make sure you have a working project in Supabase, with 2 buckets already made: ``images`` and ``musics``, both public. You'll also need a working installation of [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/).

### Step by step

* Run all migrations from ``setup/migrations`` folder using the Supabase CLI or web interface
* From your command line:

```bash
# Clone this repository
$ git clone https://github.com/Leandro-Amorim/supafy

# Go into the repository
$ cd supafy

# Install dependencies
$ npm install
```

* Make sure you have a ``.env`` file in the root folder of the project with the variables ``NEXT_PUBLIC_SUPABASE_URL`` and ``NEXT_PUBLIC_SUPABASE_ANON_KEY`` properly configured according to the Supabase Dashboard.

* You can then run the project in developer mode using:

```bash
# Run the app
$ npm run dev
```

## Credits

This software uses the following open source software:

- [Chakra](https://chakra-ui.com/)
- [Supabase](https://supabase.com)
- [Next.js](https://nextjs.org/)
- [Tailwind](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Fast Average Color](https://github.com/fast-average-color/fast-average-color)
- [Node.js](https://nodejs.org/)

## Donate

If you think this project has helped you in any way or you've learned something new, consider buying me a coffee, I love it!

<a href="https://www.buymeacoffee.com/leandro.n.amorim" target="_blank"><img src="https://raw.githubusercontent.com/Leandro-Amorim/supafy/main/setup/img/coffee.png" alt="Buy Me A Coffee"></a>

## License

Distributed under the MIT License. See ``LICENSE.txt`` for more information.