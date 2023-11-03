<script>
import { auth } from '../stores/auth.js';
import allSongs from '../data/songs.js'
export default {
    data() {
    return {
        auth,
        songs: allSongs,
        first: false,
        second: true,
        newName: auth.user.name,
        newSurname: auth.user.surname,
        newCode: auth.user.code,
        isFavListEmpty: true
    }
    },
    methods: {
        editButton() {
            this.first = true;
            this.second = false;
        },
        cancelButton() {
            this.first = false;
            this.second = true;
        },
        saveButton() {
            this.first = false;
            this.second = true;
            this.auth.setUserData(this.newName, this.newSurname, this.newCode);
        },
        getArtists(artists) {
        let i = '';
        let length = Object.keys(artists).length;
        artists.forEach((artist1, index) => {
            if (index != length - 1) {
                i = i + artist1.name + ", ";
            } else {
                i = i + artist1.name;
            }
            });
            return i;
        },
    },
 computed: {
        myFavouriteSongs() {
            let myFavouriteSongs = [];
            let i = auth.getFavoriteSongs();
            i.forEach((songID) => {
                this.songs.forEach((song) => {
                    if (song.id == songID) {
                    myFavouriteSongs.push(song);
                    }
                });
            });
            return myFavouriteSongs;
        }   
    }
}
</script>


<template>
    <div id="about-view">
        <div class="wrapper-header">
            <h1>ABOUT ME</h1>
            <div class="settings">
                <div v-if="second"><button id="btn-show-favorites" @click="editButton()">Edit Form</button></div>
                <div v-if="first"><button id="btn-show-favorites" @click="cancelButton()" :class="{active: groupOne}">Cancel</button></div>
                <div v-if="first"><button id="btn-save" @click="saveButton()">Save Form</button></div>
            </div>
        </div>
        <form>
            <div class="wrapper-input">
                <label>NAME</label>
                <div v-if="first"><input v-model="newName" id="input-name" /></div>
                <div v-if="second"><p id="txt-name">{{ auth.user.name }}</p></div>
            </div>
            <div class="wrapper-input">
                <label>SURNAME</label>
                <div v-if="first"><input v-model="newSurname" id="input-surname" /></div>
                <div v-if="second"><p id="txt-surname">{{ auth.user.surname }}</p></div>
            </div>
            <div class="wrapper-input">
                <label>STUDENT CODE</label>
                <div v-if="first"><input v-model="newCode" id="input-code" /></div>
                <div v-if="second"><p id="txt-code">{{ auth.user.code }}</p></div>
            </div>
            <div class="wrapper-songs">
                <label>FAVORITE SONGS</label>
                <ul v-if="auth.getFavoriteSongs().length">
                    <li v-for="song in myFavouriteSongs">
                        <img id="img-album" :src="song.album.images[1].url" />
                        <div class="song-info">
                            <p id="txt-song" class="song-name">{{ song.name }}</p>
                            <p id="txt-artist" class="song-artists">{{ getArtists(song.artists) }}</p>
                        </div>
                    </li>
                </ul>
                <div id="txt-empty" class="empty" v-if = "!auth.getFavoriteSongs().length">NO SONGS FOUND</div>
            </div>
        </form>
    </div>
</template>
