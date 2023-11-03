import { reactive } from 'vue'

export const player = reactive({
    playlist   : [],
    now_playing: {}, // SONG OBJECT
    setPlaylist(songs) {
        this.playlist = songs;
        console.log(this.playlist);
    },
    setNowPlaying(song) {
        this.now_playing = song;
        console.log(this.playlist);
    },
    getNowPlayingSongId() {
        return this.now_playing?.id;
    },
    getNowPlaying() {
        return this.now_playing;
    },
    getNowPlayingAlbumID() {
        return this.now_playing?.album?.id ?? null;
    },
    getNowPlayingSongName() {
        return this.now_playing?.name ?? '';
    },
    getNowPlayingSongImage() {
        return this.now_playing?.album?.images[1].url ?? '';
    },
    getNowPlayingArtists() {
        return this.now_playing?.artists?.map(artist => artist.name).join(', ');
    },
    getNowPlayingSongPreview() {
        return this.now_playing?.preview_url;
    },
        getNextSong() {
          if (this.playlist.length === 0) {
            return null; // No songs in the playlist
          }
          const index = this.playlist.findIndex((song) => song.id === this.now_playing.id);
          if (index === -1) {
            return null;}
          const nextIndex = (index + 1) % this.playlist.length;
          return this.playlist[nextIndex];
        },
      
        getPreviousSong() {
          if (this.playlist.length === 0) {
            return null; // No songs in the playlist
          }
          const index = this.playlist.findIndex((song) => song.id === this.now_playing.id);
          if (index === -1) {
            return null;
          }
          const previousIndex = (index - 1 + this.playlist.length) % this.playlist.length;
          return this.playlist[previousIndex];
        },
      
    resetNowPlaying() {
        this.now_playing = {};
    },
});