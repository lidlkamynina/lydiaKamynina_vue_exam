import { reactive } from 'vue'
import router from '/src/router/index.js';

export const auth = reactive({
    user: {
        name: localStorage.getItem("name") ?? "Lydia",
        surname: localStorage.getItem("surname") ?? "Kamynina",
        code: localStorage.getItem("code") ?? "IT21079",
        favorite_songs: JSON.parse(localStorage.getItem("myFavouriteSongs")) ?? []
    },

    is_authenticated: localStorage.is_authenticated ?? false,

    setUserData(name, surname, code){
        this.user.name = name;
        this.user.surname = surname;
        this.user.code = code;
    },

    authenticate(email, password){
        if(email.length > 0 && password.length >= 6){
            localStorage.is_authenticated = true;
            this.is_authenticated = true;
            router.replace('/')
        }
    },

    logout(){
        localStorage.clear();
        this.is_authenticated = false;
        router.replace('/login')
    },

    toggleFavorite(songID){
        const song_index = this.user.favorite_songs.indexOf(songID);

        if (song_index < 0) {
            this.user.favorite_songs.push(songID);
        } else {
            this.user.favorite_songs.splice(song_index);
        }

          localStorage.setItem("fav_songs", this.user.favorite_songs);
        },

    getFavoriteSongs(){
        return this.user.favorite_songs;
    }
});