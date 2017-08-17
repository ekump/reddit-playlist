interface SpotifyImage {
  height: number;
  url: string;
  width: number;
}

export interface SpotifyUser {
  birthdate: string;
  country: string;
  display_name: string;
  email: string;
  external_urls: any;
  followers: any;
  href: string;
  id: string;
  images: Array<SpotifyImage>;
  product: string;
  type: string;
  uri: string;
}
