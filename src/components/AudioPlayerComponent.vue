<script>
import { player } from '../stores/player';
import IconPlay from './icons/IconPlay.vue';
import IconPause from './icons/IconPause.vue';
import IconNext from './icons/IconNext.vue';
import IconPrev from './icons/IconPrevious.vue';

export default {
    props: ["song_preview_url"],
    components: { IconPlay, IconPause, IconNext, IconPrev },
    data() {
        return {
            player,
            time          : undefined,
            btn_prev      : undefined,
            btn_next      : undefined,
            is_playing    : false,
            audio_playback: undefined,
            audio_time    : 0,
            audio_length  : 0
            
        };
    },
    unmounted() {
        clearInterval(this.audio_playback);
    },
    methods: {
        playSong(preview) {

            this.is_playing      = true;
            this.$refs.audio.src = preview;
            
            this.$refs.audio.play();

            // Start interval 
            this.audio_playback = setInterval(() => {
                this.audio_time   = Math.round(this.$refs.audio.currentTime);
                this.audio_length = Math.round(this.$refs.audio.duration);

                this.$refs.time.style.width = (this.audio_time * 100) / this.audio_length + '%';

                if (this.audio_time == this.audio_length) {
                    if (player.getNextSong()) {
                        return player.setNowPlaying(player.getNextSong());
                    }

                    this.togglePlay();

                    this.is_playing = false;
                    this.$refs.time.style.width = 0;

                    return player.resetNowPlaying();
                } 
            }, 10)
        },
        togglePlay() {
            clearInterval(this.audio_playback);

            this.is_playing = !this.is_playing;

            if (this.is_playing) this.$refs.audio.play();
            else this.$refs.audio.pause();
        }
    },
    computed: {
        now_playing() {
            return player.getNowPlaying();
        },
        song_preview() {
            return player.getNowPlayingSongPreview();
        },
        get_playback_time() {
            return `0:${this.audio_time.toString().length == 1 ? `0${this.audio_time}` : this.audio_time}`
        },
        get_audio_length() {
            return `0:${this.audio_length.toString().length == 1 ? `0${this.audio_length}` : this.audio_length}`
        }
    },
    watch: {
        song_preview(newValue) {
            this.playSong(newValue);
        }
    }
}
</script>

<template>
    <div id="audio-player">
        <audio ref="audio" preload>
            <source :src="song_preview" type="audio/mpeg" />
        </audio>
        <div id="controls">
            <div class="wrapper-song-info">
                <img :src="player.getNowPlayingSongImage()" />
                <div class="song-info">
                    <p class="song-title">{{ player.getNowPlayingSongName() }}</p>
                    <p class="song-artists">{{ player.getNowPlayingArtists() }}</p>
                </div>
            </div>
            <div class="wrapper-playback-controls">
                <div class="playback-controls">

                    <!-- PREVIOUS SONG BUTTON -->
                    <button ref="prev" id="btn-prev"
                        class="prev"
                        @click="player.setNowPlaying(this.player.getPreviousSong())"
                        :disabled="!player.getPreviousSong()">
                        <IconPrev color="#FFF" width="60%" /></button>

                    <!-- PLAY/PAUSE BUTTON -->
                    <button ref="play"
                        class="play"
                        @click="togglePlay()"
                        :disabled="!player.getNowPlayingSongId()">
                        <IconPause v-if="is_playing" color="#FFF" width="60%" />
                        <IconPlay v-else color="#FFF" width="60%" />
                    </button>

                    <!-- NEXT SONG BUTTON -->
                    <button ref="next"
                    class="next"
                    @click="player.setNowPlaying(player.getNextSong())"
                    :disabled="!player.getNextSong()">
                    <IconNext color="#FFF" width="60%" /></button>
                </div>
                <div class="wrapper-audio-track">

                    <!-- PLAYBACK TIME -->
                    <p>{{ get_playback_time }}</p>

                    <!-- PROGRESS BAR -->
                    <div ref="audio-track" class="audio-track">
                        <div ref="time" class="time"></div>
                    </div>

                    <!-- PLAYBACK TOTAL TIME -->
                    <p>{{ get_audio_length }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
#audio-player {
    height          : 100%;
    width           : 100%;
    padding         : 0 1rem;
    border-top      : 1px solid var(--c-accent);
    background-color: var(--c-dark);
    #controls {
        display    : flex;
        height     : 100%;
        align-items: center;
        position   : relative;
        .wrapper-song-info {
            display      : flex;
            align-items  : center;
            width        : 30%;
            position     : absolute;
            padding-right: 1rem;
            height       : inherit;
            img {
                height       : 70%;
                width        : auto;
                border-radius: .25rem;
                margin-right : 1rem;
                z-index      : 0;
                filter       : drop-shadow(10px 20px 30px rgba(144, 64, 241, .4));
            }
            .song-info {
                white-space  : nowrap;
                overflow     : hidden;
                text-overflow: ellipsis;
                margin-right : 2rem;
                .song-title {
                    font-weight : 800;
                    white-space : nowrap;
                    overflow     : hidden;
                    text-overflow: ellipsis;
                }
                .song-artists {
                    opacity      : .8;
                    white-space  : nowrap;
                    overflow     : hidden;
                    text-overflow: ellipsis;
                }
            }
        }
        .wrapper-playback-controls {
            width : 40%;
            margin: 0 30% 0 auto;
            .playback-controls {
                display        : flex;
                width          : 100%;
                justify-content: center;
                margin-bottom  : .5rem;
            }
            .wrapper-audio-track {
                display    : flex;
                align-items: center;
                p {
                    font-size     : .8rem;
                    line-height   : normal;
                    padding-bottom: .2rem;
                    font-weight   : 600;
                    &:last-child {
                        opacity: .5;
                    }
                }
                .audio-track {
                    width           : 100%;
                    height          : 4px;
                    background-color: var(--c-secondary);
                    border-radius   : 2rem;
                    margin          : 0px .5rem;
                    .time {
                        width           : 0;
                        height          : 4px;
                        background-color: var(--c-white);
                        border-radius   : 2rem;
                        filter           : drop-shadow(0 0px 5px rgb(255 255 255 / 20%));
                    }
                }
            }
        }
        .play, .next, .prev {
            margin-right    : .5rem;
            border-radius   : .35rem;
            background-color: transparent;
            height          : 36px;
            width           : 36px;
            display         : flex;
            align-items     : center;
            justify-content : center;
            &[disabled] {
                box-shadow: none;
                opacity   : .4;
                cursor    : default;
            }

        }
        .play {
            background-color: var(--c-primary);
            filter: drop-shadow(0px 4px 10px rgba(144, 64, 241, .1));
        }

        .next {
            color: var(--c-primary);
        }

        .prev {
            color: var(--c-primary);

        }
    }
}
</style>