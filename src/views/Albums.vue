    <script>
    import IconGrid from '../components/icons/IconGrid.vue'
    import IconList from '../components/icons/IconList.vue'
    import allSongs from '../data/songs.js'
    import { player } from '../stores/player.js'

    export default {
        components: {IconGrid, IconList},
        computed: {
            albums() {
            let albums = [];
            this.songs.forEach((song) => {
                if (albums.filter(e => e.id === song.album.id).length > 0 == false) {
                    albums.push(song.album);
                }
            });
            return albums;
        }
    },
        methods: {
        
            getArtists(artists) { 
                let x = '';
                let length = Object.keys(artists).length;
                artists.forEach((artist1, index) => {
                    if (index != length - 1) {
                        x = x + artist1.name + ", ";
                    } else { 
                        x = x + artist1.name;
                    }
                });
                return x;
            },
            getAlbumYear(date) {
                return date.split('-')[0];
            },

            getTracks(album) {
                return this.songs.filter(song => song.album.id === album.id).length;
        },
        playAlbum(album) {
        const albumSongs = this.songs.filter(song => song.album.id === album.id);
        if (albumSongs.length > 0) {
            this.player.setPlaylist(albumSongs);
            player.setNowPlaying(albumSongs[0]);
        }
    }

        },
        data() {
            return {
                isIconGrid: false,
                isIconList: true,
                songs: allSongs,
                player
            }
        }
    }
    </script>

    
<template>
    <div id="album-view">
        <div class="wrapper-header">
            <h1>ALBUMS</h1>
            <div class="settings">
                <button id="btn-grid" @click="isIconGrid ? isIconGrid = false : isIconGrid = true, isIconList = false" v-bind:class="{active: isIconGrid}"><IconGrid /></button>
                <button id="btn-list" @click="isIconList ? isIconList = false : isIconList = true, isIconGrid = false" v-bind:class="{active: isIconList}"><IconList /></button>
            </div>
        </div>
        <ul id="list-albums" :class="{grid: isIconGrid}">
            <li class="album" v-for="(album) in albums" @dblclick="playAlbum(album)">
                <img id="img-album" :src="album.images[1].url" />
                <div class="album-info">
                    <h4 id="txt-album-name">{{ album.name }}</h4>
                    <p id="txt-album-artists">{{ getArtists(album.artists) }}</p>
                    <div class="album-year">
                        <p id="txt-album-year">{{ getAlbumYear(album.release_date) }}</p>
                        <p id="txt-album-tracks">{{ getTracks(album) }}</p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
    </template>