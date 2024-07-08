"use client"

import styles from "./page.module.css";
import { SONGS } from "./data.js";
import { useState } from "react";
import { Howl } from "howler";

let songAudio = null;

function Song({ data, onClick, playingState }) {
  let buttonClass = data.id == playingState.id && playingState.isPlaying ? styles.pauseButton : styles.playButton;
  let songTitleClass = data.id == playingState.id ? styles.selectedSongTitle : styles.songTitle;

  return (
    <li className={styles.song}>
      <button className={buttonClass} onClick={onClick}></button>
      <div className={styles.songMainInfo}>
        <div className={songTitleClass}>{data.title}</div>
        <div className={styles.songArtist}>{data.artist}</div>
      </div>
      <div className={styles.songLength}>{data.minutes}:{data.seconds.toString().padStart(2, "0")}</div>
    </li>
  );
}

function Playlist({ songs }) {
  const [playingState, setPlayingState] = useState({
    id: null,
    isPlaying: false
  });

  function handleClick(clickedId, fileName) {
    if (playingState.id != clickedId) {
      setPlayingState({
        id: clickedId,
        isPlaying: true
      });

      if (songAudio != null) {
        songAudio.stop();
        songAudio.unload();
      }

      songAudio = new Howl({
        src: [fileName]
      });

      songAudio.on("end", () => {
        setPlayingState({
          id: null,
          isPlaying: false
        });
        songAudio.unload();
      });

      songAudio.play();
    } else {
      if (playingState.isPlaying) {
        setPlayingState({
          id: playingState.id,
          isPlaying: false
        });
        songAudio.pause();
      } else {
        setPlayingState({
          id: playingState.id,
          isPlaying: true
        });
        songAudio.play();
      }
    }
  }

  const rows = [];

  for (const song of songs) {
    rows.push(<Song data={song}
      onClick={handleClick.bind(this, song.id, song.fileName)}
      playingState={playingState}
      key={song.id}/>);
  }

  return <ul className={styles.playlist}>{rows}</ul>;
}

export default function Home() {
  return (
    <div>
      <h1 className={styles.title}>Best Anime Opening Songs</h1>
      <div className={styles.playlistContainer}>
        <Playlist songs={SONGS}/>
      </div>
    </div>
  );
}