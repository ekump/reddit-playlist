interface SpotifyExternalUrls {
  spotify: string;
}

interface SpotifyArtist {
  name: string;
  href: string;
  external_urls: SpotifyExternalUrls;
}

interface SpotifyAlbum {
  id: string;
  href: string;
  name: string;
}

export interface SpotifyTrack {
  artists: Array<SpotifyArtist>;
  album: SpotifyAlbum;
  external_urls: SpotifyExternalUrls;
  name: string;
  preview_url: string;
  id: string;
  href: string;
  uri: string;
}
