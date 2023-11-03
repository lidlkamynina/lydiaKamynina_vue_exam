<script>
    import allSongs from '../data/songs';
    import { player } from '../stores/player';
    import IconCaretUp from '../components/icons/IconCaretUp.vue';
    import IconPlay from '../components/icons/IconPlay.vue';
    import IconHeart from  '../components/icons/IconHeart.vue';
    import { auth } from '/src/stores/auth.js'
    
    
    export default {
        components: { IconHeart, IconPlay, IconCaretUp },
        data(){
            return{
                auth,
                player,
                show_favourites: false,
                songs: allSongs,
                search: '',
                sort: {
                    by: null,
                    order: 'asc'
                },
                show_favorites: false
            }
        },
        methods: {
            handleScroll(event) {
                this.$refs.header.classList.value = event.target.scrollTop > 100 ? 'scrolled' : '';
            },
    
            getTime(time_ms){  //miliseconds are converted to minutes and seconds
                var minutes = Math.floor(time_ms / 60000);
                var seconds = ((time_ms % 60000) / 1000).toFixed(0);
                return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
            },
    
            getArtists(artists) {
                let i = '';
                let len = Object.keys(artists).length;
                artists.forEach((ar, index) => {
                    if (index != len - 1) {
                        i = i + ar.name + ", ";
                    } else {
                        i = i + ar.name;
                    }
                });
                return i;
            },
    
            sortBy(element) {
            if (element === this.sort.element) {
                this.sort.order = this.sort.order === 'asc' ? 'desc' : 'asc';
                this.sort.element = this.sort.order === 'asc' ? null : this.sort.element;
            } else {
                this.sort.element = element;
            }
            switch (this.sort.element) {
                case 'title':
                    this.songs.sort((a, b) => {
                        if (this.sort.order === 'asc') {
                            if (a.name.toLowerCase() < b.name.toLowerCase()) { return -1; }
                            if (a.name.toLowerCase() > b.name.toLowerCase()) { return 1; }
                        } else {
                            if (b.name.toLowerCase() < a.name.toLowerCase()) { return -1; }
                            if (b.name.toLowerCase() > a.name.toLowerCase()) { return 1; }
                        }
                        return 0;
                    });
                    break;

                case 'duration':
                    this.songs.sort((a, b) => {
                        if (this.sort.order === 'asc') {
                            if (a.duration_ms < b.duration_ms) { return -1; }
                            if (a.duration_ms > b.duration_ms) { return 1; }
                        } else {
                            if (b.duration_ms < a.duration_ms) { return -1; }
                            if (b.duration_ms > a.duration_ms) { return 1; }
                        }
                        return 0;
                    });

                    break;
                default:
                    this.songs =allSongs;
                    break;
            }
    
            }, 
    
            selectSong(song){
                player.setNowPlaying(song);
            }
        },
        mounted() {
        player.setPlaylist(this.songs);
    },
        computed: {
            filtered_songs() {
            return this.songs.filter(song => {
                let valid = song.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1;

                if (valid && this.show_favorites) {
                    valid = auth.getFavoriteSongs().includes(song.id);
                }

                return valid;
            });
        }
    },
        
    }
    </script>

<template>
    <div id="songs-view" @scroll="handleScroll">
        <div class="wrapper-header">
            <h1>SONGS</h1>
            <div class="wrapper-search">
                <input v-model="search" id="input-search" placeholder="Search by title..." />
            </div>
            <div class="wrapper-settings">
                <button :class="{ active: show_favorites }" @click="show_favorites = !show_favorites">Show Favorites</button>
            </div>
        </div>
        <div class="wrapper-songs">
            <table cellspacing="0" cellpadding="0">
                <tr ref="header">
                    <th id="th-id" >#</th>
                    <th id="th-title" :class="{active: sort.by === 'title'}" @click="sortBy('title')">
                        Title
                        <div id="td-index">
                        <IconCaretUp v-if="sort.by === 'title'" :class="{ 'flip-vertical': sort-order === 'desc'}" />
                        </div>
                    </th>
                    <th id="th-artist">Artist</th>
                    <th id="th-album">Album</th>
                    <th id="th-duration" :class="{active: sort.by === 'duration'}" @click="sortBy('duration')" >
                        Duration
                        <div id="td-index">
                        <IconCaretUp v-if="sort.by === 'duration'" :class="{ 'flip-vertical': sort-order === 'desc'}" />
                        </div>
                    </th>
                    <th>Favorites</th>
                </tr>
                <!-- Loop goes on this <tr> element -->
                <tr class="song" v-for="(song, index) in filtered_songs" @dblclick="selectSong(song)" v-bind:class="{active: song.id == player.getNowPlayingSongId()}">
                    <td id="td-index">
                        <IconPlay v-if="song.id == player.getNowPlayingSongId()" />
                        <span id="txt-index" v-if="song.id != player.getNowPlayingSongId()">{{ index + 1 }}</span>
                    </td>
                    <td id="td-title">
                        <img :src="song.album.images[1].url" />
                        {{song.name}}
                    </td>
                    <td id="td-artist">{{ getArtists(song.artists) }}</td>
                    <td id="td-album">{{ getArtists(song.artists) }}</td>
                    <td id="td-duration">
                    {{ getTime(song.duration_ms) }}
                    </td>
                    <td id="td-index">
                        <IconHeart @click="auth.toggleFavorite(song.id)" />
                        <span v-if="auth.getFavoriteSongs().includes(song.id)" class="active" ></span>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    </template>
