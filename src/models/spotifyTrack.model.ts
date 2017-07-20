class SpotifyExternalUrls {
  constructor(jsonSpotifyExternalUrl: any) {
    for (let key in jsonSpotifyExternalUrl) {
      if (this.hasOwnProperty(key)) {
        this[key] = jsonSpotifyExternalUrl[key];
      }
    }
  }
  spotify: string = '';
}

class SpotifyArtist {
  constructor(jsonSpotifyArtist: any) {
    for (let key in jsonSpotifyArtist) {
      if (this.hasOwnProperty(key)) {
        this[key] = jsonSpotifyArtist[key];
      }
    }
  }

  name: string = '';
  href: string = '';
  external_urls: SpotifyExternalUrls = null;
}

class SpotifyAlbum {
  constructor(jsonSpotifyAlbum: any) {
    for (let key in jsonSpotifyAlbum) {
      if (this.hasOwnProperty(key)) {
        this[key] = jsonSpotifyAlbum[key];
      }
    }
  }
  id: string = '';
  href: string = '';
  name: string = '';
}

export class SpotifyTrack {
  constructor(jsonSpotifyTrack: any) {
    let that = this;
    for (let key in jsonSpotifyTrack) {
      if (that.hasOwnProperty(key)) {
        if (key === 'album') {
          that[key] = new SpotifyAlbum(jsonSpotifyTrack[key]);
        } else if (key === 'artists') {
           jsonSpotifyTrack[key].forEach(function(artist) {
             that[key].push(new SpotifyArtist(artist));
           });
        } else if (key === 'external_urls') {
             that[key] = new SpotifyExternalUrls(jsonSpotifyTrack[key]);
        } else {
        this[key] = jsonSpotifyTrack[key];
        }
      }
    }
  }

  artists: Array<SpotifyArtist> = new Array<SpotifyArtist>();
  album: SpotifyAlbum = null;
  external_urls: SpotifyExternalUrls = null;
  name: string = '';
  preview_url: string = '';
  id: string = '';
  href: string = '';
}
